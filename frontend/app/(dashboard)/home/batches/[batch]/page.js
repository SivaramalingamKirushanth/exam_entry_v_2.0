"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getSubjectBybatchAndDepartment,
  getSubjectBybatchId,
} from "@/utils/apiRequests/curriculum.api";
import { numberToOrdinalWord, titleCase } from "@/utils/functions";
import { useUser } from "@/utils/useUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Deadlines from "@/components/Deadlines";
import {
  getBatchDeadlineAndApprovalStatus,
  getDeanDashboardData,
  getHodDashboardData,
  setApproval,
} from "@/utils/apiRequests/entry.api";
import ReportTable from "@/components/ReportTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Batches = () => {
  const [roleId, setRoleID] = useState(null);
  const [selectedTab, setSelectedTab] = useState("g");
  const { data: user } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [btnEnable, setBtnEnable] = useState(false);
  const [editEnable, setEditEnable] = useState(false);
  const queryClient = useQueryClient();

  const batch_id = searchParams.get("batch_id");

  useEffect(() => {
    if (user?.role_id) {
      setRoleID(user?.role_id);
    }
  }, [user]);

  const { data: dashboardData } = useQuery({
    queryFn:
      roleId == "2"
        ? () => getDeanDashboardData({ batch_id })
        : roleId == "3"
        ? () => getHodDashboardData({ batch_id })
        : null,
    queryKey: ["dashboard", batch_id],
    enabled: roleId == "2" || roleId == "3",
  });

  const { data: subjectsOfBatchData, isLoading } = useQuery({
    queryFn: () => {
      if (roleId == "3") return getSubjectBybatchAndDepartment(batch_id);
      if (roleId == "2") return getSubjectBybatchId(batch_id);
      return Promise.reject("Invalid role");
    },
    queryKey: ["subjectsOfBatch", batch_id],
  });

  const { data: approvalAndEnddateOfBatchData } = useQuery({
    queryFn: () => getBatchDeadlineAndApprovalStatus({ batch_id }),
    queryKey: ["approval", batch_id],
  });

  const { status, mutate } = useMutation({
    mutationFn: setApproval,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["approval"]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const onApprove = () => {
    mutate({ batch_id });
  };

  useEffect(() => {
    if (approvalAndEnddateOfBatchData) {
      const end_date = new Date(approvalAndEnddateOfBatchData.end_date);
      if (new Date() < end_date) {
        setEditEnable(true);
        if (approvalAndEnddateOfBatchData.accepted_status == "true") {
          setBtnEnable(false);
        } else {
          setBtnEnable(true);
        }
      } else {
        setEditEnable(false);
        setBtnEnable(false);
        if (approvalAndEnddateOfBatchData.accepted_status != "true") {
          mutate({ batch_id });
        }
      }
    }
  }, [approvalAndEnddateOfBatchData]);

  if (isLoading)
    return (
      <div className="flex justify-end md:justify-center">
        <div className="w-[80%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <Skeleton
              key={i}
              className="sm:w-[30%] h-32 sm:max-w-[30%] rounded-xl"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col">
      <div className="w-[90%] self-center">
        <Deadlines batch_id={batch_id} />
      </div>
      <div className="w-[80%] md:w-[90%] lg:w-[75%] self-end md:self-center flex flex-col gap-y-4">
        <div className="w-32 flex rounded-full shadow-xl bg-white mt-1 overflow-hidden self-center">
          <div
            className={`${
              selectedTab == "g" ? "bg-gray-200" : ""
            } hover:bg-black hover:text-white transition-colors w-1/2 shrink-0 py-2 flex justify-center items-center text-sm font-semibold cursor-pointer`}
            onClick={() => setSelectedTab("g")}
          >
            Grid
          </div>
          <div
            className={`${
              selectedTab == "c" ? "bg-gray-200" : ""
            } hover:bg-black hover:text-white transition-colors w-1/2 shrink-0 py-2 flex justify-center items-center text-sm font-semibold cursor-pointer`}
            onClick={() => setSelectedTab("c")}
          >
            Card
          </div>
        </div>

        <div
          className={`${
            selectedTab == "g" ? "flex" : "hidden"
          } w-full justify-end flex-col items-end gap-3`}
        >
          {dashboardData?.length ? (
            dashboardData.map((batch) => {
              const level_ordinal = numberToOrdinalWord(batch.level);
              const sem_ordinal = numberToOrdinalWord(batch.sem);
              const subjects = [];
              const properData = {};
              const medicalData = {};
              const resitData = {};
              batch.subjects.forEach((subObj) => {
                subjects.push({
                  sub_id: subObj.sub_id,
                  sub_code: subObj.sub_code,
                });
                subObj.students.forEach((stuObj) => {
                  const remarks = subObj.remarks.filter(
                    (remarkObj) => remarkObj.s_id == stuObj.s_id
                  );
                  if (stuObj.exam_type == "P") {
                    properData[stuObj.index_num]
                      ? properData[stuObj.index_num].push({
                          sub_id: subObj.sub_id,
                          sub_code: subObj.sub_code,
                          user_name: stuObj.user_name,
                          s_id: stuObj.s_id,
                          eligibility: stuObj.eligibility,
                          remarks,
                        })
                      : (properData[stuObj.index_num] = [
                          {
                            sub_id: subObj.sub_id,
                            sub_code: subObj.sub_code,
                            user_name: stuObj.user_name,
                            s_id: stuObj.s_id,
                            eligibility: stuObj.eligibility,
                            remarks,
                          },
                        ]);
                  } else if (stuObj.exam_type == "M") {
                    medicalData[stuObj.index_num]
                      ? medicalData[stuObj.index_num].push({
                          sub_id: subObj.sub_id,
                          user_name: stuObj.user_name,
                          s_id: stuObj.s_id,
                          eligibility: stuObj.eligibility,
                          remarks,
                        })
                      : (medicalData[stuObj.index_num] = [
                          {
                            sub_id: subObj.sub_id,
                            sub_code: subObj.sub_code,
                            user_name: stuObj.user_name,
                            s_id: stuObj.s_id,
                            eligibility: stuObj.eligibility,
                            remarks,
                          },
                        ]);
                  } else if (stuObj.exam_type == "R") {
                    resitData[stuObj.index_num]
                      ? resitData[stuObj.index_num].push({
                          sub_id: subObj.sub_id,
                          sub_code: subObj.sub_code,
                          user_name: stuObj.user_name,
                          s_id: stuObj.s_id,
                          eligibility: stuObj.eligibility,
                          remarks,
                        })
                      : (resitData[stuObj.index_num] = [
                          {
                            sub_id: subObj.sub_id,
                            sub_code: subObj.sub_code,
                            user_name: stuObj.user_name,
                            s_id: stuObj.s_id,
                            eligibility: stuObj.eligibility,
                            remarks,
                          },
                        ]);
                  }
                });
              });

              return (
                <div key={batch.batch_id} className="w-full">
                  <h1 className="uppercase text-2xl font-bold text-center my-3">
                    {level_ordinal} examination in {batch.course_title} -{" "}
                    {batch.academic_year} - {sem_ordinal}
                    &nbsp;semester
                  </h1>
                  <div>
                    <h1 className="uppercase text-xl font-semibold text-center my-1 mt-6">
                      Proper
                    </h1>
                    <ReportTable
                      subjects={subjects}
                      data={properData}
                      exam_type="P"
                      batch_id={batch.batch_id}
                      editEnable={editEnable}
                    />

                    <h1 className="uppercase text-xl font-semibold text-center my-1 mt-6">
                      Medical
                    </h1>
                    <ReportTable
                      subjects={subjects}
                      data={medicalData}
                      exam_type="M"
                      batch_id={batch.batch_id}
                      editEnable={editEnable}
                    />

                    <h1 className="uppercase text-xl font-semibold text-center my-1 mt-6">
                      Re-sit
                    </h1>
                    <ReportTable
                      subjects={subjects}
                      data={resitData}
                      exam_type="R"
                      batch_id={batch.batch_id}
                      editEnable={editEnable}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-2xl text-center w-full">No data available!</h1>
          )}
        </div>
        <div
          className={`${
            selectedTab == "c" ? "flex" : "hidden"
          } w-full flex-col sm:flex-row gap-6 flex-wrap`}
        >
          {subjectsOfBatchData && subjectsOfBatchData.length ? (
            subjectsOfBatchData.map((obj) => (
              <Link
                href={{
                  pathname: `${pathname}/subjects/${obj.sub_code}`,
                  query: {
                    sub_id: obj.sub_id,
                    batch_id,
                  },
                }}
                className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
                key={obj.sub_id}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{titleCase(obj.sub_name)}</CardTitle>
                    <CardDescription>{obj.sub_code}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <h1 className="text-2xl text-center w-full">
              No Subjects available!
            </h1>
          )}
        </div>
        <Button
          type="button"
          className="self-end mt-4"
          disabled={!btnEnable}
          onClick={onApprove}
        >
          Approve
        </Button>
      </div>
    </div>
  );
};

export default Batches;
