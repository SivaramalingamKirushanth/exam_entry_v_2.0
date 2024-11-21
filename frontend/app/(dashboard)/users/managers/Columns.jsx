"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DialogBox from "./DialogBox";
import { FaPen } from "react-icons/fa6";

export const columns = [
  {
    accessorKey: "user_name",
    header: "User name",
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contact_no",
    header: "Contact No",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "role_id",
    header: "Role",
    cell: ({ row }) => {
      return (
        <p>
          {row.role_id == 2 ? "Dean" : row.role_id == 3 ? "Hod" : "Lecturer"}
        </p>
      );
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
    cell: ({ row }) => {
      console.log(row);
      <Button userId={row.original.user_id}>
        <FaPen />
        &nbsp;Edit
      </Button>;

      return <DialogBox />;
    },
  },
];
