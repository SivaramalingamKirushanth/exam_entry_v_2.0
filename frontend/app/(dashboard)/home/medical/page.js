"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  getBatchOpenDate,
  getEligibleMedicalBatches,
} from "@/utils/apiRequests/batch.api";
import { useEffect, useRef, useState } from "react";
import { numberToOrdinalWord } from "@/utils/functions";
import CryptoJS from "crypto-js";
import {
  getAllInstructions,
  getAllPayments,
  getEligibleMedicalSubjects,
} from "@/utils/apiRequests/entry.api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import PayingInVoucher from "@/components/PayingInVoucher";
import Model from "./Model";

const StudentMedicalHome = () => {
  const router = useRouter();
  const [invoiceDownloadBatchId, setInvoiceDownloadBatchId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const modelRef = useRef(null);
  const [paymentId, setPaymentId] = useState("");
  const [generating, setGenerating] = useState(false);

  const onInvoiceDownloadClick = (batch_id) => {
    setInvoiceDownloadBatchId(batch_id);
  };

  const onApplyClick = (e) => {
    e.preventDefault();
    const deg = e.currentTarget.dataset.deg;
    const batch = e.currentTarget.dataset.batch;
    const degEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(deg),
      "uov"
    ).toString();

    router.push(
      `/home/medical/form?deg=${encodeURIComponent(
        degEncryptedData
      )}&batch=${batch}`
    );
  };

  const toggleModal = () => {
    isOpen && setPaymentId("");
    setIsOpen((prev) => !prev);
  };

  const onPaymentClicked = (batch_id) => {
    setPaymentId(batch_id);
    toggleModal();
  };

  const {
    data: bathchesOfStudentData,
    isLoading: isBathchesOfStudentLoading,
    isError: isBathchesOfStudentError,
  } = useQuery({
    queryFn: getEligibleMedicalBatches,
    queryKey: ["batchesOfStudent", "medical"],
  });

  const { data: paymentData } = useQuery({
    queryFn: getAllPayments,
    queryKey: ["payments"],
  });

  const { data: subjectData } = useQuery({
    queryFn: () =>
      getEligibleMedicalSubjects({ batch_id: invoiceDownloadBatchId }),
    queryKey: ["eligible", "medical", "subject", invoiceDownloadBatchId],
    enabled: Boolean(invoiceDownloadBatchId),
  });

  const { data: openDateData } = useQuery({
    queryFn: () => getBatchOpenDate(invoiceDownloadBatchId),
    queryKey: ["batch", "openDate", invoiceDownloadBatchId],
    enabled: Boolean(invoiceDownloadBatchId),
  });

  const { data: instructionsdata } = useQuery({
    queryFn: getAllInstructions,
    queryKey: ["instructions"],
  });

  const generatePayingInVoucherPDF = async (paymentDetails) => {
    setInvoiceDownloadBatchId(null);
    if (typeof document === "undefined") {
      console.error("This function can only run in a browser environment.");
      return;
    }

    try {
      setGenerating(true);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      // Create a div element to render the admission card
      const container = document.createElement("div");
      container.style.width = "210mm";
      container.style.padding = "10mm";
      container.style.backgroundColor = "#fff";
      container.style.boxSizing = "border-box";
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.id = `payment-invoice`;
      document.body.appendChild(container);

      // Render the Admission Card
      const root = createRoot(container);
      const renderComplete = new Promise((resolve) => {
        root.render(
          <PayingInVoucher
            paymentDetails={paymentDetails}
            onRenderComplete={resolve}
            instructionsdata={instructionsdata}
          />
        );
      });

      await renderComplete;

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      // Calculate dimensions to fit the page
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if the content exceeds page height
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add image to PDF - ensure it fits on one page
      const contentHeight = Math.min(imgHeight, pageHeight - 10); // Subtract margin
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, contentHeight);

      // Handle content that exceeds page height by adding additional pages
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight - pageHeight;
        let position = -pageHeight;

        while (heightLeft > 0) {
          position = position - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      // Clean up the DOM after rendering the canvas
      document.body.removeChild(container);

      // Save the PDF for the current exam type
      pdf.save(`${paymentDetails.username}_paying_in_voucher.pdf`);
    } catch (error) {
      console.error("Error generating PDFs:", error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (invoiceDownloadBatchId && openDateData && subjectData && paymentData) {
      const generated_date = new Date()
        .toString()
        .slice(4, new Date().toString().indexOf("GMT"));

      const payment_deadline = new Date(openDateData?.payment_end)
        .toString()
        .slice(
          4,
          new Date(openDateData?.payment_end).toString().indexOf("GMT")
        );

      const subjects = subjectData.map((subject) => {
        return {
          sub_code: subject.sub_code.toUpperCase(),
          subject_name: subject.sub_name,
          type: "medical",
        };
      });

      const paymentDetails = {
        username: subjectData[0]?.user_name || "",
        exam_type: "Medical",
        generated_date,
        payment_deadline,
        subjects,
        amounts: paymentData,
      };

      generatePayingInVoucherPDF(paymentDetails);
      setInvoiceDownloadBatchId(null);
    }
  }, [invoiceDownloadBatchId, openDateData, subjectData, paymentData]);

  return (
    <div className="flex justify-center relative">
      <div
        className={`${
          generating ? "fixed" : "hidden"
        } left-0 top-0 w-full h-full flex justify-center items-center bg-white/35 z-50`}
      >
        <img
          className="w-20 h-20 animate-spin "
          src="https://www.svgrepo.com/show/491270/loading-spinner.svg"
          alt="Loading icon"
        />
      </div>

      <div className="hidden sm:block w-[80%] md:w-[85%] rounded-md bg-white">
        <Table>
          <TableCaption>A list of your recent examinations.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Examination</TableHead>
              <TableHead className="max-w-[150px] text-center">
                Status
              </TableHead>
              <TableHead className="max-w-[150px] text-center">
                Actions
              </TableHead>
              <TableHead className="max-w-[150px] text-center">
                Deadline
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bathchesOfStudentData?.length && !isBathchesOfStudentError ? (
              bathchesOfStudentData?.map((batch) => {
                const level_ordinal = numberToOrdinalWord(batch.level);
                const sem_ordinal = numberToOrdinalWord(batch.sem);

                if (new Date(batch.application_open) > new Date()) {
                  return (
                    <TableRow key={batch.batch_id + Math.random() * 10}>
                      <td colSpan={4}>
                        <Skeleton className="w-full h-24 rounded-sm flex flex-col justify-center items-center text-center p-2">
                          <span className="font-semibold">
                            New exam coming soon!
                          </span>
                          <h1 className="font-base uppercase text-center">
                            {level_ordinal} examination in {batch.course_title}{" "}
                            - {batch.academic_year} - {sem_ordinal}
                            &nbsp;semester
                          </h1>
                        </Skeleton>
                      </td>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={batch.batch_id}>
                    <TableCell className="font-medium uppercase text-center">
                      {level_ordinal} examination in {batch.course_title} -{" "}
                      {batch.academic_year} - {sem_ordinal}
                      &nbsp;semester
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          batch.medical_status === "done"
                            ? "success"
                            : batch.medical_status === "payment pending"
                            ? "warning"
                            : batch.medical_status === "pending"
                            ? "pending"
                            : batch.medical_status === "processing"
                            ? "processing"
                            : batch.medical_status === "expired"
                            ? "failure"
                            : "active"
                        }
                        className="uppercase"
                      >
                        {batch.medical_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-y-1  h-full gap-x-2">
                        <Button
                          variant="outline"
                          className="uppercase"
                          data-deg={`${level_ordinal} examination in ${batch.course_title} - ${batch.academic_year} - ${sem_ordinal} semester`}
                          data-batch={batch.batch_id}
                          onClick={(e) => onApplyClick(e)}
                        >
                          {batch.medical_status == "active" ? "apply" : "View"}
                        </Button>

                        {batch.medical_status !== "payment pending" ? (
                          <Button
                            variant="outline"
                            className="uppercase"
                            disabled={true}
                          >
                            Download paying in voucher
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="uppercase"
                            onClick={() =>
                              onInvoiceDownloadClick(batch.batch_id)
                            }
                          >
                            Download paying in voucher
                          </Button>
                        )}

                        {batch.medical_status !== "payment pending" ? (
                          <Button
                            variant="outline"
                            className="uppercase"
                            disabled={true}
                          >
                            Submit receipt no
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="uppercase"
                            onClick={() => onPaymentClicked(batch.batch_id)}
                          >
                            Submit receipt no
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(batch.deadline)
                        .toString()
                        .slice(
                          4,
                          new Date(batch.deadline).toString().indexOf("GMT")
                        )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tr></tr>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="sm:hidden flex flex-col items-center gap-3">
        {isBathchesOfStudentLoading ? (
          [1, 2, 3, 4].map((_, i) => (
            <Skeleton key={i} className="w-full h-48 rounded-md" />
          ))
        ) : (
          <span></span>
        )}

        {bathchesOfStudentData?.length && !isBathchesOfStudentError ? (
          bathchesOfStudentData?.map((batch) => {
            const level_ordinal = numberToOrdinalWord(batch.level);
            const sem_ordinal = numberToOrdinalWord(batch.sem);
            if (new Date(batch.application_open) > new Date()) {
              return (
                <Skeleton
                  key={batch.batch_id + Math.random() * 10}
                  className="w-full h-48 rounded-md flex flex-col justify-center items-center p-4 text-center"
                >
                  <span className="font-semibold">New exam coming soon!</span>
                  <h1 className="font-base uppercase text-center">
                    {level_ordinal} examination in {batch.course_title} -{" "}
                    {batch.academic_year} - {sem_ordinal}
                    &nbsp;semester
                  </h1>
                </Skeleton>
              );
            }

            return (
              <div
                className=" rounded-md text-sm bg-white p-3 gap-3 flex flex-col items-center"
                key={batch.batch_id}
              >
                <h1 className="font-medium uppercase text-center">
                  {level_ordinal} examination in {batch.course_title} -{" "}
                  {batch.academic_year} - {sem_ordinal}
                  &nbsp;semester{" "}
                  <Badge
                    variant={
                      batch.medical_status === "done"
                        ? "success"
                        : batch.medical_status === "payment pending"
                        ? "warning"
                        : batch.medical_status === "pending"
                        ? "pending"
                        : batch.medical_status === "processing"
                        ? "processing"
                        : batch.medical_status === "expired"
                        ? "failure"
                        : "active"
                    }
                    className="uppercase"
                  >
                    {batch.medical_status}
                  </Badge>
                </h1>
                <div className="flex justify-around flex-wrap gap-2 items-center self-stretch">
                  <Button
                    variant="outline"
                    className="uppercase"
                    size="sm"
                    data-deg={`${level_ordinal} examination in ${batch.course_title} - ${batch.academic_year} - ${sem_ordinal} semester`}
                    data-batch={batch.batch_id}
                    onClick={(e) => onApplyClick(e)}
                  >
                    {batch.medical_status == "active" ? "apply" : "View"}
                  </Button>

                  {batch.medical_status !== "payment pending" ? (
                    <Button
                      variant="outline"
                      className="uppercase"
                      size="sm"
                      disabled={true}
                    >
                      Download paying in voucher
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="uppercase"
                      size="sm"
                      onClick={() => onInvoiceDownloadClick(batch.batch_id)}
                    >
                      Download paying in voucher
                    </Button>
                  )}
                  {batch.medical_status !== "payment pending" ? (
                    <Button
                      variant="outline"
                      className="uppercase"
                      disabled={true}
                    >
                      Submit receipt no
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="uppercase"
                      onClick={() => onPaymentClicked(batch.batch_id)}
                    >
                      Submit receipt no
                    </Button>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="font-semibold">Deadline</span>
                  {new Date(batch.deadline)
                    .toString()
                    .slice(
                      4,
                      new Date(batch.deadline).toString().indexOf("GMT")
                    )}
                </div>
              </div>
            );
          })
        ) : (
          <span></span>
        )}
      </div>
      <Model
        paymentId={paymentId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modelRef={modelRef}
        setPaymentId={setPaymentId}
      />
    </div>
  );
};

export default StudentMedicalHome;
