"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EntriesDataTable } from "@/components/EntriesDataTable";
import {
  updateEligibility,
  updateMultipleEligibility,
} from "@/utils/apiRequests/curriculum.api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getAppliedStudentsForSubject } from "@/utils/apiRequests/entry.api";
import { useUser } from "@/utils/useUser";
import EligibilityHeader from "@/components/EligibilityHeader";
import EligibilityCell from "@/components/EligibilityCell";
import Timeline from "@/components/Timeline";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const StudentDetails = ({ sub_id, batch_id, studentWiseRemarks }) => {
  const queryClient = useQueryClient();
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("all");
  const [remarksIncluded, setRemarksIncluded] = useState([]);

  const [roleId, setRoleID] = useState(null);
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (user?.role_id) {
      setRoleID(user?.role_id);
    }
  }, [user]);

  const { data, error } = useQuery({
    queryFn: () =>
      roleId == "4" ? getAppliedStudentsForSubject(batch_id, sub_id) : null,
    queryKey: ["students", "subject", sub_id],
    enabled: roleId == "4",
  });

  if (error?.response?.status == 500) {
    window.location.href = "/home";
  }

  const { mutate } = useMutation({
    mutationFn: updateEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(
        ["students", "subject", sub_id],
        ["reamrks", sub_id, batch_id],
      );
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const { mutate: mutateMultiple } = useMutation({
    mutationFn: updateMultipleEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(
        ["students", "subject", sub_id],
        ["reamrks", sub_id, batch_id],
      );
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const onEligibilityChanged = async (s_id, eligibility, remark) => {
    mutate({ batch_id, sub_id, eligibility, s_id, remark });
  };

  const onStatusOptionClicked = (e) => {
    setStatus(e);
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
      accessorKey: "assessment",
      header: "Assessment",
      cell: ({ row }) => {
        return (
          <p className="text-center ">
            {row.original.assessment
              ? +row.original.assessment
                ? row.original.assessment + "%"
                : row.original.assessment
              : "0%"}
          </p>
        );
      },
    },
    {
      id: "Eligibility",
      header: () => (
        <EligibilityHeader
          filteredData={filteredData}
          onMultipleEligibilityChanged={onMultipleEligibilityChanged}
        />
      ),

      cell: ({ row }) => (
        <EligibilityCell
          row={row}
          onEligibilityChanged={onEligibilityChanged}
        />
      ),
    },
    ,
    {
      accessorKey: "remarks",
      header: "Remarks",
      cell: ({ row }) =>
        row.original.remarks.length ? (
          <Popover>
            <PopoverTrigger className="flex py-1 justify-center rounded-md cursor-pointer bg-yellow-300 w-full">
              VIEW
            </PopoverTrigger>
            <PopoverContent className="min-w-64">
              <h1 className="font-bold mb-1 text-lg text-center">Remarks</h1>
              <Timeline
                timelineData={row.original.remarks?.sort(
                  (a, b) => new Date(b.date_time) - new Date(a.date_time),
                )}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <span>{}</span>
        ),
    },
  ];

  const onClearClicked = () => setSearchValue("");

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (data) {
      const onlyProper = data.filter(
        (item) => item.attendance != "M" && item.attendance != "R",
      );

      const remarksIncludedTemp = onlyProper.map((item) => {
        if (studentWiseRemarks[item.s_id]) {
          item.remarks = studentWiseRemarks[item.s_id];
          return item;
        } else {
          item.remarks = [];
          return item;
        }
      });

      setRemarksIncluded(remarksIncludedTemp);
    }
  }, [data]);

  useEffect(() => {
    if (remarksIncluded) {
      let filtData1 = searchValue
        ? remarksIncluded.filter(
            (item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.user_name.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : remarksIncluded;

      let filtData2 = filtData1.filter((item) => {
        return status == "all" ? true : item.eligibility == status;
      });

      setFilteredData(filtData2);
    }
  }, [searchValue, status, remarksIncluded]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between mb-2 items-center sm:items-start">
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
        <div className="flex items-center gap-5">
          <div className="flex gap-1 items-center">
            <p className="text-sm font-semibold">Status &nbsp;</p>
            <Select
              onValueChange={(e) => onStatusOptionClicked(e)}
              defaultValue="all"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status" defaultValue="all" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="true">Eligible</SelectItem>
                  <SelectItem value="false">Not Eligible</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <EntriesDataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
};

export default StudentDetails;
