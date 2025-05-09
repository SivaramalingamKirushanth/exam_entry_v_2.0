"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GiCancel } from "react-icons/gi";
import ReactSelect from "react-select";

import {
  getAllDepartments,
  getAllFaculties,
  getDegreeById,
  getDegreesByDepartmentId,
  getDegreesByFacultyId,
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
  createGroup,
  createSubject,
  getAllSubjectsForGroupCreation,
  getGroupById,
  getSubjectById,
  getSyllabiByDegreeId,
  updateGroup,
  updateSubject,
} from "@/utils/apiRequests/curriculum.api";
import { LabelSearchCombobox } from "@/components/ui/customCommand";
import { FaTimes } from "react-icons/fa";

const Model = ({ editId, isOpen, setIsOpen, modalRef, setEditId }) => {
  const [formData, setFormData] = useState({ subjects: [] });
  const [subjectsArr, setSubjectArr] = useState([]);
  const [btnEnable, setBtnEnable] = useState(false);
  const [subjectsUpdated, setSubjectsUpdated] = useState(true);
  const queryClient = useQueryClient();

  const handleChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      subjects: selectedOptions,
    }));
  };

  const handleRemove = (value) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((item) => item.value !== value),
    }));
  };

  const { status, mutate } = useMutation({
    mutationFn: editId ? updateGroup : createGroup,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["groupsExtra"]);
      setEditId("");
      toast.success(res.message);
    },
    onError: (err) => {
      setEditId("");
      toast.error("Operation failed");
    },
  });

  const { data, refetch } = useQuery({
    queryFn: () => getGroupById(editId),
    queryKey: ["groups", editId],
    enabled: false,
  });

  const {
    data: facultyData,
    isLoading: isFacultyDataLoading,
    isError: isFacultyDataError,
  } = useQuery({
    queryFn: getAllFaculties,
    queryKey: ["activeFaculties"],
  });

  const {
    data: degreeData,
    refetch: degreeDataRefetch,
    isLoading: isDegreeDataLoading,
    isError: isDegreeDataError,
  } = useQuery({
    queryFn: () => getDegreesByFacultyId(formData.f_id),
    queryKey: ["activeDegrees", "faculty", formData.f_id],
    enabled: false,
  });

  const {
    data: syllabusData,
    refetch: syllabusDataRefetch,
    isLoading: isSyllabusDataLoading,
    error: isSyllabusDataError,
  } = useQuery({
    queryFn: () => getSyllabiByDegreeId(formData.deg_id),
    queryKey: ["activeSyllabi", "degree", formData.deg_id],
    enabled: false,
  });

  const { data: degreeLevelsData, refetch: degreeLevelsDataRefetch } = useQuery(
    {
      queryFn: () => getDegreeById(formData.deg_id),
      queryKey: ["degrees", formData.deg_id],
      enabled: false,
    }
  );

  const {
    data: subjectsData,
    isLoading: isSubjectsDataLoading,
    isError: isSubjectsDataError,
    refetch: subjectsDataRefetch,
  } = useQuery({
    queryFn: () =>
      getAllSubjectsForGroupCreation(
        formData.f_id,
        formData.syl_id,
        formData.level,
        formData.sem_no
      ),
    queryKey: [
      "subjects",
      formData.f_id,
      formData.syl_id,
      formData.level,
      formData.sem_no,
    ],
    enabled: false,
  });

  useEffect(() => {
    if (data) {
      const { subIds, ...res } = data;

      setFormData(res);
      setSubjectsUpdated(false);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      if (data.subIds && subjectsData && !subjectsUpdated) {
        const subjects = data.subIds.split(",").map((subId) => {
          const subObj = subjectsData.find((obj) => obj.sub_id == subId);

          return {
            value: subObj?.sub_id,
            label: `${subObj?.sub_code} - ${subObj?.sub_name}`,
          };
        });

        setFormData((cur) => ({ ...cur, subjects }));
        setSubjectsUpdated(true);
      } else if (!data.subIds || !subjectsData) {
        const subjects = [];
        setFormData((cur) => ({ ...cur, subjects }));
      }
    }
  }, [subjectsData, subjectsUpdated]);

  const onFormDataChanged = (e) => {
    if (e?.target) {
      setFormData((curData) => ({
        ...curData,
        [e.target?.name]: e.target?.value,
      }));
    }
  };

  const onFormSubmitted = () => {
    const mod = formData.subjects?.map((obj) => obj.value);
    const grp_code = `Group-${
      degreeData?.find((deg) => deg.deg_id == formData.deg_id)?.short || "XX"
    }${formData.level || "X"}${formData.sem_no || "X"}-${
      syllabusData?.find((syl) => syl.syl_id == formData.syl_id)
        ?.commenced_year || "XXXX"
    }`;

    mutate({
      syl_id: formData.syl_id,
      level: formData.level,
      sem_no: formData.sem_no,
      subjects: mod || [],
      grp_code,
      grp_id: formData.grp_id || null,
    });
    setFormData({ subjects: [] });
    setIsOpen(false);
    setSubjectsUpdated(true);
  };

  const onFormReset = () => {
    if (data) {
      const { subIds, ...res } = data;

      setFormData(res);
      setSubjectsUpdated(false);
    } else {
      setFormData({ subjects: [] });
    }
  };

  useEffect(() => {
    const isFormValid =
      formData.f_id &&
      formData.deg_id &&
      formData.syl_id &&
      formData.sem_no &&
      formData.level;
    setBtnEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    editId && refetch();
  }, [editId]);

  useEffect(() => {
    if (formData?.f_id) degreeDataRefetch();
  }, [formData?.f_id]);

  useEffect(() => {
    if (formData?.deg_id) syllabusDataRefetch();
  }, [formData?.deg_id]);

  useEffect(() => {
    if (formData?.deg_id) degreeLevelsDataRefetch();
  }, [formData?.deg_id]);

  useEffect(() => {
    if (
      formData?.f_id &&
      formData?.syl_id &&
      formData?.level &&
      formData?.sem_no
    )
      subjectsDataRefetch();
  }, [formData?.f_id, formData?.syl_id, formData?.level, formData?.sem_no]);

  useEffect(() => {
    if (subjectsData?.length) {
      const modifiedArr = subjectsData.map((obj) => ({
        value: obj.sub_id,
        label: `${obj.sub_code} - ${obj.sub_name}`,
      }));
      setSubjectArr(modifiedArr);
    }
  }, [subjectsData]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className={`${
              btnEnable
                ? "sm:max-w-[90vw] w-[850px]"
                : "sm:max-w-[425px] w-[425px]"
            } transition-all duration-300 bg-white rounded-lg shadow-lg p-6 h-[95vh]`}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Group</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({ subjects: [] });
                  setEditId("");
                  setSubjectsUpdated(true);
                }}
              />
            </div>
            <div className="h-[80vh] w-full flex flex-col justify-between">
              <div className="w-full flex gap-1 justify-between">
                <div
                  className={`grid gap-4 py-4 shrink-0 self-start ${
                    btnEnable ? "sm:max-w-[360px] w-[360px]" : "w-full"
                  } p-2`}
                >
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grp_code" className="text-right">
                      Group Code
                    </Label>
                    <Input
                      id="grp_code"
                      name="grp_code"
                      className="col-span-3"
                      onChange={(e) => onFormDataChanged(e)}
                      onBlur={(e) => {
                        e.target.value = e.target.value.trim();
                        onFormDataChanged(e);
                      }}
                      disabled={true}
                      value={`Group-${
                        degreeData?.find((deg) => deg.deg_id == formData.deg_id)
                          ?.short || "XX"
                      }${formData.level || "X"}${formData.sem_no || "X"}-${
                        syllabusData?.find(
                          (syl) => syl.syl_id == formData.syl_id
                        )?.commenced_year || "XXXX"
                      }`}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                    <Label className="text-right">Faculty</Label>
                    <div className="col-span-3">
                      <LabelSearchCombobox
                        name="f_id"
                        items={facultyData}
                        labelField="f_name"
                        valueField="f_id"
                        placeholder="Search faculty..."
                        buttonText="Select faculty"
                        onValueChange={(e) => {
                          setFormData((cur) => ({ ...cur, deg_id: "" }));
                          onFormDataChanged(e);
                        }}
                        value={formData.f_id || null}
                        disabled={isFacultyDataLoading || isFacultyDataError}
                      />
                    </div>
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                    <Label className="text-right">Degree programme</Label>
                    <div className="col-span-3">
                      <LabelSearchCombobox
                        name="deg_id"
                        items={degreeData}
                        labelField="deg_name"
                        valueField="deg_id"
                        placeholder="Search degree..."
                        buttonText={
                          isDegreeDataError
                            ? "Not found"
                            : isDegreeDataLoading
                            ? "Loading..."
                            : "Select degree"
                        }
                        onValueChange={(e) => {
                          setFormData((cur) => ({
                            ...cur,
                            syl_id: "",
                            level: "",
                            sem_no: "",
                          }));
                          onFormDataChanged(e);
                        }}
                        value={formData.deg_id || null}
                        disabled={
                          !degreeData ||
                          isDegreeDataLoading ||
                          isDegreeDataError
                        }
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      degreeLevelsData ? "grid" : "hidden"
                    }  grid-cols-4 gap-4`}
                  >
                    <Label className="text-right">Level</Label>
                    <div className="flex col-span-3 gap-4 flex-wrap">
                      {degreeLevelsData?.levels.map((item) => (
                        <div className="flex items-center space-x-2" key={item}>
                          <input
                            type="radio"
                            value={item}
                            id={`l${item}`}
                            checked={formData.level == item}
                            name="level"
                            onChange={(e) => {
                              setFormData((pre) => ({ ...pre, subjects: [] }));
                              onFormDataChanged(e);
                            }}
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
                      degreeLevelsData ? "grid" : "hidden"
                    }  grid-cols-4 gap-4`}
                  >
                    <Label className="text-right">Semester</Label>
                    <div className="flex col-span-3 gap-4 flex-wrap">
                      {Array(+degreeLevelsData?.no_of_sem_per_year || 0)
                        .fill(1)
                        .map((_, ind) => (
                          <div
                            className="flex items-center space-x-2"
                            key={ind + 1}
                          >
                            <input
                              type="radio"
                              value={ind + 1}
                              id={`s${ind + 1}`}
                              checked={formData.sem_no == ind + 1}
                              name="sem_no"
                              onChange={(e) => {
                                setFormData((pre) => ({
                                  ...pre,
                                  subjects: [],
                                }));
                                onFormDataChanged(e);
                              }}
                              className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                            />
                            <Label
                              htmlFor={`s${ind + 1}`}
                              className="cursor-pointer"
                            >
                              {ind + 1}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>{" "}
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                    <Label className="text-right">Syllabus</Label>
                    <div className="col-span-3">
                      <LabelSearchCombobox
                        name="syl_id"
                        items={syllabusData?.map((obj) => ({
                          ...obj,
                          commenced_year: obj.commenced_year + "",
                        }))}
                        labelField="commenced_year"
                        valueField="syl_id"
                        placeholder="Search syllabus..."
                        buttonText={
                          isSyllabusDataError
                            ? "Not found"
                            : isSyllabusDataLoading
                            ? "Loading..."
                            : "Select syllabus"
                        }
                        onValueChange={(e) => {
                          onFormDataChanged(e);
                        }}
                        value={formData.syl_id || null}
                        disabled={
                          !syllabusData ||
                          isSyllabusDataLoading ||
                          isSyllabusDataError
                        }
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`self-start ${
                    btnEnable
                      ? "grid gap-4 py-4 sm:max-w-[360px] w-[360px] shrink-0 p-2"
                      : "hidden"
                  }`}
                >
                  <div className="w-full max-w-md space-y-4">
                    <h1 className="font-semibold">Subjects</h1>
                    <ReactSelect
                      value={formData.subjects}
                      onChange={handleChange}
                      options={subjectsArr}
                      isMulti
                      isClearable={false}
                      isDisabled={isSubjectsDataLoading || isSubjectsDataError}
                      name="subjects"
                      placeholder={
                        isSubjectsDataError
                          ? "Not found"
                          : isSubjectsDataLoading
                          ? "Loading..."
                          : "Select subjects"
                      }
                      classNamePrefix="react-select"
                      styles={{
                        multiValue: () => ({ display: "none" }), // hide default chips
                        control: (base) => ({
                          ...base,
                          borderColor: "#ccc",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#000",
                          },
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 5,
                        colors: {
                          ...theme.colors,
                          primary25: "#f2f2f2",
                          primary: "black",
                        },
                      })}
                    />

                    {/* Custom display of selected items */}
                    <div className="flex flex-col gap-2 h-[45vh] overflow-y-scroll border-2 p-2 border-slate-300 rounded-sm">
                      {formData.subjects?.length && subjectsData ? (
                        formData.subjects?.map((subject) => {
                          return (
                            <div
                              key={subject.value}
                              className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md text-sm"
                            >
                              {subject.label}
                              <button
                                onClick={() => handleRemove(subject.value)}
                                className="ml-2 text-gray-500 hover:text-red-500"
                                type="button"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-full flex justify-center items-center">
                          <h1 className="text-slate-400">
                            Group is empty. please select subjects..
                          </h1>
                        </div>
                      )}
                    </div>
                    <h1 className="text-end text-sm">
                      {formData.subjects?.length} subjects
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex justify-between space-x-2 mt-4">
                <Button
                  type="button"
                  variant="warning"
                  onClick={() => onFormReset()}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  disabled={!btnEnable}
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
