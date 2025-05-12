"use client";

import { useRouter, useSearchParams } from "next/navigation";
import StudentDetails from "./StudentDetails";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkSubjectExistOnBSL } from "@/utils/apiRequests/curriculum.api";
import { useUser } from "@/utils/useUser";
import {
  getBatchOpenDate,
  getDeadlinesForBatch,
} from "@/utils/apiRequests/batch.api";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import ResitStudentDetails from "./ResitStudentDetails";
import MedicalStudentDetails from "./MedicalStudentDetails";

const Subjects = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roleId, setRoleID] = useState(null);
  const { data: user, isLoading } = useUser();
  const [deadlineObj, setDeadlineObj] = useState({
    lec_deadline: "",
    hod_deadline: "",
    dean_deadline: "",
    stu_deadline: "",
  });
  const [expandId, setExpandId] = useState(null);

  const sub_id = searchParams.get("sub_id");
  const batch_id = searchParams.get("batch_id");

  const expandHandler = (e) => {
    if (e.target.id == expandId) {
      setExpandId(null);
    } else {
      setExpandId(e.target.id);
    }
  };

  useEffect(() => {
    if (user?.role_id) {
      setRoleID(user?.role_id);
    }
  }, [user]);

  const { data: openDateData } = useQuery({
    queryFn: () => getBatchOpenDate(batch_id),
    queryKey: ["batch", "openDate", batch_id],
  });

  const { data: deadlineData } = useQuery({
    queryFn: () => getDeadlinesForBatch(batch_id),
    queryKey: ["batch", "dealines", batch_id],
  });

  const { data: subjectExistData } = useQuery({
    queryFn: () => checkSubjectExistOnBSL({ batch_id, sub_id }),
    queryKey: ["subjectDataDetails", sub_id, batch_id],
    enabled: roleId == "4",
  });

  useEffect(() => {
    if (subjectExistData && !subjectExistData?.subjectExists) {
      router.push("/home");
    }
  }, [subjectExistData]);

  useEffect(() => {
    if (deadlineData && deadlineData.length) {
      setDeadlineObj({
        stu_deadline: deadlineData.filter((obj) => obj.user_type == "5")[0]
          .deadline,
        lec_deadline: deadlineData.filter((obj) => obj.user_type == "4")[0]
          .deadline,
        hod_deadline: deadlineData.filter((obj) => obj.user_type == "3")[0]
          .deadline,
        dean_deadline: deadlineData.filter((obj) => obj.user_type == "2")[0]
          .deadline,
      });
    }
  }, [deadlineData]);

  return (
    <div className="flex justify-center overflow-hidden">
      <div className="w-[90%]">
        <div className="flex px-1 mb-4 text-xs lg:text-sm">
          <div className="self-center text-wrap w-16 text-center text-slate-600">
            {new Date(openDateData?.application_open)
              .toString()
              .slice(
                4,
                new Date(openDateData?.application_open)
                  .toString()
                  .indexOf("GMT")
              )}
          </div>
          <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
            <div className="bg-gradient-to-r from-green-100 to-blue-300 h-1 w-full mt-6 mb-1"></div>
            <div className="bg-gradient-to-r from-green-100 to-green-500 h-1 w-full"></div>
            <div className="flex justify-end self-stretch gap-3">
              <div className="text-green-900 font-serif ">
                Student Submission
              </div>
              <div className="bg-green-500 h-6 w-1"></div>
            </div>
            <div className="absolute right-0 translate-x-1/2 bottom-0 text-green-700  font-semibold  font-mono">
              {new Date(deadlineObj.stu_deadline)
                .toString()
                .slice(
                  4,
                  new Date(deadlineObj.stu_deadline).toString().indexOf("GMT")
                )}
            </div>
          </div>
          <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
            <div className="absolute right-0 translate-x-1/2 top-0 text-blue-700  font-semibold  font-mono">
              {new Date(deadlineObj.lec_deadline)
                .toString()
                .slice(
                  4,
                  new Date(deadlineObj.lec_deadline).toString().indexOf("GMT")
                )}{" "}
            </div>
            <div className="flex justify-end self-stretch gap-3 items-end">
              <div className="text-blue-900 font-serif">Lecturer Review</div>
              <div className="bg-blue-500 h-6 w-1"></div>
            </div>

            <div className="bg-gradient-to-r from-blue-300 to-blue-500 h-1 w-full"></div>
          </div>
          <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
            <div className="bg-gradient-to-r from-orange-100 to-orange-500 h-1 w-full mt-8"></div>
            <div className="flex justify-end self-stretch gap-3 ">
              <div className="text-orange-900 font-serif">HOD Approval</div>
              <div className="bg-orange-500 h-6 w-1"></div>
            </div>
            <div className="absolute right-0 translate-x-1/2 bottom-0 text-orange-700  font-semibold  font-mono">
              {new Date(deadlineObj.hod_deadline)
                .toString()
                .slice(
                  4,
                  new Date(deadlineObj.hod_deadline).toString().indexOf("GMT")
                )}{" "}
            </div>
          </div>
          <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
            <div className="absolute right-0 translate-x-1/4 top-0 text-red-700  font-semibold  font-mono">
              {new Date(deadlineObj.dean_deadline)
                .toString()
                .slice(
                  4,
                  new Date(deadlineObj.dean_deadline).toString().indexOf("GMT")
                )}
            </div>
            <div className="flex justify-end self-stretch gap-3 items-end">
              <div className="text-orange-900 font-serif">Dean Approval</div>
              <div className="bg-red-500 h-6 w-1"></div>
            </div>

            <div className="bg-gradient-to-r from-red-100 to-red-500 h-1 w-full"></div>
          </div>
        </div>
        <div>
          <h1
            className="font-bold mb-3 cursor-pointer flex gap-x-2 items-center"
            id="p"
            onClick={expandHandler}
          >
            {expandId == "p" ? <FaChevronDown /> : <FaChevronRight />}
            Proper
          </h1>
          <div
            className={`${
              expandId == "p" ? "h-auto" : "h-0 overflow-hidden"
            } transition-all`}
          >
            <StudentDetails sub_id={sub_id} batch_id={batch_id} />
          </div>
        </div>
        <div>
          <h1
            className="font-bold mb-3 cursor-pointer flex gap-x-2 items-center"
            id="m"
            onClick={expandHandler}
          >
            {expandId == "m" ? <FaChevronDown /> : <FaChevronRight />}
            Medical
          </h1>
          <div
            className={`${
              expandId == "m" ? "h-auto" : "h-0 overflow-hidden"
            } transition-all`}
          >
            <MedicalStudentDetails sub_id={sub_id} batch_id={batch_id} />
          </div>
        </div>
        <div>
          <h1
            className="font-bold mb-3 cursor-pointer flex gap-x-2 items-center"
            id="r"
            onClick={expandHandler}
          >
            {expandId == "r" ? <FaChevronDown /> : <FaChevronRight />}
            Resit
          </h1>
          <div
            className={`${
              expandId == "r" ? "h-auto" : "h-0 overflow-hidden"
            } transition-all`}
          >
            <ResitStudentDetails sub_id={sub_id} batch_id={batch_id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
