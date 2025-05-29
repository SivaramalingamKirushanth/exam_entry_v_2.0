"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EntriesDataTable } from "@/components/EntriesDataTable";
import {
  updateMultipleResitEligibility,
  updateResitEligibility,
} from "@/utils/apiRequests/curriculum.api";
import { toast } from "sonner";
import { getAppliedResitStudentsByBatchAndSubject } from "@/utils/apiRequests/entry.api";

import { useUser } from "@/utils/useUser";

import MedResEligibilityCell from "@/components/MedResEligibilityCell";
import MedResEligibilityHeader from "@/components/MedResEligibilityHeader";

const grades = {
  0: "N/A",
  1: "F",
  2: "E",
  3: "D",
  4: "D+",
  5: "C-",
  6: "C",
};

const ResitStudentDetails = ({
  sub_id,
  batch_id,
  setIsAnyonePending,
  end_date,
}) => {
  const queryClient = useQueryClient();
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [roleId, setRoleID] = useState(null);
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (user?.role_id) {
      setRoleID(user?.role_id);
    }
  }, [user]);

  const { data, error } = useQuery({
    queryFn: () => {
      if (roleId == "3" || roleId == "2")
        return getAppliedResitStudentsByBatchAndSubject(batch_id, sub_id);
      return Promise.reject("Invalid role");
    },
    queryKey: ["students", "resit", "subject", sub_id],
    enabled: roleId == "3" || roleId == "2",
  });

  if (error?.response?.status == 500) {
    window.location.href = "/home";
  }

  const { mutate } = useMutation({
    mutationFn: updateResitEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["students", "resit", "subject", sub_id]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const { mutate: mutateMultiple } = useMutation({
    mutationFn: updateMultipleResitEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["students", "resit", "subject", sub_id]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const onEligibilityChanged = async (s_id, eligibility, remark) => {
    mutate({ batch_id, sub_id, eligibility, s_id, remark });
  };

  const onMultipleEligibilityChanged = async (eligibility, remark) => {
    mutateMultiple({
      batch_id,
      sub_id,
      eligibility,
      s_ids: filteredData.map((stu) => stu.s_id),
      remark,
    });
  };

  const columns = [
    {
      accessorKey: "user_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            User name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "attempt_1",
      header: "Attempt 1",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {grades[row.original.attempt_1] || ""}
        </div>
      ),
    },
    ,
    {
      id: "attempt_2",
      header: "Attempt 2",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {grades[row.original.attempt_2] || ""}
        </div>
      ),
    },
    ,
    {
      id: "attempt_3",
      header: "Attempt 3",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {grades[row.original.attempt_3] || ""}
        </div>
      ),
    },
    {
      id: "Eligibility",
      header: () => (
        <MedResEligibilityHeader
          filteredData={filteredData}
          setIsAnyonePending={setIsAnyonePending}
          end_date={end_date}
          onMultipleEligibilityChanged={onMultipleEligibilityChanged}
        />
      ),

      cell: ({ row }) => (
        <div className="flex justify-center">
          <MedResEligibilityCell
            row={row}
            onEligibilityChanged={onEligibilityChanged}
            end_date={end_date}
          />
        </div>
      ),
    },
  ];

  const onClearClicked = () => setSearchValue("");

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (data) {
      let filtData = searchValue
        ? data.filter(
            (item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.user_name.toLowerCase().includes(searchValue.toLowerCase())
          )
        : data;

      setFilteredData(filtData);
    }
  }, [searchValue, data]);

  return (
    <>
      <div className="flex items-start mb-3">
        <div className="bg-white rounded-md flex relative">
          <Input
            placeholder="Search by name or user name"
            onChange={(e) => onSearchChange(e)}
            value={searchValue}
            className="md:w-60"
          />
          <span
            className={`${
              searchValue ? "opacity-100 inline-block" : "opacity-0 hidden"
            } font-medium text-slate-700 absolute top-2 right-2 transition-all duration-200`}
            onClick={onClearClicked}
          >
            <MdCancel className="size-5 cursor-pointer" />
          </span>
        </div>
      </div>
      <div className="container mx-auto">
        <EntriesDataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
};

export default ResitStudentDetails;
