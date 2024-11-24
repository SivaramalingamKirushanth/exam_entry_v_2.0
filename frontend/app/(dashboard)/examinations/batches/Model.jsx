"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GiCancel } from "react-icons/gi";

import {
  getAllFaculties,
  getDegreeById,
  getDegreesByDepartmentId,
  getDepartmentsByFacultyId,
} from "@/utils/apiRequests/course.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCurriculum,
  getCurriculumByDegLevSem,
  getCurriculumById,
  updateCurriculum,
} from "@/utils/apiRequests/curriculum.api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import StudentSelection from "./StudentSelection";
import { getAllActiveManagers } from "@/utils/apiRequests/user.api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const Model = ({ editId, isOpen, setIsOpen, modalRef, setEditId }) => {
  const [formData, setFormData] = useState({ status: "true" });
  const [sidePartEnable, setSidePartEnable] = useState(false);
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();
  const [comboBoxOpen, setComboBoxOpen] = useState({});

  const { status, mutate } = useMutation({
    mutationFn: editId ? updateCurriculum : createCurriculum,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["curriculumsExtra"]);
      setEditId("");
      toast(res.message);
    },
    onError: (err) => {
      console.log(err);
      toast("Operation failed");
    },
  });

  const { data, refetch } = useQuery({
    queryFn: () => getCurriculumById(editId),
    queryKey: ["curriculums", editId],
    enabled: false,
  });

  const {
    data: curriculumByDegLevSemData,
    refetch: curriculumByDegLevSemRefetch,
  } = useQuery({
    queryFn: () =>
      getCurriculumByDegLevSem(
        formData.deg_id,
        formData.level,
        formData.sem_no
      ),
    queryKey: [
      "curriculums",
      "DegLevSem",
      formData.deg_id,
      formData.level,
      formData.sem_no,
    ],
    enabled: false,
  });

  const { data: facultyData } = useQuery({
    queryFn: getAllFaculties,
    queryKey: ["activeFaculties"],
  });

  const { data: departmentData, refetch: departmentDataRefetch } = useQuery({
    queryFn: () => getDepartmentsByFacultyId(formData.f_id),
    queryKey: ["activeDepartments", "faculty", formData.f_id],
    enabled: false,
  });

  const { data: degreeData, refetch: degreeDataRefetch } = useQuery({
    queryFn: () => getDegreesByDepartmentId(formData.d_id),
    queryKey: ["activeDegrees", "department", formData.d_id],
    enabled: false,
  });

  const { data: specificDegreeData, refetch: specificDegreeDataRefetch } =
    useQuery({
      queryFn: () => getDegreeById(formData.deg_id),
      queryKey: ["degrees", formData.deg_id],
      enabled: false,
    });
  const {
    data: managers,
    isLoading,
    error,
  } = useQuery({
    queryFn: getAllActiveManagers,
    queryKey: ["activeManagers"],
  });
  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const onFormDataChanged = (e) => {
    if (e?.target) {
      setFormData((curData) => ({
        ...curData,
        [e.target?.name]: e.target?.value,
      }));
    } else if (typeof e == "boolean") {
      setFormData((curData) => ({ ...curData, status: e.toString() }));
    } else {
      setFormData((curData) => ({
        ...curData,
        [e.split(":")[0]]: e.split(":")[1],
      }));
    }
  };

  const onAcadYearChanged = (e) => {
    let value = +e.target.value;
    if (value < +e.target.min) {
      value = +e.target.min;
    } else if (value > +e.target.max) {
      value = +e.target.max;
    }

    setFormData((curData) => ({ ...curData, academic_year: value }));
    e.target.value = value;
  };

  const onFormSubmitted = () => {
    mutate(formData);
    setFormData({ status: "true" });
    setIsOpen(false);
  };

  const onFormReset = () => {
    setFormData({ status: "true" });
  };

  useEffect(() => {
    const isFormValid =
      formData.academic_year &&
      formData.d_id &&
      formData.f_id &&
      formData.deg_id &&
      formData.sem_no &&
      formData.level &&
      curriculumByDegLevSemRefetch();

    setSidePartEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    console.log(formData);
    const isFormValid =
      formData.academic_year &&
      formData.d_id &&
      formData.f_id &&
      formData.deg_id &&
      formData.sem_no &&
      formData.level;
    setBtnEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    editId && refetch();
  }, [editId]);

  useEffect(() => {
    if (formData?.f_id) departmentDataRefetch();
  }, [formData?.f_id]);

  useEffect(() => {
    if (formData?.d_id) degreeDataRefetch();
  }, [formData?.d_id]);

  useEffect(() => {
    if (formData?.deg_id) {
      specificDegreeDataRefetch();
    }
  }, [formData?.deg_id]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className={`${
              btnEnable ? "sm:max-w-[90vw]" : "sm:max-w-[425px]"
            } transition-all duration-300 bg-white rounded-lg shadow-lg p-6 h-[95vh]`}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Batch</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  onFormReset();
                  setEditId("");
                }}
              />
            </div>
            <div className="w-full flex flex-col justify-between  h-[80vh]">
              <div className="flex ">
                <div
                  className={`flex flex-col justify-start gap-4 ${
                    sidePartEnable ? "sm:max-w-[425px]" : ""
                  } `}
                >
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="batch_id" className="text-right">
                      Batch ID
                    </Label>
                    <Input
                      id="batch_id"
                      name="batch_id"
                      className="col-span-3"
                      disabled={true}
                      value={`${formData.academic_year || "XXXX"}${
                        specificDegreeData?.short || "XX"
                      }${formData.level || "X"}${formData.sem_no || "X"}`}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="academic_year" className="text-right">
                      Academic year
                    </Label>
                    <input
                      type="number"
                      min="2023"
                      max="2100"
                      placeholder="Enter year"
                      className="flex h-9 col-span-3 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      name="academic_year"
                      id="academic_year"
                      onBlur={(e) => onAcadYearChanged(e)}
                      onChange={(e) => onFormDataChanged(e)}
                      value={formData.academic_year || ""}
                    />
                  </div>

                  <div className={`grid grid-cols-4 items-center gap-4`}>
                    <Label className="text-right">Faculty</Label>
                    <Select
                      onValueChange={(e) => {
                        setFormData((cur) => ({ ...cur, d_id: "" }));
                        onFormDataChanged(e);
                      }}
                      value={formData.f_id ? "f_id:" + formData.f_id : ""}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {facultyData?.map((item) => (
                          <SelectItem value={`f_id:${item.f_id}`}>
                            {item.f_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                    <Label className="text-right">Department</Label>
                    <Select
                      onValueChange={(e) => {
                        setFormData((cur) => ({ ...cur, deg_id: "" }));
                        onFormDataChanged(e);
                      }}
                      value={formData.d_id ? "d_id:" + formData.d_id : ""}
                      disabled={!formData.f_id}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentData?.map((item) => (
                          <SelectItem value={`d_id:${item.d_id}`}>
                            {item.d_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                    <Label className="text-right">Degree programme</Label>
                    <Select
                      onValueChange={(e) => {
                        onFormDataChanged(e);
                      }}
                      value={formData.deg_id ? "deg_id:" + formData.deg_id : ""}
                      disabled={!formData.d_id}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Degree programme" />
                      </SelectTrigger>
                      <SelectContent>
                        {degreeData?.map((item) => (
                          <SelectItem value={`deg_id:${item.deg_id}`}>
                            {item.deg_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className={`${
                      specificDegreeData ? "grid" : "hidden"
                    }  grid-cols-4 gap-4`}
                  >
                    <Label className="text-right">Level</Label>
                    <div className="flex col-span-3 gap-4 flex-wrap">
                      {specificDegreeData?.levels.map((item) => (
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value={item}
                            id={`l${item}`}
                            checked={formData.level == item}
                            name="level"
                            onClick={(e) => onFormDataChanged(e)}
                            className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                          />
                          <Label
                            htmlFor={`l${item}`}
                            className="cursor-pointer"
                          >
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`${
                      specificDegreeData ? "grid" : "hidden"
                    }  grid-cols-4 gap-4`}
                  >
                    <Label className="text-right">Semester</Label>
                    <div className="flex col-span-3 gap-4 flex-wrap">
                      {[1, 2].map((item) => (
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value={item}
                            id={`s${item}`}
                            checked={formData.sem_no == item}
                            name="sem_no"
                            onClick={(e) => onFormDataChanged(e)}
                            className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                          />
                          <Label
                            htmlFor={`s${item}`}
                            className="cursor-pointer"
                          >
                            {item}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right">Status</Label>
                    <div className="items-top flex space-x-2 col-span-3 items-center">
                      <Checkbox
                        id="status"
                        onCheckedChange={(e) => onFormDataChanged(e)}
                        checked={formData?.status === "true"}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="status"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {sidePartEnable && (
                  <div className="container mx-auto h-[70vh] overflow-auto p-1 flex flex-col justify-start gap-4">
                    {curriculumByDegLevSemData?.map((obj) => {
                      return (
                        <div className={`grid grid-cols-4 items-center gap-4`}>
                          <Label className="text-right">{obj.sub_code}</Label>
                          <div className="grid col-span-3">
                            <Popover
                              open={comboBoxOpen[obj.sub_code]}
                              onOpenChange={(bool) =>
                                setComboBoxOpen((cur) => ({
                                  ...cur,
                                  [obj.sub_code]: bool,
                                }))
                              }
                            >
                              <PopoverTrigger asChild>
                                <button
                                  role="combobox"
                                  aria-expanded={comboBoxOpen}
                                  className="col-span-3 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 cursor-pointer"
                                >
                                  {formData?.subjects?.[obj.sub_code]
                                    ? managers.find(
                                        (manager) =>
                                          manager.m_id ==
                                          formData.subjects[obj.sub_code]
                                      )?.name
                                    : "Select manager"}
                                  <ChevronsUpDown className="opacity-50 size-[17px] " />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="py-0 px-1 border-none shadow-none">
                                <Command className="border shadow-md">
                                  <CommandInput placeholder="Search manager" />
                                  <CommandList>
                                    <CommandEmpty>
                                      No manager found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {managers.map((manager) => (
                                        <CommandItem
                                          key={manager.m_id}
                                          value={
                                            manager.name +
                                            ":" +
                                            manager.m_id.toString()
                                          }
                                          onSelect={(currentValue) => {
                                            setFormData((cur) => ({
                                              ...cur,
                                              subjects: {
                                                ...cur.subjects,
                                                [obj.sub_code]:
                                                  currentValue.split(":")[1] ===
                                                  cur?.subjects?.[obj.sub_code]
                                                    ? ""
                                                    : currentValue.split(
                                                        ":"
                                                      )[1],
                                              },
                                            }));
                                            setComboBoxOpen(false);
                                          }}
                                        >
                                          {manager.name}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              formData?.subjects?.[
                                                obj.sub_code
                                              ] == manager.m_id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex justify-between space-x-2 mt-4">
                <Button
                  type="button"
                  variant="warning"
                  onClick={() => {
                    onFormReset();
                    editId &&
                      setFormData((cur) => ({
                        ...cur,
                        sub_id: data.sub_id,
                      }));
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  disabled={!sidePartEnable}
                  onClick={onFormSubmitted}
                >
                  {editId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
