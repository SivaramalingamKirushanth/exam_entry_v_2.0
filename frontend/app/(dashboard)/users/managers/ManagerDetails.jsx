"use client";

import { columns } from "./Columns";
import { DataTable } from "./DataTable";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { MdCancel } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllManagers } from "@/utils/apiRequests/user.api";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Modal from "./Model";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";

const ManagerDetails = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);
  const [userId, setUserId] = useState("");

  const { data, isLoading, error } = useQuery({
    queryFn: getAllManagers,
    queryKey: ["managers"],
  });

  const onClearClicked = () => setSearchValue("");

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const onRoleOptionClicked = (e) => {
    setRole(e);
  };

  const onStatusOptionClicked = (e) => {
    setStatus(e);
  };

  const toggleModal = () => {
    isOpen && setUserId("");
    setIsOpen((prev) => !prev);
  };

  const onEditClicked = (e) => {
    if (e.target.classList.contains("editBtn")) {
      setUserId(e.target.id);
      toggleModal();
    }
  };

  useEffect(() => {
    if (data) {
      let filtData1 = searchValue
        ? data.filter(
            (item) =>
              item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
              item.user_name.toLowerCase().includes(searchValue.toLowerCase())
          )
        : data;
      let filtData2 = filtData1.filter((item) => {
        return role == "all"
          ? true
          : role == "lecturer"
          ? item.role_id == 4
          : role == "hod"
          ? item.role_id == 3
          : role == "dean"
          ? item.role_id == 2
          : false;
      });
      let filtData3 = filtData2.filter((item) => {
        return status == "all" ? true : item.status == status;
      });
      setFilteredData(filtData3);
    }
  }, [searchValue, role, status, data]);

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
        <div className="flex items-center gap-5">
          <div className="flex gap-1 items-center">
            <p className="text-sm font-semibold">Role &nbsp;</p>
            <Select
              onValueChange={(e) => onRoleOptionClicked(e)}
              defaultValue="all"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="hod">Hod</SelectItem>
                  <SelectItem value="dean">Dean</SelectItem>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
        userId={userId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalRef={modalRef}
        setUserId={setUserId}
      />
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          onEditClicked={onEditClicked}
          toggleModal={toggleModal}
        />
      </div>
    </>
  );
};

export default ManagerDetails;
