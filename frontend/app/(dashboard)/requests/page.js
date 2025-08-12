"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentMedicalResitApplications } from "@/utils/apiRequests/entry.api";
import RequestRow from "@/components/RequestRow";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MdCancel } from "react-icons/md";
import Image from "next/image";

const Batches = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const {
    data: requestsData,
    refetch: requestsDataRefetch,
    isLoading: isRequestsDataLoading,
    isError: isRequestsDataError,
  } = useQuery({
    queryFn: getStudentMedicalResitApplications,
    queryKey: ["requests", "medical", "resit"],
  });

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const onClearClicked = () => setSearchValue("");

  useEffect(() => {
    if (requestsData?.length) {
      let filtData1 = searchValue
        ? requestsData.filter((item) =>
            item._user_name.toLowerCase().includes(searchValue.toLowerCase())
          )
        : requestsData;

      // ensuring atleast one subject accpeted
      // let filtData2 = filtData1.filter((item) => {
      //   return item.resit_subs?.length || item.medical_subs?.length
      //     ? true
      //     : false;
      // });
      setFilteredData(filtData1);
    } else {
      setFilteredData([]);
    }
  }, [searchValue, requestsData]);

  return (
    <>
      <div
        className={`${
          isRequestsDataLoading ? "fixed" : "hidden"
        } left-0 top-0 w-full h-full flex justify-center items-center z-50`}
      >
        <Image
          className="w-20 h-20 animate-spin "
          src="https://www.svgrepo.com/show/491270/loading-spinner.svg"
          alt="Loading icon"
          width={80}
          height={80}
        />
      </div>
      <div className="flex justify-end md:justify-center">
        <div className="w-[80%] md:w-[85%] lg:w-[90%] flex flex-col">
          <div className="bg-white rounded-md flex relative self-start">
            <Input
              placeholder="Search by username"
              onChange={(e) => onSearchChange(e)}
              value={searchValue}
              className="md:w-60"
            />
            <span
              className={`${
                searchValue ? "opacity-100 inline-block" : "opacity-0 hidden"
              } text-sm font-medium text-slate-700 absolute top-2 right-2 transition-all duration-200`}
              onClick={onClearClicked}
            >
              <MdCancel className="size-5 cursor-pointer" />
            </span>
          </div>

          <table className="table-auto border border-gray-300 border-separate h-full w-full rounded-md mt-4">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="text-slate-500 px-2 border border-gray-300 font-semibold w-[10%] text-center"
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
                  className="text-slate-500 px-2 border border-gray-300 font-semibold w-[10%] text-center"
                >
                  Action
                </th>
              </tr>
              <tr>
                <th className="text-slate-500 py-2 border border-gray-300 font-semibold w-[25%]">
                  Subjects
                </th>
                <th className="text-slate-500 py-2 border border-gray-300 font-semibold w-[15%]">
                  Reference
                </th>
                <th className="text-slate-500 py-2 border border-gray-300 font-semibold w-[25%]">
                  Subjects
                </th>
                <th className="text-slate-500 py-2 border border-gray-300  font-semibold w-[15%]">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-3">
                <td colSpan="6"></td>
              </tr>
              {filteredData?.map((obj) => (
                <RequestRow obj={obj} key={obj?.s_id + "-" + obj.batch_id} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Batches;
