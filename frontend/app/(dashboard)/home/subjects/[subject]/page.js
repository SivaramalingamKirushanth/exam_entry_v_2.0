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
import { IoIosAlert, IoMdAlert } from "react-icons/io";
import ResitStudentDetails from "./ResitStudentDetails";
import MedicalStudentDetails from "./MedicalStudentDetails";
import Deadlines from "@/components/Deadlines";

const Subjects = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [roleId, setRoleID] = useState(null);
  const [isAnyoneMedicalPending, setIsAnyoneMedicalPending] = useState(false);
  const [isAnyoneResitPending, setIsAnyoneResitPending] = useState(false);
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

  const { data: subjectExistData, isError } = useQuery({
    queryFn: () => checkSubjectExistOnBSL({ batch_id, sub_id }),
    queryKey: ["subjectDataDetails", sub_id, batch_id],
    enabled: roleId == "4",
  });

  useEffect(() => {
    if ((subjectExistData && !subjectExistData?.subjectExists) || isError) {
      router.replace("/home");
    }
  }, [subjectExistData, isError]);

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
        <Deadlines openDateData={openDateData} deadlineObj={deadlineObj} />

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
              <IoMdAlert size={20} className="text-red-500" />
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
              <IoMdAlert size={20} className="text-red-500" />
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
