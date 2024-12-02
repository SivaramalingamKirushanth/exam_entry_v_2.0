"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStudentApplicationDetails } from "@/utils/apiRequests/curriculum.api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";

const Form = (request) => {
  const router = useRouter();
  const [examName, setExamName] = useState(null);
  const [semNo, setSemNo] = useState(null);
  const deg = request.searchParams.deg;
  const sem = request.searchParams.sem;
  useEffect(() => {
    if (deg && sem) {
      const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET;
      const degBytes = CryptoJS.AES.decrypt(deg, secretKey);
      const semBytes = CryptoJS.AES.decrypt(sem, secretKey);
      const originalDegData = JSON.parse(degBytes.toString(CryptoJS.enc.Utf8));
      const originalSemData = JSON.parse(semBytes.toString(CryptoJS.enc.Utf8));
      setExamName(originalDegData);
      setSemNo(originalSemData);
    }
  }, [deg, sem]);

  const { data: applicationData, error } = useQuery({
    queryFn: getStudentApplicationDetails,
    queryKey: ["studentApplicationDetails"],
  });

  if (error) return (window.location.href = "/home");

  return (
    <>
      {applicationData && Object.keys(applicationData).length && (
        <div className="flex justify-end md:justify-center">
          <div className="md:w-[60%]">
            <div className="text-center capitalize font-bold">
              <h1>Faculty of {applicationData?.f_name}</h1>
              <h1>{examName}</h1>
              <h1>{semNo}</h1>
            </div>
            <div className="mt-12 flex justify-between text-sm font-semibold">
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
            <div className="mt-3 flex  text-sm font-semibold">
              <p>
                <span className="uppercase w-20 inline-block">Name</span>
                <span className="uppercase p-2 ">{applicationData?.name}</span>
              </p>
            </div>
            <div className="my-10 flex flex-col items-center gap-2">
              {applicationData?.subjects?.length &&
                applicationData?.subjects?.map((obj) => (
                  <div className="flex px-3 py-4 bg-white rounded-lg justify-between w-full md:w-[80%]">
                    <h1 className="uppercase w-1/6 shrink-0">{obj.sub_code}</h1>
                    <h1 className="capitalize w-4/6 shrink-0">
                      {obj.sub_name}
                    </h1>
                    <h1 className="capitalize w-1/6 shrink-0 text-center">
                      {+obj.attendance.slice(0, obj.attendance.length - 1) >=
                      80 ? (
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
                ))}
            </div>
            <div className="flex justify-end">
              <Link href="/home">
                <Button>Submit</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
