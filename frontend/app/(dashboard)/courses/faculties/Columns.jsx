"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { FaPen } from "react-icons/fa6";

export const columns = [
  {
    accessorKey: "f_name",
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
    accessorKey: "department_count",
    header: "No of departments",
  },
  {
    accessorKey: "degree_count",
    header: "No of Degree programmes",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact_no",
    header: "Contact No",
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
        <Button variant="outline" className="editBtn" id={row.original.f_id}>
          <FaPen />
          &nbsp;Edit
        </Button>
      );
    },
  },
];
