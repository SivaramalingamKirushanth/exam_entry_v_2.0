"use client";

import { usePathname, useSearchParams } from "next/navigation";
import StudentDetails from "./StudentDetails";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRemarksForSubject } from "@/utils/apiRequests/entry.api";

const Students = () => {
  const searchParams = useSearchParams();
  const [studentWiseRemarks, setStudentWiseRemarks] = useState({});

  const sub_id = searchParams.get("sub_id");
  const batch_id = searchParams.get("batch_id");
  const sub_name = searchParams.get("sub_name");
  const sub_code = searchParams.get("sub_code");

  const { data: remarksData } = useQuery({
    queryFn: () => getRemarksForSubject({ batch_id, sub_id }),
    queryKey: ["reamrks", sub_id, batch_id],
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

  return (
    <div className="flex justify-end md:justify-center">
      <div className="w-[95%] md:w-[85%] lg:w-[70%]">
        <StudentDetails
          sub_id={sub_id}
          sub_name={sub_name}
          batch_id={batch_id}
          sub_code={sub_code}
          studentWiseRemarks={studentWiseRemarks}
        />
      </div>
    </div>
  );
};

export default Students;
