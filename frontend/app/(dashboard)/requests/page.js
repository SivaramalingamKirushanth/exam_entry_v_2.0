"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RequestDetails from "./RequestDetails";
import { Badge } from "@/components/ui/badge";
import {
  MdOutlineSwapHorizontalCircle,
  MdSwapHorizontalCircle,
} from "react-icons/md";
import { IoMdSwap } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MedicalSubject from "@/components/MedicalSubject";
import ResitSubject from "@/components/ResitSubject";
import { useQuery } from "@tanstack/react-query";
import { getStudentMedicalResitApplications } from "@/utils/apiRequests/entry.api";
import RequestRow from "@/components/RequestRow";
import { useEffect, useState } from "react";

const Batches = () => {
  const {
    data: requestsData,
    refetch: requestsDataRefetch,
    isLoading: isRequestsDataLoading,
    isError: isRequestsDataError,
  } = useQuery({
    queryFn: getStudentMedicalResitApplications,
    queryKey: ["requests"],
  });

  return (
    <div className="flex justify-end md:justify-center">
      <div className="w-[80%] md:w-[85%] lg:w-[90%]">
        <table className="table-auto border border-gray-300 border-separate h-full w-full rounded-md">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="text-slate-500 px-2 border border-gray-300 font-semibold"
              >
                Username
              </th>
              <th
                colSpan={2}
                className="text-slate-500 py-2 border border-gray-300 font-semibold"
              >
                Medical
              </th>
              <th
                colSpan={2}
                className="text-slate-500 py-2 border border-gray-300 font-semibold"
              >
                Resit
              </th>
              <th
                rowSpan={2}
                className="text-slate-500 px-2 border border-gray-300 font-semibold"
              >
                Action
              </th>
            </tr>
            <tr>
              <th className="text-slate-500 py-2 border border-gray-300 font-semibold">
                Subjects
              </th>
              <th className="text-slate-500 py-2 border border-gray-300 font-semibold">
                Reference
              </th>
              <th className="text-slate-500 py-2 border border-gray-300 font-semibold ">
                Subjects
              </th>
              <th className="text-slate-500 py-2 border border-gray-300  font-semibold">
                Reference
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-3">
              <td colSpan="6"></td>
            </tr>
            {requestsData?.map((obj) => (
              <RequestRow obj={obj} key={obj?.s_id + "-" + obj.batch_id} />
            ))}
          </tbody>
        </table>
        {/* <RequestDetails /> */}
      </div>
    </div>
  );
};

export default Batches;
