"use client";

import { Button } from "@/components/ui/button";
import { getStudentMedicalApplicationDetails } from "@/utils/apiRequests/curriculum.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaMinusCircle } from "react-icons/fa";
import ReactSelect from "react-select";

import { applyMedicalExam } from "@/utils/apiRequests/entry.api";
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
import ExamApplicationPrint from "./ExamApplicationPrint";
import { titleCase } from "@/utils/functions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";

const Form = (request) => {
  const router = useRouter();
  const [examName, setExamName] = useState(null);
  const deg = request.searchParams.deg;
  const batch = request.searchParams.batch;
  const queryClient = useQueryClient();
  const [subjectsArr, setSubjectArr] = useState([]);
  const [formData, setFormData] = useState({ subjects: [] });
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

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
            subjects={formData.subjects}
            onRenderComplete={resolve}
          />
        );
      });

      // Use html2canvas with better settings (same as admission card)
      const quality = 2; // Higher value = better quality
      const canvas = await html2canvas(container, {
        scale: quality,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF with same settings as admission card
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL("image/JPEG", 1.0);

      // Calculate dimensions to fit the page (same as admission card method)
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
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

    const subjects_string = formData.subjects
      ?.map((obj) => obj.value)
      .join(",");

    mutate({ subjects_string, batch_id: batch });
  };

  const handleChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      subjects: selectedOptions,
    }));
  };

  const handleRemove = (value) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((item) => item.value !== value),
    }));
  };

  useEffect(() => {
    if (deg) {
      const degBytes = CryptoJS.AES.decrypt(deg, "uov");
      const originalDegData = JSON.parse(degBytes.toString(CryptoJS.enc.Utf8));
      setExamName(originalDegData);
    }
  }, [deg]);

  const {
    data: applicationData,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getStudentMedicalApplicationDetails(batch),
    queryKey: ["studentApplicationDetails", "medical"],
  });

  const { status, mutate } = useMutation({
    mutationFn: applyMedicalExam,
    onSuccess: async (res) => {
      await generatePDF();

      queryClient.invalidateQueries(
        ["batchesOfStudent", "medical"],
        ["studentApplicationDetails", "medical"]
      );
      toast.success(res.message);
      router.replace("/home");
      router.replace("/home/medical");
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  useEffect(() => {
    if (applicationData?.subjects.length) {
      const modifiedArr = applicationData?.subjects.map((obj) => ({
        value: obj.sub_id,
        label: `${obj.sub_code} - ${obj.sub_name}`,
      }));
      setSubjectArr(modifiedArr);
    }
  }, [applicationData]);

  return (
    <>
      {applicationData && Object.keys(applicationData).length && (
        <div className="flex flex-col items-end md:items-center">
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
            <div className="w-full max-w-md mt-5 flex justify-center">
              <div className="w-[80%] ">
                <ReactSelect
                  value={formData.subjects}
                  onChange={handleChange}
                  options={subjectsArr}
                  isMulti
                  isClearable={false}
                  isDisabled={error || isLoading}
                  name="subjects"
                  placeholder={
                    error
                      ? "Not found"
                      : isLoading
                      ? "Loading..."
                      : "Select subjects"
                  }
                  classNamePrefix="react-select"
                  styles={{
                    multiValue: () => ({ display: "none" }), // hide default chips
                    control: (base) => ({
                      ...base,
                      borderColor: "#ccc",
                      boxShadow: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        borderColor: "#000",
                      },
                    }),
                    menuList: () => ({
                      fontSize: "0.9rem",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      primary25: "#f2f2f2",
                      primary: "black",
                    },
                  })}
                />
              </div>
            </div>
          </div>
          <div className="md:w-[85%] w-full">
            <div className="my-5 sm:my-10 flex flex-col gap-2">
              {formData?.subjects.length ? (
                <div className="hidden sm:flex gap-2 items-center text-sm">
                  <div className="flex-1 flex flex-col sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg  items-center w-full">
                    <h1 className="uppercase w-full sm:w-1/6 shrink-0 text-center text-sm">
                      Subject Code
                    </h1>
                    <h1 className="uppercase w-full sm:w-5/6 shrink-0 text-center text-sm">
                      Subject Name
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
                formData?.subjects.map((obj, ind) => {
                  const sub_id = obj.value;
                  const subject = obj.label
                    .split("-")
                    .map((item) => item.trim());
                  return (
                    <div key={sub_id} className="flex gap-2 items-center">
                      <div className="flex-1 flex flex-col sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg  items-center w-full">
                        <h1 className="uppercase w-full sm:w-1/6 shrink-0 text-center text-sm sm:text-base">
                          {subject[0]}
                        </h1>
                        <h1 className="capitalize w-full sm:w-5/6 shrink-0 text-center text-sm sm:text-base">
                          {subject[1]}
                        </h1>
                      </div>
                      <h1>
                        <FaMinusCircle
                          onClick={() => {
                            handleRemove(sub_id);
                          }}
                          size={20}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        />
                      </h1>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-center sm:justify-end">
              {Object.keys(applicationData).length &&
              Object.keys(formData.subjects)?.length ? (
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
    </>
  );
};

export default Form;
