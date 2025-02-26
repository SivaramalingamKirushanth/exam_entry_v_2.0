"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllStudents } from "@/utils/apiRequests/user.api";
import { EntriesDataTable } from "@/components/EntriesDataTable";
import {
  updateEligibility,
  updateMultipleEligibility,
} from "@/utils/apiRequests/curriculum.api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getAppliedStudentsForSubject } from "@/utils/apiRequests/entry.api";

const StudentDetails = ({ sub_id, batch_id, deadline }) => {
  const queryClient = useQueryClient();
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const { data, error } = useQuery({
    queryFn: () => getAppliedStudentsForSubject(batch_id, sub_id),
    queryKey: ["students", "subject", sub_id],
  });

  if (error?.response?.status == 500) {
    window.location.href = "/home";
  }

  const { mutate } = useMutation({
    mutationFn: updateEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["students", "subject", sub_id]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const { mutate: mutateMultiple } = useMutation({
    mutationFn: updateMultipleEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["students", "subject", sub_id]);
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
      accessorKey: "attendance",
      header: "Attendance",
      cell: ({ row }) => {
        return (
          <p className="text-center ">
            {row.original.attendance
              ? +row.original.attendance
                ? row.original.attendance + "%"
                : row.original.attendance
              : "0%"}
          </p>
        );
      },
    },
    {
      id: "Eligibility",
      header: () => {
        const [remark, setRemark] = useState("");
        const triggerRef = useRef(null);

        const isAnyoneNotEligible = filteredData.some(
          (stu) => stu.eligibility == "false"
        );
        return (
          <div className="flex justify-between">
            <span>Eligibility</span>
            <Switch
              onClick={(e) => {
                e.preventDefault();
                triggerRef.current.click();
              }}
              checked={!isAnyoneNotEligible}
            />
            <Popover>
              <PopoverTrigger
                ref={triggerRef}
                className="w-[0px]"
              ></PopoverTrigger>
              <PopoverContent className="w-64 h-40 flex flex-col gap-2 items-start">
                <p className="font-semibold flex justify-between text-sm w-full">
                  <span>Enter Remark</span>
                  <span>All/Filtered Students</span>
                </p>
                <Textarea
                  onChange={(e) => setRemark(e.target.value)}
                  onBlur={() => setRemark("")}
                  value={remark}
                />
                <Button
                  className="self-end changeEli"
                  onMouseDown={() => {
                    if (remark) {
                      onMultipleEligibilityChanged(
                        isAnyoneNotEligible + "",
                        remark
                      );
                    }
                  }}
                  disabled={!remark}
                >
                  Change Eligibility
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      cell: ({ row }) => {
        const [remark, setRemark] = useState("");

        return (
          <Popover>
            <PopoverTrigger className="trigger flex justify-center w-full">
              <Switch
                id={row.original.s_id}
                onClick={(e) => {
                  e.preventDefault();
                  e.target.parentElement.click();
                }}
                checked={row.original.eligibility == "true"}
              />
            </PopoverTrigger>
            <PopoverContent className="w-64 h-40 flex flex-col gap-2 items-start">
              <p className="font-semibold flex justify-between text-sm w-full">
                <span>Enter Remark</span>
                <span>{row.original.user_name}</span>
              </p>
              <Textarea
                onChange={(e) => setRemark(e.target.value)}
                onBlur={() => setRemark("")}
                value={remark}
              />
              <Button
                className="self-end changeEli"
                onMouseDown={() => {
                  if (remark) {
                    const val = row.original.eligibility == "true";
                    onEligibilityChanged(row.original.s_id, !val + "", remark);
                  }
                }}
                disabled={!remark}
              >
                Change Eligibility
              </Button>
            </PopoverContent>
          </Popover>
        );
      },
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
      <div className="flex justify-between mb-2 items-start">
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
            } text-sm font-medium text-slate-700 absolute top-2 right-2 transition-all duration-200`}
            onClick={onClearClicked}
          >
            <MdCancel className="size-5 cursor-pointer" />
          </span>
        </div>
        <div className="px-3 py-[0.35rem] border bg-white rounded-md">
          Deadline :{" "}
          {new Date(deadline)
            .toString()
            .slice(4, new Date(deadline).toString().indexOf("GMT"))}
        </div>
      </div>
      <div className="container mx-auto">
        <EntriesDataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
};

export default StudentDetails;
