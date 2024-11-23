"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { FaPen } from "react-icons/fa6";

export const columns = [
  {
    accessorKey: "sub_code",
    header: "Subject code",
  },
  {
    accessorKey: "sub_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Subject Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "degree_name",
    header: "Degree programme",
  },
  {
    accessorKey: "level",
    header: "Level",
  },
  {
    accessorKey: "sem_no",
    header: "Semester",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <p>{row.original.status === "true" ? "Active" : "Not active"}</p>;
    },
  },
  {
    id: "actions",
    header: "Actions",

    cell: ({ row }) => {
      return (
        <Button variant="outline" className="editBtn" id={row.original.sub_id}>
          <FaPen />
          &nbsp;Edit
        </Button>
      );
    },
  },
];
