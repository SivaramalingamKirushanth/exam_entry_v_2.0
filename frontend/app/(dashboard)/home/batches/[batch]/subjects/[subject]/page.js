"use client";

import { useRouter, useSearchParams } from "next/navigation";
import StudentDetails from "./StudentDetails";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  checkSubjectExistOnDepartment,
  checkSubjectExistOnFaculty,
} from "@/utils/apiRequests/curriculum.api";
import { useUser } from "@/utils/useUser";
import {
  getBatchOpenDate,
  getDeadlinesForBatch,
} from "@/utils/apiRequests/batch.api";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import ResitStudentDetails from "./ResitStudentDetails";
import MedicalStudentDetails from "./MedicalStudentDetails";
import { FaQuestionCircle } from "react-icons/fa";

const Subjects = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roleId, setRoleID] = useState(null);
  const [isAnyoneMedicalPending, setIsAnyoneMedicalPending] = useState(false);
  const [isAnyoneResitPending, setIsAnyoneResitPending] = useState(false);
  const { data: user, isLoading } = useUser();
  const [expandId, setExpandId] = useState("r");

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

  const { data: subjectExistData, isError } = useQuery({
    queryFn: () => {
      if (roleId == "3") return checkSubjectExistOnDepartment({ sub_id });
      if (roleId == "2") return checkSubjectExistOnFaculty({ sub_id });
      return Promise.reject("Invalid role");
    },
    queryKey: ["subjectDataDetails", sub_id],
  });

  useEffect(() => {
    if ((subjectExistData && !subjectExistData?.subjectExists) || isError) {
      router.replace(`/home/`);
    }
  }, [subjectExistData, isError]);

  return (
    <div className="flex justify-center overflow-hidden">
      <div className="w-[90%]">
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
            {isAnyoneMedicalPending ? (
              <FaQuestionCircle size={17} className="text-red-500" />
            ) : (
              ""
            )}
          </h1>
          <div
            className={`${
              expandId == "m" ? "h-auto" : "h-0 overflow-hidden"
            } transition-all`}
          >
            <MedicalStudentDetails
              sub_id={sub_id}
              batch_id={batch_id}
              setIsAnyonePending={setIsAnyoneMedicalPending}
            />
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
            {isAnyoneResitPending ? (
              <FaQuestionCircle size={17} className="text-red-500" />
            ) : (
              ""
            )}
          </h1>
          <div
            className={`${
              expandId == "r" ? "h-auto" : "h-0 overflow-hidden"
            } transition-all`}
          >
            <ResitStudentDetails
              sub_id={sub_id}
              batch_id={batch_id}
              setIsAnyonePending={setIsAnyoneResitPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
