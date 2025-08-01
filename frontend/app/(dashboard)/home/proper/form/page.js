"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStudentApplicationDetails } from "@/utils/apiRequests/curriculum.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import {
  applyExam,
  getStudentSubjectEligibility,
} from "@/utils/apiRequests/entry.api";
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
import { titleCase } from "@/utils/functions";

const Form = (request) => {
  const router = useRouter();
  const [examName, setExamName] = useState(null);
  const [removedSubjects, setRemovedSubjects] = useState([]);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const deg = request.searchParams.deg;
  const batch_id = request.searchParams.batch_id;
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

  const { data: eligibilityData } = useQuery({
    queryFn: () => getStudentSubjectEligibility(batch_id),
    queryKey: ["student", "subject", "eligibility"],
  });

  console.log(eligibilityData);

  const { status, mutate } = useMutation({
    mutationFn: applyExam,
    onSuccess: async (res) => {
      queryClient.invalidateQueries(
        ["batchesOfStudent"],
        ["studentApplicationDetails"],
        ["student", "subject", "eligibility"]
      );
      toast.success(res.message);

      router.replace("/home/proper");
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const handleSubmit = () => {
    setIsSubmitDialogOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitDialogOpen(false);
    mutate(removedSubjects);
  };

  useEffect(() => {
    if (eligibilityData) {
      const trueExist = Object.values(eligibilityData).some(
        (val) => val == "true"
      );

      if (trueExist) setIsApplied(true);
    }
  }, [eligibilityData]);

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
            <div
              className={`my-5 sm:my-10 flex flex-col gap-2 ${
                isApplied
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 cursor-default"
              }`}
            >
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
                    {isApplied ? (
                      ""
                    ) : (
                      <FaMinusCircle size={20} className="opacity-0" />
                    )}
                  </h1>
                </div>
              ) : (
                <span></span>
              )}
              {applicationData?.subjects?.length &&
                applicationData?.subjects
                  ?.filter((obj) => {
                    if (isApplied) {
                      return eligibilityData[obj.sub_id] != "none";
                    } else {
                      return !removedSubjects.some(
                        (item) => item == obj.sub_id
                      );
                    }
                  })
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
                          {isApplied ? (
                            eligibilityData[obj.sub_id] == "true" ? (
                              <Badge variant="success" className="capitalize">
                                eligible
                              </Badge>
                            ) : (
                              <Badge variant="failure" className="capitalize">
                                not eligible
                              </Badge>
                            )
                          ) : +obj.attendance >= 80 ? (
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
                        {isApplied ? (
                          ""
                        ) : (
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
                        )}
                      </h1>
                    </div>
                  ))}
            </div>
            <div className="flex justify-center sm:justify-end">
              {!isApplied &&
              Object.keys(applicationData).length &&
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
