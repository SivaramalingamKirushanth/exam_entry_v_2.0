"use client";

import { Payment, columns } from "./Columns";
import { DataTable } from "./DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

async function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "jallu",
      status: "pending",
      role: "manager",
      email: "m@example.com",
    },
    {
      id: "a9f81d8a",
      name: "alex",
      status: "active",
      role: "admin",
      email: "alex@example.com",
    },
    {
      id: "bc6f47a1",
      name: "sara",
      status: "inactive",
      role: "student",
      email: "sara@example.com",
    },
    {
      id: "3a81d92f",
      name: "mike",
      status: "pending",
      role: "manager",
      email: "mike@example.com",
    },
    {
      id: "41d8ec4b",
      name: "jane",
      status: "active",
      role: "student",
      email: "jane@example.com",
    },
    {
      id: "9d6b3c8e",
      name: "bob",
      status: "inactive",
      role: "admin",
      email: "bob@example.com",
    },
    {
      id: "5f7a2b1c",
      name: "alice",
      status: "active",
      role: "manager",
      email: "alice@example.com",
    },
    {
      id: "d3c4f9a2",
      name: "charlie",
      status: "pending",
      role: "student",
      email: "charlie@example.com",
    },
    {
      id: "8e4b3a9d",
      name: "daniel",
      status: "inactive",
      role: "admin",
      email: "daniel@example.com",
    },
    {
      id: "2c1a5f8b",
      name: "emma",
      status: "active",
      role: "manager",
      email: "emma@example.com",
    },
    {
      id: "f9d8c2b3",
      name: "hannah",
      status: "pending",
      role: "student",
      email: "hannah@example.com",
    },
    {
      id: "4b7d9f3c",
      name: "jacob",
      status: "active",
      role: "admin",
      email: "jacob@example.com",
    },
    {
      id: "c8a1b5d4",
      name: "oliver",
      status: "inactive",
      role: "student",
      email: "oliver@example.com",
    },
    {
      id: "2e6b8d3a",
      name: "lucas",
      status: "pending",
      role: "manager",
      email: "lucas@example.com",
    },
    {
      id: "a3d7f4c9",
      name: "ava",
      status: "active",
      role: "student",
      email: "ava@example.com",
    },
    {
      id: "d2b8a5f7",
      name: "sophia",
      status: "inactive",
      role: "admin",
      email: "sophia@example.com",
    },
    {
      id: "8d4a1f3b",
      name: "mason",
      status: "active",
      role: "manager",
      email: "mason@example.com",
    },
    {
      id: "1c7b4e2a",
      name: "mia",
      status: "pending",
      role: "student",
      email: "mia@example.com",
    },
    {
      id: "7d5f8b3c",
      name: "liam",
      status: "inactive",
      role: "admin",
      email: "liam@example.com",
    },
    {
      id: "5a8d7b4c",
      name: "noah",
      status: "active",
      role: "student",
      email: "noah@example.com",
    },
    {
      id: "4d7a9c2e",
      name: "amelia",
      status: "pending",
      role: "manager",
      email: "amelia@example.com",
    },
    {
      id: "c3f8a2b9",
      name: "ethan",
      status: "active",
      role: "admin",
      email: "ethan@example.com",
    },
    {
      id: "d9a3b8c2",
      name: "harper",
      status: "inactive",
      role: "student",
      email: "harper@example.com",
    },
    {
      id: "f7b4a9d5",
      name: "james",
      status: "active",
      role: "manager",
      email: "james@example.com",
    },
    {
      id: "b4d8e3f2",
      name: "isabella",
      status: "pending",
      role: "student",
      email: "isabella@example.com",
    },
    {
      id: "a9d3f5b6",
      name: "benjamin",
      status: "active",
      role: "admin",
      email: "benjamin@example.com",
    },
    {
      id: "e8c3a1d4",
      name: "ella",
      status: "inactive",
      role: "student",
      email: "ella@example.com",
    },
    {
      id: "9b7f6d5a",
      name: "henry",
      status: "active",
      role: "manager",
      email: "henry@example.com",
    },
    {
      id: "3c4d7b2a",
      name: "zoey",
      status: "pending",
      role: "student",
      email: "zoey@example.com",
    },
    {
      id: "2f9a1d7b",
      name: "jack",
      status: "active",
      role: "admin",
      email: "jack@example.com",
    },
    {
      id: "4a8c3f1e",
      name: "lucy",
      status: "inactive",
      role: "student",
      email: "lucy@example.com",
    },
    {
      id: "6b7d5f2a",
      name: "elijah",
      status: "active",
      role: "manager",
      email: "elijah@example.com",
    },
    {
      id: "b9a7d2c1",
      name: "scarlett",
      status: "pending",
      role: "student",
      email: "scarlett@example.com",
    },
    {
      id: "7e2d9c4a",
      name: "logan",
      status: "inactive",
      role: "admin",
      email: "logan@example.com",
    },
    {
      id: "1f5b8a3d",
      name: "madison",
      status: "active",
      role: "student",
      email: "madison@example.com",
    },
    {
      id: "2d9f8b7a",
      name: "sebastian",
      status: "pending",
      role: "manager",
      email: "sebastian@example.com",
    },
    {
      id: "c6a8e5d4",
      name: "aria",
      status: "active",
      role: "student",
      email: "aria@example.com",
    },
    {
      id: "e1d4f3b8",
      name: "matthew",
      status: "inactive",
      role: "admin",
      email: "matthew@example.com",
    },
    {
      id: "4b8a1f5c",
      name: "nora",
      status: "active",
      role: "manager",
      email: "nora@example.com",
    },
    {
      id: "a7d9e3f4",
      name: "lily",
      status: "pending",
      role: "student",
      email: "lily@example.com",
    },
    {
      id: "d3a5c8f9",
      name: "jayden",
      status: "active",
      role: "admin",
      email: "jayden@example.com",
    },
    {
      id: "9f2d7b1e",
      name: "hazel",
      status: "inactive",
      role: "student",
      email: "hazel@example.com",
    },
    {
      id: "2a8d6f5b",
      name: "leo",
      status: "active",
      role: "manager",
      email: "leo@example.com",
    },
    {
      id: "6d3b9a1f",
      name: "chloe",
      status: "pending",
      role: "student",
      email: "chloe@example.com",
    },
    {
      id: "f4c8b2a7",
      name: "aiden",
      status: "active",
      role: "admin",
      email: "aiden@example.com",
    },
    {
      id: "8e9d5a7c",
      name: "grace",
      status: "inactive",
      role: "student",
      email: "grace@example.com",
    },
    {
      id: "7c3f4b2a",
      name: "lucy",
      status: "active",
      role: "manager",
      email: "lucy2@example.com",
    },
    {
      id: "5d2b8f9c",
      name: "riley",
      status: "pending",
      role: "student",
      email: "riley@example.com",
    },
    {
      id: "1e9c4f8b",
      name: "luna",
      status: "active",
      role: "admin",
      email: "luna@example.com",
    },
  ];
}

const UserDetails = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [role, setRole] = useState("all");
  const [focusState, setFocusState] = useState(false);
  useEffect(() => {
    const load = async () => {
      const data = await getData();
      setData(data);
      setFilteredData(data);
    };

    load();
  }, []);

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const onDropDownClicked = () => {
    setFocusState(!focusState);
  };

  const onOptionClicked = (e) => {
    setRole(e.target.id);
  };

  useEffect(() => {
    let filtData1 = searchValue
      ? data.filter((item) => item.name.includes(searchValue))
      : data;
    let filtData2 = filtData1.filter((item) => {
      return role == "all" ? true : item.role == role;
    });
    console.log(filtData2);
    setFilteredData(filtData2);
  }, [searchValue, role]);

  return (
    <>
      <div className="flex justify-between mb-4 items-start">
        <div className="bg-white rounded-md">
          <Input
            placeholder="Search by name"
            onChange={(e) => onSearchChange(e)}
            value={searchValue}
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-white rounded-md relative flex">
            <p className="text-sm font-semibold shrink-0 text-nowrap absolute top-1 right-40">
              Role :&nbsp;
            </p>
            <button
              className={`absolute top-0 right-0 flex flex-col overflow-hidden items-start w-40 rounded-md  transition-all duration-150 ${
                focusState ? "h-8 focus:h-[9.5rem] focus:shadow-md" : "h-8"
              } bg-white/95 z-20 `}
              onClick={onDropDownClicked}
            >
              <div className="py-1 px-3 w-full text-left rounded-md rounded-b-none mb-1 capitalize flex justify-between items-center">
                {role == "all" ? role : role + "s"}
                <ChevronDown className="text-zinc-600" size={20} />
              </div>
              <div
                id="admin"
                className="py-1 px-3 w-full text-left hover:bg-slate-100 active:bg-slate-200 text-sm pl-6"
                onClick={(e) => onOptionClicked(e)}
              >
                Admins
              </div>
              <div
                id="manager"
                className="py-1 px-3 w-full text-left hover:bg-slate-100 active:bg-slate-200 text-sm pl-6"
                onClick={(e) => onOptionClicked(e)}
              >
                Managers
              </div>
              <div
                id="student"
                className="py-1 px-3 w-full text-left hover:bg-slate-100 active:bg-slate-200 text-sm pl-6"
                onClick={(e) => onOptionClicked(e)}
              >
                Students
              </div>
              <div
                id="all"
                className="py-1 px-3 w-full text-left hover:bg-slate-100 active:bg-slate-200 text-sm pl-6"
                onClick={(e) => onOptionClicked(e)}
              >
                All
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <DataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
};

export default UserDetails;
