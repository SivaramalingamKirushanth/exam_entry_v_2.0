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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import Modal from "./Model";
import { getAllBatches } from "@/utils/apiRequests/batch.api";
import StudentModel from "./StudentModel";

const BatchesDetails = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const modalRef = useRef(null);
  const studentModalRef = useRef(null);
  const [editId, setEditId] = useState("");
  const [feedId, setFeedId] = useState("");
  const [feedDegShort, setFeedDegShort] = useState("");

  const { data, isLoading, error } = useQuery({
    queryFn: getAllBatches,
    queryKey: ["batches"],
  });

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

  const toggleFeedModal = () => {
    isFeedOpen && setFeedId("") && setFeedDegShort("");
    setIsFeedOpen((prev) => !prev);
  };

  const onBtnClicked = (e) => {
    if (e.target.classList.contains("editBtn")) {
      setEditId(e.target.id);
      toggleModal();
    }

    if (e.target.classList.contains("feedBtn")) {
      setFeedId(e.target.id.split(":")[0]);
      setFeedDegShort(e.target.id.split(":")[1]);
      toggleFeedModal();
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      let filtData1 = searchValue
        ? data.filter((item) =>
            item.batch_id.toLowerCase().includes(searchValue.toLowerCase())
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
      <StudentModel
        feedId={feedId}
        feedDegShort={feedDegShort}
        setIsFeedOpen={setIsFeedOpen}
        isFeedOpen={isFeedOpen}
        studentModalRef={studentModalRef}
        setFeedId={setFeedId}
        setFeedDegShort={setFeedDegShort}
      />
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          onBtnClicked={onBtnClicked}
          toggleModal={toggleModal}
        />
      </div>
    </>
  );
};

export default BatchesDetails;
