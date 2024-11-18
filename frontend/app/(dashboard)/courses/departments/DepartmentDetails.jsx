"use client";

import { columns } from "./Columns";
import { DataTable } from "./DataTable";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
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

async function getData() {
  // Fetch data from your API here.
  return [
    {
      name: "Physical Science",
      hod: "alex",
      faculty: "Applied Science",
      degreesProgrames: 4,
      email: "alex@example.com",
      contactNo: "234-567-8901",
      status: "active",
    },
    {
      name: "Project Management",
      hod: "martin",
      faculty: "Bussiness Studies",
      degreesProgrames: 2,
      email: "martin@example.com",
      contactNo: "345-567-8901",
      status: "active",
    },
    {
      name: "Technology",
      hod: "ram",
      faculty: "Technology",
      degreesProgrames: 1,
      email: "ram@example.com",
      contactNo: "234-789-1234",
      status: "active",
    },
  ];
}

const DepartmentDetails = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const load = async () => {
      const data = await getData();
      setData(data);
      setFilteredData(data);
    };

    load();
  }, []);

  const onClearClicked = () => setSearchValue("");

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const onStatusOptionClicked = (e) => {
    setStatus(e);
  };

  useEffect(() => {
    let filtData1 = searchValue
      ? data.filter((item) =>
          item.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      : data;
    let filtData2 = filtData1.filter((item) => {
      return status == "all"
        ? true
        : item.status == status.split("-").join(" ");
    });
    setFilteredData(filtData2);
  }, [searchValue, status]);

  return (
    <>
      <div className="flex justify-between mb-2 items-start">
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="not-active">Not active</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
};

export default DepartmentDetails;
