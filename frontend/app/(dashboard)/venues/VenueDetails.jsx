"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Model from "./Model";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { FaPen } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getVenues } from "@/utils/apiRequests/user.api";

const VenueDetails = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const modelRef = useRef(null);
  const [editId, setEditId] = useState("");
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryFn: getVenues,
    queryKey: ["venues"],
  });

  const columns = [
    {
      accessorKey: "short_code",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Short Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "description",

      header: "Description",
    },
    {
      accessorKey: "seat_count",
      header: "Seat Count",
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        return (
          <Button variant="outline" className="editBtn" id={row.original.id}>
            <FaPen />
            &nbsp;Edit
          </Button>
        );
      },
    },
  ];

  const onClearClicked = () => setSearchValue("");

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const toggleModel = () => {
    isOpen && setEditId("");
    setIsOpen((prev) => !prev);
  };

  const onEditClicked = (e) => {
    if (e.target.classList.contains("editBtn")) {
      setEditId(e.target.id);
      toggleModel();
    }
  };

  useEffect(() => {
    if (data) {
      let filtData = searchValue
        ? data.filter((item) =>
            item.short_code.toLowerCase().includes(searchValue.toLowerCase())
          )
        : data;

      setFilteredData(filtData);
    }
  }, [searchValue, data]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between mb-2 items-center sm:items-start">
        <div className="bg-white rounded-md flex relative">
          <Input
            placeholder="Search by name"
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
      </div>
      <Model
        editId={editId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modelRef={modelRef}
        setEditId={setEditId}
      />
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          onEditClicked={onEditClicked}
          toggleModel={toggleModel}
          btnText="Create Venue"
        />
      </div>
    </>
  );
};

export default VenueDetails;
