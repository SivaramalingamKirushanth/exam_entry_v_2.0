"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { FaPen, FaUserPlus } from "react-icons/fa6";

export const columns = [
  {
    accessorKey: "batch_id",
    header: "Batch ID",
  },
  {
    accessorKey: "academic_year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Academic year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "degree_name_short",
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
    header: () => {
      return <p className="text-center">Actions</p>;
    },

    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="editBtn"
            id={row.original.batch_id}
          >
            <FaPen />
            &nbsp;Edit
          </Button>
          <Button
            className="feedBtn"
            id={row.original.batch_id + ":" + row.original.degree_name_short}
          >
            <FaUserPlus />
            &nbsp;Feed students
          </Button>
        </div>
      );
    },
  },
];
