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
import { FaQuestionCircle } from "react-icons/fa";
import ResitStudentDetails from "./ResitStudentDetails";
import MedicalStudentDetails from "./MedicalStudentDetails";
import Deadlines from "@/components/Deadlines";
import { getRemarksForSubject } from "@/utils/apiRequests/entry.api";

const Subjects = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roleId, setRoleID] = useState(null);
  const [isAnyoneMedicalPending, setIsAnyoneMedicalPending] = useState(false);
  const [isAnyoneResitPending, setIsAnyoneResitPending] = useState(false);
  const [studentWiseRemarks, setStudentWiseRemarks] = useState({});
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
    queryFn: () => checkSubjectExistOnBSL({ batch_id, sub_id }),
    queryKey: ["subjectDataDetails", sub_id, batch_id],
    enabled: roleId == "4",
  });

  const { data: remarksData } = useQuery({
    queryFn: () => getRemarksForSubject({ batch_id, sub_id }),
    queryKey: ["reamrks", sub_id, batch_id],
    enabled: roleId == "4",
  });

  useEffect(() => {
    if (remarksData) {
      const tempStudentWiseRemarks = { ...studentWiseRemarks };
      remarksData.forEach((obj) => {
        if (tempStudentWiseRemarks[obj.s_id]) {
          tempStudentWiseRemarks[obj.s_id].push(obj);
        } else {
          tempStudentWiseRemarks[obj.s_id] = [obj];
        }
      });

      setStudentWiseRemarks(tempStudentWiseRemarks);
    }
  }, [remarksData]);

  useEffect(
    (remarksData) => {
      if ((subjectExistData && !subjectExistData?.subjectExists) || isError) {
        router.replace("/home");
      }
    },
    [subjectExistData, isError]
  );

  return (
    <div className="flex justify-center overflow-hidden">
      <div className="w-[90%]">
        <Deadlines batch_id={batch_id} />

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
            <StudentDetails
              sub_id={sub_id}
              batch_id={batch_id}
              studentWiseRemarks={studentWiseRemarks}
            />
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
              studentWiseRemarks={studentWiseRemarks}
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
              studentWiseRemarks={studentWiseRemarks}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
