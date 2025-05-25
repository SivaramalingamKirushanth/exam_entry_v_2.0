"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStudentApplicationDetails } from "@/utils/apiRequests/curriculum.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { applyExam } from "@/utils/apiRequests/entry.api";
import { toast } from "sonner";
import { FaMinusCircle } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { titleCase } from "@/utils/functions";
import ExamApplicationPrint from "./ExamApplicationPrint";
import { createRoot } from "react-dom/client";

const Form = (request) => {
  const router = useRouter();
  const [examName, setExamName] = useState(null);
  const [removedSubjects, setRemovedSubjects] = useState([]);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const deg = request.searchParams.deg;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (deg) {
      const degBytes = CryptoJS.AES.decrypt(deg, "uov");
      const originalDegData = JSON.parse(degBytes.toString(CryptoJS.enc.Utf8));
      setExamName(originalDegData);
    }
  }, [deg]);

  const { data: applicationData, error } = useQuery({
    queryFn: getStudentApplicationDetails,
    queryKey: ["studentApplicationDetails"],
  });

  const { status, mutate } = useMutation({
    mutationFn: applyExam,
    onSuccess: async (res) => {
      await generatePDF();

      queryClient.invalidateQueries(
        ["batchesOfStudent"],
        ["studentApplicationDetails"]
      );
      toast.success(res.message);
      router.replace("/home");
      router.replace("/home/proper");
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const generatePDF = async () => {
    if (typeof document === "undefined") {
      console.error("This function can only run in a browser environment.");
      return;
    }

    try {
      // Create a container with precise A4 dimensions (like admission card method)
      const container = document.createElement("div");
      container.style.width = "210mm";
      container.style.padding = "10mm";
      container.style.backgroundColor = "#fff";
      container.style.boxSizing = "border-box";
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.id = `exam-application-print-container`;

      document.body.appendChild(container);

      const root = createRoot(container);

      await new Promise((resolve) => {
        root.render(
          <ExamApplicationPrint
            applicationData={applicationData}
            examName={examName}
            removedSubjects={removedSubjects}
            onRenderComplete={resolve}
          />
        );
      });

      const quality = 2;
      const canvas = await html2canvas(container, {
        scale: quality,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const imgData = canvas.toDataURL("image/JPEG", 1.0);

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      const contentHeight = Math.min(imgHeight, pageHeight - 10);
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, contentHeight);

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

      // Clean up by removing the container
      document.body.removeChild(container);

      // Save the PDF
      const fileName = `Exam_Application_${
        applicationData?.user_name || "Student"
      }_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      toast.success("Application form downloaded as PDF");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleSubmit = () => {
    setIsSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitDialogOpen(false);
    mutate(removedSubjects);
  };

  useEffect(() => {
    if (error) router.replace("/home/proper");
  }, [error]);

  return (
    <>
      {applicationData && Object.keys(applicationData).length && (
        <div className="flex justify-end md:justify-center">
          <div className="md:w-[60%] w-full">
            <div className="text-center uppercase font-bold">
              <h1 className="font-extrabold tracking-wide sm:text-lg">
                Faculty of {applicationData?.f_name}
              </h1>
              <h1 className="text-sm sm:text-base">{titleCase(examName)}</h1>
            </div>
            <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row justify-between text-xs sm:text-sm font-semibold w-full px-2">
              <p>
                <span className="uppercase w-20 inline-block">Reg No</span>
                <span className="uppercase p-2 ">
                  {applicationData?.user_name}
                </span>
              </p>
              {applicationData?.index_num && (
                <p>
                  <span className="uppercase w-20 inline-block">Index No</span>
                  <span className="uppercase p-2">
                    {applicationData?.index_num}
                  </span>
                </p>
              )}
            </div>
            <div className="mt-0 sm:mt-3 flex text-xs sm:text-sm font-semibold  px-2">
              <p>
                <span className="uppercase w-20 inline-block">Name</span>
                <span className="uppercase p-2 ">{applicationData?.name}</span>
              </p>
            </div>
            <div className="my-5 sm:my-10 flex flex-col gap-2">
              {applicationData?.subjects?.length != removedSubjects.length ? (
                <div className="flex gap-2 items-center text-sm">
                  <div className="flex-1 hidden sm:flex sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg  items-center w-full">
                    <h1 className="uppercase w-full sm:w-1/6 shrink-0 text-center text-sm">
                      Subject Code
                    </h1>
                    <h1 className="uppercase w-full sm:w-4/6 shrink-0 text-center text-sm">
                      Subject Name
                    </h1>
                    <h1 className="uppercase w-full sm:w-1/6 shrink-0 text-center text-sm">
                      Eligibility
                    </h1>
                  </div>
                  <h1>
                    <FaMinusCircle size={20} className="opacity-0" />
                  </h1>
                </div>
              ) : (
                <span></span>
              )}
              {applicationData?.subjects?.length &&
                applicationData?.subjects
                  ?.filter(
                    (obj) => !removedSubjects.some((item) => item == obj.sub_id)
                  )
                  .map((obj, ind) => (
                    <div key={obj.sub_id} className="flex gap-2 items-center">
                      <div className="flex-1 flex flex-col sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg justify-between items-center w-full">
                        <h1 className="uppercase w-full sm:w-1/6 shrink-0 text-center text-sm sm:text-base">
                          {obj.sub_code}
                        </h1>
                        <h1 className="capitalize w-full sm:w-4/6 shrink-0 text-center text-sm sm:text-base">
                          {obj.sub_name}
                        </h1>
                        <h1 className="capitalize w-full sm:w-1/6 shrink-0 text-center text-sm sm:text-base">
                          {+obj.attendance >= 80 ? (
                            <Badge variant="success" className="capitalize">
                              eligible
                            </Badge>
                          ) : (
                            <Badge variant="failure" className="capitalize">
                              not eligible
                            </Badge>
                          )}
                        </h1>
                      </div>
                      <h1>
                        <Drawer>
                          <DrawerTrigger>
                            <FaMinusCircle
                              size={20}
                              className="text-red-500 hover:text-red-600 cursor-pointer"
                            />
                          </DrawerTrigger>
                          <DrawerContent>
                            <div className="mx-auto w-full max-w-sm">
                              <DrawerHeader>
                                <DrawerTitle>
                                  Are you absolutely sure?
                                </DrawerTitle>
                                <DrawerDescription>
                                  The subject {obj.sub_name} - {obj.sub_code}{" "}
                                  will be removed from your application. This
                                  action cannot be undone.
                                </DrawerDescription>
                              </DrawerHeader>
                              <DrawerFooter className="flex justify-center items-center flex-row">
                                <DrawerClose className="inline">
                                  <Button
                                    onClick={() =>
                                      setRemovedSubjects((cur) => {
                                        if (
                                          !removedSubjects.some(
                                            (item) => item == obj.sub_id
                                          )
                                        ) {
                                          let newArr = [...cur, obj.sub_id];
                                          return newArr;
                                        }
                                      })
                                    }
                                    className="hover:bg-red-400 bg-red-500 active:bg-red-400/75"
                                  >
                                    Remove
                                  </Button>
                                </DrawerClose>

                                <DrawerClose className="inline">
                                  <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                              </DrawerFooter>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </h1>
                    </div>
                  ))}
            </div>
            <div className="flex justify-center sm:justify-end">
              {Object.keys(applicationData).length &&
              applicationData?.subjects?.length != removedSubjects.length ? (
                <AlertDialog
                  open={isSubmitDialogOpen}
                  onOpenChange={setIsSubmitDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={handleSubmit}
                      className="h-8 rounded-md px-3 text-xs sm:h-9 sm:px-4 sm:py-2"
                      disabled={status === "pending"}
                    >
                      {status === "pending" ? "Submitting..." : "Submit"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirm Exam Application Submission
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to submit your exam application?
                        <br />
                        <br />
                        <strong>Important:</strong> Once submitted, you will not
                        be able to edit or re-apply for this examination. Please
                        review your selected subjects carefully before
                        confirming.
                        <br />
                        <br />
                        After submission, your application form will be
                        automatically downloaded as a PDF for your records.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmSubmit}
                        className="bg-black"
                      >
                        Confirm & Submit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <span></span>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="fixed -top-[9999px] left-0 opacity-0 pointer-events-none">
        <div id="print-application-form">
          <ExamApplicationPrint
            applicationData={applicationData}
            examName={examName}
            removedSubjects={removedSubjects}
          />
        </div>
      </div>
    </>
  );
};

export default Form;
