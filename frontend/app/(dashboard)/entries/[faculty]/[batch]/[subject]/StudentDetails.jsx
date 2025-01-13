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
  getAppliedStudentsForSubject,
  updateEligibility,
} from "@/utils/apiRequests/curriculum.api";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import Link from "next/link";

const StudentDetails = ({
  sub_id,
  sub_name,
  sub_code,
  batch_id,
  deadline,
  pathname,
}) => {
  const queryClient = useQueryClient();
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const { data } = useQuery({
    queryFn: () => getAppliedStudentsForSubject(batch_id, sub_id),
    queryKey: ["students", "subject", sub_id],
  });

  const { mutate } = useMutation({
    mutationFn: updateEligibility,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["students", "subject", sub_id]);
      queryClient.invalidateQueries([
        "eligibleStudentsForASubject",
        batch_id,
        sub_id,
      ]);

      toast(res.message);
    },
    onError: (err) => {
      console.log(err);
      toast("Operation failed");
    },
  });

  const onEligibilityChanged = async (e) => {
    let s_id = e.split(":")[0];
    let eligibility = e.split(":")[1];
    mutate({ batch_id, sub_id, eligibility, s_id });
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
            {row.original.attendance == "M"
              ? "Medical"
              : row.original.attendance == "R"
              ? "Resit"
              : row.original.attendance
              ? row.original.attendance + "%"
              : "0%"}
          </p>
        );
      },
    },
    {
      id: "Eligibility",
      header: "Eligibility",
      cell: ({ row }) => {
        return (
          <Switch
            id={row.original.s_id}
            onCheckedChange={(e) => {
              console.log(row.original);

              onEligibilityChanged(row.original.s_id + ":" + e);
            }}
            checked={row.original.eligibility == "true"}
          />
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
        <div className="flex">
          <Link
            href={{
              pathname: `${pathname}/attendance`,
              query: {
                batch_id,
                sub_id,
                sub_name,
                sub_code,
              },
            }}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Generate attendance
          </Link>
        </div>
      </div>
      <div className="container mx-auto">
        <EntriesDataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
};

export default StudentDetails;
