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
      name: "jallu",
      status: "not active",
      role: "hod",
      email: "m@example.com",
      contactNo: "123-456-7890",
      address: "123 Main St, City, Country",
      username: "jallu_hod",
    },
    {
      name: "alex",
      status: "active",
      role: "dean",
      email: "alex@example.com",
      contactNo: "234-567-8901",
      address: "456 Elm St, City, Country",
      username: "alex_dean",
    },
    {
      name: "sara",
      status: "not active",
      role: "lecturer",
      email: "sara@example.com",
      contactNo: "345-678-9012",
      address: "789 Maple Ave, City, Country",
      username: "sara_lecturer",
    },
    {
      name: "mike",
      status: "not active",
      role: "hod",
      email: "mike@example.com",
      contactNo: "456-789-0123",
      address: "101 Oak St, City, Country",
      username: "mike_hod",
    },
    {
      name: "jane",
      status: "active",
      role: "lecturer",
      email: "jane@example.com",
      contactNo: "567-890-1234",
      address: "202 Pine Rd, City, Country",
      username: "jane_lecturer",
    },
    {
      name: "bob",
      status: "not active",
      role: "dean",
      email: "bob@example.com",
      contactNo: "678-901-2345",
      address: "303 Cedar Blvd, City, Country",
      username: "bob_dean",
    },
    {
      name: "alice",
      status: "active",
      role: "hod",
      email: "alice@example.com",
      contactNo: "789-012-3456",
      address: "404 Birch Ln, City, Country",
      username: "alice_hod",
    },
    {
      name: "charlie",
      status: "not active",
      role: "lecturer",
      email: "charlie@example.com",
      contactNo: "890-123-4567",
      address: "505 Walnut St, City, Country",
      username: "charlie_lecturer",
    },
    {
      name: "daniel",
      status: "not active",
      role: "dean",
      email: "daniel@example.com",
      contactNo: "901-234-5678",
      address: "606 Ash Ave, City, Country",
      username: "daniel_dean",
    },
    {
      name: "emma",
      status: "active",
      role: "hod",
      email: "emma@example.com",
      contactNo: "012-345-6789",
      address: "707 Spruce St, City, Country",
      username: "emma_hod",
    },
    {
      name: "frank",
      status: "active",
      role: "lecturer",
      email: "frank@example.com",
      contactNo: "234-567-8902",
      address: "808 Maple Dr, City, Country",
      username: "frank_lecturer",
    },
    {
      name: "grace",
      status: "not active",
      role: "dean",
      email: "grace@example.com",
      contactNo: "345-678-9013",
      address: "909 Fir St, City, Country",
      username: "grace_dean",
    },
    {
      name: "hannah",
      status: "active",
      role: "hod",
      email: "hannah@example.com",
      contactNo: "456-789-0124",
      address: "1010 Palm Rd, City, Country",
      username: "hannah_hod",
    },
    {
      name: "isaac",
      status: "not active",
      role: "lecturer",
      email: "isaac@example.com",
      contactNo: "567-890-1235",
      address: "1111 Cedar St, City, Country",
      username: "isaac_lecturer",
    },
    {
      name: "julia",
      status: "active",
      role: "dean",
      email: "julia@example.com",
      contactNo: "678-901-2346",
      address: "1212 Oak Ave, City, Country",
      username: "julia_dean",
    },
    {
      name: "kevin",
      status: "not active",
      role: "hod",
      email: "kevin@example.com",
      contactNo: "789-012-3457",
      address: "1313 Birch Ln, City, Country",
      username: "kevin_hod",
    },
    {
      name: "lisa",
      status: "active",
      role: "lecturer",
      email: "lisa@example.com",
      contactNo: "890-123-4568",
      address: "1414 Ash Dr, City, Country",
      username: "lisa_lecturer",
    },
    {
      name: "mart",
      status: "not active",
      role: "dean",
      email: "matt@example.com",
      contactNo: "901-234-5679",
      address: "1515 Spruce Rd, City, Country",
      username: "matt_dean",
    },
  ];
}

const ManagerDetails = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState("all");
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

  const onRoleOptionClicked = (e) => {
    setRole(e);
  };

  const onStatusOptionClicked = (e) => {
    setStatus(e);
  };

  useEffect(() => {
    let filtData1 = searchValue
      ? data.filter(
          (item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.username.toLowerCase().includes(searchValue.toLowerCase())
        )
      : data;
    let filtData2 = filtData1.filter((item) => {
      return role == "all" ? true : item.role == role;
    });
    let filtData3 = filtData2.filter((item) => {
      return status == "all"
        ? true
        : item.status == status.split("-").join(" ");
    });
    setFilteredData(filtData3);
  }, [searchValue, role, status]);

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

export default ManagerDetails;
