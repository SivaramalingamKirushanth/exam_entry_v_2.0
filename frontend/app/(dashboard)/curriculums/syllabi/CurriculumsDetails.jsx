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
import Modal from "./Model";
import {
  getAllSubjectsWithExtraDetails,
  getAllSyllabiWithExtraDetails,
  updateSubjectStatus,
} from "@/utils/apiRequests/curriculum.api";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { FaPen } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Syllabi = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [editId, setEditId] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: getAllSyllabiWithExtraDetails,
    queryKey: ["syllabiExtra"],
  });

  const { mutate } = useMutation({
    mutationFn: updateSubjectStatus,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["syllabiExtra"]);
      setEditId("");
      toast.success(res.message);
    },
    onError: (err) => {
      setEditId("");
      toast.error("Operation failed");
    },
  });

  const onStatusChanged = async (e) => {
    let id = e.split(":")[0];
    let status = e.split(":")[1];
    mutate({ id, status });
  };
  const columns = [
    {
      accessorKey: "degree_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Degree programme
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "commenced_year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Commenced Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <p className="text-center">{row.original.commenced_year}</p>;
      },
    },
    {
      accessorKey: "expired_year",
      header: "Expired Year",
      cell: ({ row }) => {
        return (
          <p className="text-center">{row.original.expired_year || "Live"}</p>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Switch
            id={row.original.syl_id}
            onCheckedChange={(e) =>
              onStatusChanged(row.original.syl_id + ":" + e)
            }
            checked={row.original.status == "true"}
          />
        );
      },
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            className="editBtn"
            id={row.original.syl_id}
          >
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

  const onStatusOptionClicked = (e) => {
    setStatus(e);
  };

  const toggleModal = () => {
    isOpen && setEditId("");
    setIsOpen((prev) => !prev);
  };

  const onEditClicked = (e) => {
    if (e.target.classList.contains("editBtn")) {
      setEditId(e.target.id);
      toggleModal();
    }
  };

  useEffect(() => {
    if (data) {
      let filtData1 = searchValue
        ? data.filter(
            (item) =>
              item.sub_name.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.sub_code.toLowerCase().includes(searchValue.toLowerCase())
          )
        : data;
      let filtData2 = filtData1.filter((item) => {
        return status == "all" ? true : item.status == status;
      });
      setFilteredData(filtData2);
    }
  }, [searchValue, status, data]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between mb-2 items-center sm:items-start">
        <div className="bg-white rounded-md flex relative">
          <Input
            placeholder="Search by degree or commenced year"
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
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Not active</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Modal
        editId={editId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalRef={modalRef}
        setEditId={setEditId}
      />
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          onEditClicked={onEditClicked}
          toggleModal={toggleModal}
          btnText="Create syllabus"
        />
      </div>
    </>
  );
};

export default Syllabi;
