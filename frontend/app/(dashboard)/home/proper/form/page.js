"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStudentApplicationDetails } from "@/utils/apiRequests/curriculum.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter, useSearchParams } from "next/navigation";
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

const Form = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [examName, setExamName] = useState(null);
  const [removedSubjects, setRemovedSubjects] = useState([]);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isApplied, setIsApplied] = useState(true);

  const deg = searchParams.get("deg");
  const batch_id = searchParams.get("batch_id");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (deg) {
      const degBytes = CryptoJS.AES.decrypt(deg, "uov");
      const originalDegData = JSON.parse(degBytes.toString(CryptoJS.enc.Utf8));
      setExamName(originalDegData);
    }
  }, [deg]);

  const { data: applicationData } = useQuery({
    queryFn: getStudentApplicationDetails,
    queryKey: ["studentApplicationDetails"],
  });

  const { data: eligibilityData } = useQuery({
    queryFn: () => getStudentSubjectEligibility(batch_id),
    queryKey: ["student", "subject", "eligibility", batch_id],
    enabled: !!batch_id,
  });

  const { status, mutate } = useMutation({
    mutationFn: applyExam,
    onSuccess: async (res) => {
      queryClient.invalidateQueries({
        queryKey: ["batchesOfStudent"],
      });
      queryClient.invalidateQueries({
        queryKey: ["studentApplicationDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["student", "subject", "eligibility", batch_id],
      });

      toast.success(res.message);
      router.replace("/home/proper");
    },
    onError: () => toast.error("Operation failed"),
  });

  const renderStatusBadge = (statusValue) => {
    // Handle boolean or string inputs
    const s = String(statusValue).toLowerCase();

    if (
      s === "none" ||
      s === "pending" ||
      s === "null" ||
      s === "undefined" ||
      !s
    ) {
      return (
        <Badge variant="secondary" className="capitalize">
          pending
        </Badge>
      );
    }

    if (s === "true" || s === "eligible") {
      return (
        <Badge variant="success" className="capitalize">
          eligible
        </Badge>
      );
    }

    return (
      <Badge variant="failure" className="capitalize">
        not eligible
      </Badge>
    );
  };

  const fmtVal = (v, suffix = "") => {
    if (v === null || v === undefined || v === "none") return "-";
    const num = Number(v);
    if (Number.isFinite(num)) return `${num}${suffix}`;
    return "-";
  };

  // 1. UPDATED: Check 'is_applied' directly (it is a boolean now)
  useEffect(() => {
    if (eligibilityData) {
      setIsApplied(!!eligibilityData.is_applied);
    }
  }, [eligibilityData]);

  const handleSubmit = () => setIsSubmitDialogOpen(true);

  const handleConfirmSubmit = () => {
    setIsSubmitDialogOpen(false);
    mutate(removedSubjects);
  };

  const visibleSubjects = useMemo(() => {
    const subs = applicationData?.subjects || [];
    if (!subs.length) return [];

    const subjectDataMap = eligibilityData?.subjects || {};

    return subs.filter((obj) => {
      // Get the specific record for this subject
      const rec = subjectDataMap[obj.sub_id];

      if (isApplied) {
        // Applied Mode: Show only if data exists and is valid
        // Check rec.overall (string "true"/"false") instead of overall_status
        return rec && rec.overall !== "none" && rec.overall !== undefined;
      }

      // Apply Mode: Show subjects not removed by user
      return !removedSubjects.some((item) => item == obj.sub_id);
    });
  }, [applicationData, eligibilityData, isApplied, removedSubjects]);

  return (
    <>
      {applicationData && Object.keys(applicationData).length ? (
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

            <div className="mt-0 sm:mt-3 flex text-xs sm:text-sm font-semibold px-2">
              <p>
                <span className="uppercase w-20 inline-block">Name</span>
                <span className="uppercase p-2 ">{applicationData?.name}</span>
              </p>
            </div>

            <div
              className={`my-5 sm:my-10 flex flex-col gap-2 ${
                isApplied
                  ? "opacity-100 cursor-not-allowed opacity-75"
                  : "opacity-100 cursor-default"
              }`}
            >
              {visibleSubjects.length ? (
                /* --- HEADER ROW --- */
                <div className="flex gap-2 items-center text-sm">
                  <div className="flex-1 hidden sm:flex sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg items-center w-full">
                    {/* Width: 2/12 */}
                    <h1 className="uppercase w-full sm:w-2/12 shrink-0 text-center text-sm">
                      Subject Code
                    </h1>
                    {/* Width: 4/12 */}
                    <h1 className="uppercase w-full sm:w-4/12 shrink-0 text-center text-sm">
                      Subject Name
                    </h1>
                    {/* Width: 2/12 */}
                    <h1 className="uppercase w-full sm:w-2/12 shrink-0 text-center text-sm">
                      Attendance
                    </h1>
                    {/* Width: 2/12 */}
                    <h1 className="uppercase w-full sm:w-2/12 shrink-0 text-center text-sm">
                      Assessment
                    </h1>
                    {/* Width: 2/12 */}
                    <h1 className="uppercase w-full sm:w-2/12 shrink-0 text-center text-sm">
                      Overall
                    </h1>
                  </div>

                  {/* Placeholder for Remove Icon alignment */}
                  <div className="w-[20px]">
                    {isApplied ? (
                      <span />
                    ) : (
                      <FaMinusCircle size={20} className="opacity-0" />
                    )}
                  </div>
                </div>
              ) : (
                <span />
              )}

              {/* --- DATA ROWS --- */}
              {visibleSubjects.map((obj) => {
                // 2. UPDATED: Access data using the new nested structure
                const rec = eligibilityData?.subjects?.[obj.sub_id] || {};

                // Attendance Data
                const attVal = rec.attendance?.value;
                const attStatus = rec.attendance?.status;
                const attThr = rec.attendance?.threshold;

                // Assessment Data
                const asVal = rec.assessment?.value;
                const asStatus = rec.assessment?.status;
                const asThr = rec.assessment?.threshold;

                // Overall Data
                const overall = rec.overall;

                return (
                  <div key={obj.sub_id} className="flex gap-2 items-center">
                    {/* WHITE FORM BOX */}
                    <div className="flex-1 flex flex-col sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg items-center w-full">
                      {/* Subject Code */}
                      <h1 className="uppercase w-full sm:w-2/12 shrink-0 text-center text-sm sm:text-base font-semibold text-gray-700">
                        {obj.sub_code}
                      </h1>

                      {/* Subject Name */}
                      <h1 className="capitalize w-full sm:w-4/12 shrink-0 text-center text-sm sm:text-base font-medium">
                        {obj.sub_name}
                      </h1>

                      {/* Attendance */}
                      <div className="w-full sm:w-2/12 shrink-0 flex flex-col items-center gap-1 py-2 sm:py-0">
                        <h3 className="sm:hidden text-sm font-semibold">
                          Attendance :
                        </h3>
                        <div className="text-xs sm:text-sm font-semibold">
                          {fmtVal(attVal, "%")}
                          {attThr ? (
                            <span className="text-[10px] sm:text-xs font-normal opacity-70">
                              {` (min ${attThr}%)`}
                            </span>
                          ) : null}
                        </div>
                        {renderStatusBadge(attStatus)}
                      </div>

                      {/* Assessment */}
                      <div className="w-full sm:w-2/12 shrink-0 flex flex-col items-center gap-1 py-2 sm:py-0">
                        <h3 className="sm:hidden text-sm font-semibold">
                          Assessment :
                        </h3>
                        <div className="text-xs sm:text-sm font-semibold">
                          {fmtVal(asVal, "")}
                          {/* Only show threshold if it's greater than 0 */}
                          {asThr && asThr > 0 ? (
                            <span className="text-[10px] sm:text-xs font-normal opacity-70">
                              {` (min ${asThr})`}
                            </span>
                          ) : null}
                        </div>
                        {renderStatusBadge(asStatus)}
                      </div>

                      {/* Overall */}
                      <div className="w-full sm:w-2/12 shrink-0 flex flex-col items-center gap-1 py-2 sm:py-0">
                        <h3 className="sm:hidden text-sm font-semibold">
                          Overall :
                        </h3>
                        {renderStatusBadge(overall)}
                      </div>
                    </div>

                    {/* REMOVE BUTTON */}
                    <div className="w-[20px] flex justify-center">
                      {isApplied ? (
                        <span />
                      ) : (
                        <Drawer>
                          <DrawerTrigger>
                            <FaMinusCircle
                              size={20}
                              className="text-red-500 hover:text-red-600 cursor-pointer transition-colors"
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
                                          !cur.some(
                                            (item) => item == obj.sub_id,
                                          )
                                        ) {
                                          return [...cur, obj.sub_id];
                                        }
                                        return cur;
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
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center sm:justify-end">
              {!isApplied &&
              Object.keys(applicationData).length &&
              applicationData?.subjects?.length !== removedSubjects.length ? (
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
                <span />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Form;
