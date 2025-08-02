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

import {
  applyMedicalExam,
  getStudentMedicalSubjectEligibility,
} from "@/utils/apiRequests/entry.api";
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
import { titleCase } from "@/utils/functions";
import { Badge } from "@/components/ui/badge";

const Form = (request) => {
  const router = useRouter();
  const [examName, setExamName] = useState(null);
  const deg = request.searchParams.deg;
  const batch = request.searchParams.batch;
  const queryClient = useQueryClient();
  const [subjectsArr, setSubjectArr] = useState([]);
  const [formData, setFormData] = useState({ subjects: [] });
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

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

  const { data: medicalEligibilityData } = useQuery({
    queryFn: () => getStudentMedicalSubjectEligibility(batch),
    queryKey: ["student", "medical", "subject", "eligibility"],
  });

  const { status, mutate } = useMutation({
    mutationFn: applyMedicalExam,
    onSuccess: async (res) => {
      queryClient.invalidateQueries(
        ["batchesOfStudent", "medical"],
        ["studentApplicationDetails", "medical"],
        ["student", "medical", "subject", "eligibility"]
      );
      toast.success(res.message);

      router.replace("/home/medical");
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  useEffect(() => {
    if (applicationData?.subjects?.length) {
      const modifiedArr = applicationData?.subjects?.map((obj) => ({
        value: obj.sub_id,
        label: `${obj.sub_code} - ${obj.sub_name}`,
      }));
      setSubjectArr(modifiedArr);
    }
  }, [applicationData]);

  useEffect(() => {
    if (medicalEligibilityData) {
      if (medicalEligibilityData.applied == "true") setIsApplied(true);
    }
  }, [medicalEligibilityData]);

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
            {isApplied ? (
              <span></span>
            ) : (
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
                      menuList: (base) => ({
                        ...base,
                        maxHeight: "200px",
                        overflowY: "auto",
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
            )}
          </div>
          <div className="md:w-[85%] w-full">
            {isApplied &&
            applicationData &&
            applicationData?.subjects?.length ? (
              <div
                className={`my-5 sm:my-10 flex flex-col gap-2 opacity-50 cursor-not-allowed`}
              >
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
                </div>

                {applicationData?.subjects
                  ?.filter(
                    (obj) =>
                      medicalEligibilityData.eligibility[obj.sub_id] ==
                        "true" ||
                      medicalEligibilityData.eligibility[obj.sub_id] ==
                        "false" ||
                      medicalEligibilityData.eligibility[obj.sub_id] == ""
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
                          {medicalEligibilityData.eligibility[obj.sub_id] ==
                          "true" ? (
                            <Badge variant="success" className="capitalize">
                              eligible
                            </Badge>
                          ) : medicalEligibilityData.eligibility[obj.sub_id] ==
                            "false" ? (
                            <Badge variant="failure" className="capitalize">
                              not eligible
                            </Badge>
                          ) : (
                            <Badge variant="pending" className="capitalize">
                              pending
                            </Badge>
                          )}
                        </h1>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
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
                {applicationData?.subjects?.length ? (
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
                  })
                ) : (
                  <h1 className="text-lg font-semibold">
                    No subjects available!
                  </h1>
                )}
              </div>
            )}

            <div className="flex justify-center sm:justify-end">
              {!isApplied &&
              Object.keys(applicationData).length &&
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
