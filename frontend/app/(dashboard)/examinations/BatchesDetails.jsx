"use client";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Model from "./Model";
import {
  getAllBatchDetails,
  sendPaymentMail,
  updateBatchStatus,
} from "@/utils/apiRequests/batch.api";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { FaPen, FaTrash, FaUserCheck } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import AttendanceModel from "./AttendanceModel";
import { deleteBatchSubjectEntries } from "@/utils/apiRequests/entry.api";
import { IoMdMail } from "react-icons/io";

const BatchesDetails = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const modelRef = useRef(null);
  const studentModelRef = useRef(null);
  const attendanceModelRef = useRef(null);
  const [editId, setEditId] = useState("");
  const [attendanceId, setAttendanceId] = useState("");
  const [dropId, setDropId] = useState(null);
  const [mailId, setMailId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryFn: getAllBatchDetails,
    queryKey: ["batches"],
  });

  const { mutate } = useMutation({
    mutationFn: updateBatchStatus,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["batches"]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const { mutate: mutateSendMails, isPending } = useMutation({
    mutationFn: sendPaymentMail,
    onSuccess: (res) => {
      setMailId(null);
      toast.success(res.message);
    },
    onError: (err) => {
      setMailId(null);
      toast.error("Operation failed");
    },
  });

  const { mutate: dropEntriesMutate } = useMutation({
    mutationFn: deleteBatchSubjectEntries,
    onSuccess: (res) => {
      mutate({ id: dropId, status: "false" });
      queryClient.invalidateQueries(["batches"]);
      toast.success(res.message);
      setDropId(null);
    },
    onError: (err) => {
      toast.error("Operation failed");
      setDropId(null);
    },
  });

  const onStatusChanged = async (e) => {
    let id = e.split(":")[0];
    let status = e.split(":")[1];
    mutate({ id, status });
  };
  const columns = [
    {
      id: "batch_code",
      header: "Batch code",
      header: ({ column }) => {
        return <h1 className="w-32">Batch code </h1>;
      },
      cell: ({ row }) => {
        let batch_code = row.original.batch_code;
        return <p className="text-xs font-bold">{batch_code}</p>;
      },
    },
    {
      id: "academic_year",

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
      cell: ({ row }) => {
        let academic_year = row.original.academic_year;
        return <p className="text-center">{academic_year}</p>;
      },
    },
    {
      accessorKey: "degree_name",
      header: "Degree programme",
    },
    {
      id: "level",

      header: "Level",
      cell: ({ row }) => {
        let level = row.original.level;
        return <p className="text-center">{level}</p>;
      },
    },
    {
      id: "sem",

      header: "Semester",
      cell: ({ row }) => {
        let sem = row.original.sem;
        return <p className="text-center">{sem}</p>;
      },
    },
    {
      id: "Entries",
      header: "Students Count",
      cell: ({ row }) => {
        return <p className="text-center">{row.original.student_count}</p>;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <Switch
            id={row.original.batch_id}
            onCheckedChange={(e) =>
              onStatusChanged(row.original.batch_id + ":" + e)
            }
            checked={row.original.batch_status == "true"}
          />
        );
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
            <div className="flex justify-center items-center">
              <Button
                variant="outline"
                className="editBtn"
                id={row.original.batch_id}
              >
                <FaPen />
                &nbsp;Edit
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                className="attendanceBtn flex justify-between"
                id={row.original.batch_id}
              >
                <FaUserCheck />
                &nbsp;Attendance & Assignments
              </Button>
            </div>
            <div className="flex justify-center items-center">
              <Button
                variant="outline"
                className="flex justify-between"
                disabled={
                  (mailId == row.original.batch_id && isPending) ||
                  new Date(row.original.dean_end_date) > new Date()
                }
                onClick={() => {
                  setMailId(row.original.batch_id);
                  mutateSendMails(row.original.batch_id);
                }}
              >
                <IoMdMail />
                &nbsp;
                {mailId == row.original.batch_id
                  ? "Sending Mails"
                  : "Send Payment Mail"}
              </Button>
            </div>
            <div className="flex justify-center items-center">
              <Drawer>
                <DrawerTrigger className="flex items-center justify-between gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-red-400 bg-red-500 active:bg-red-400/75 text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ">
                  <FaTrash />
                  &nbsp;Finish Exam
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                      <DrawerDescription>
                        All the entries of batch {row.original.batch_code} will
                        be deleted. This action cannot be undone.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="flex justify-center items-center flex-row">
                      <Button
                        id={row.original.batch_id}
                        className="dropBtn hover:bg-red-400 bg-red-500 active:bg-red-400/75"
                      >
                        Drop
                      </Button>
                      <DrawerClose className="inline">
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
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

  const toggleModel = () => {
    isOpen && setEditId("");
    setIsOpen((prev) => !prev);
  };

  const toggleAttendanceModel = () => {
    isAttendanceOpen && setAttendanceId("");
    setIsAttendanceOpen((prev) => !prev);
  };

  const onBtnClicked = (e) => {
    if (e.target.classList.contains("editBtn")) {
      setEditId(e.target.id);
      toggleModel();
    }

    if (e.target.classList.contains("attendanceBtn")) {
      setAttendanceId(e.target.id);
      toggleAttendanceModel();
    }

    if (e.target.classList.contains("dropBtn")) {
      setDropId(e.target.id);
    }
  };

  useEffect(() => {
    if (data) {
      let filtData1 = searchValue
        ? data.filter(
            (item) =>
              item.batch_code
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              item.degree_name
                .toLowerCase()
                .includes(searchValue.toLowerCase()),
          )
        : data;
      let filtData2 = filtData1.filter((item) => {
        return status == "all" ? true : item.status == status;
      });
      setFilteredData(filtData2);
    }
  }, [searchValue, status, data]);

  useEffect(() => {
    if (dropId) {
      dropEntriesMutate(dropId);
    }
  }, [dropId]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between mb-2 items-center sm:items-start">
        <div className="bg-white rounded-md flex relative">
          <Input
            placeholder="Search by name or batch code"
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

      <Model
        editId={editId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modelRef={modelRef}
        setEditId={setEditId}
      />

      <AttendanceModel
        isAttendanceOpen={isAttendanceOpen}
        setIsAttendanceOpen={setIsAttendanceOpen}
        attendanceModelRef={attendanceModelRef}
        attendanceId={attendanceId}
        setAttendanceId={setAttendanceId}
      />
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={filteredData}
          onBtnClicked={onBtnClicked}
          toggleModel={toggleModel}
        />
      </div>
    </>
  );
};

export default BatchesDetails;
