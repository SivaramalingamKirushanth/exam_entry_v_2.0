"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

import { FaPen } from "react-icons/fa6";

export const columns = [
  {
    accessorKey: "deg_name",
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
    accessorKey: "short",
    header: "Short Name",
  },
  {
    accessorKey: "faculty_name",
    header: "Faculty",
  },
  {
    accessorKey: "department_name",
    header: "Department",
  },
  {
    accessorKey: "levels",
    header: "Levels",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.levels.split(":").map((level) => (
            <div key={level}>Level&nbsp;{level}</div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "no_of_sem_per_year",
    header: "Semesters per Level",
    cell: ({ row }) => {
      return <p className="text-right">{row.original.no_of_sem_per_year}</p>;
    },
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
        <Button variant="outline" className="editBtn" id={row.original.deg_id}>
          <FaPen />
          &nbsp;Edit
        </Button>
      );
    },
  },
];
