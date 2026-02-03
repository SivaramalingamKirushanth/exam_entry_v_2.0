"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GiCancel } from "react-icons/gi";

import {
  getAllDepartments,
  getAllFaculties,
  getDegreeById,
  getDegreesByFacultyId,
} from "@/utils/apiRequests/course.api";

import {
  createSubject,
  getGrades,
  getSubjectById,
  getSyllabiByDegreeId,
  updateSubject,
} from "@/utils/apiRequests/curriculum.api";
import { LabelSearchCombobox } from "@/components/ui/customCommand";

const Model = ({ editId, isOpen, setIsOpen, modelRef, setEditId }) => {
  const [formData, setFormData] = useState({ assessment_min_mark: 0 });
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: editId ? updateSubject : createSubject,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["subjectsExtra"]);
      setEditId("");
      toast.success(res.message);
    },
    onError: (err) => {
      setEditId("");
      toast.error("Operation failed");
    },
  });

  const { data, refetch } = useQuery({
    queryFn: () => getSubjectById(editId),
    queryKey: ["subjects", editId],
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
    data: departmentData,
    isLoading: isDepartmentDataLoading,
    isError: isDepartmentDataError,
  } = useQuery({
    queryFn: getAllDepartments,
    queryKey: ["activeDepartments"],
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
    },
  );

  const {
    data: gradesData,
    isLoading: isGradesDataLoading,
    isError: isGradesDataError,
  } = useQuery({
    queryFn: getGrades,
    queryKey: ["grades"],
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
    } else {
      setFormData((curData) => ({
        ...curData,
        [e.split(":")[0]]: e.split(":")[1],
      }));
    }
  };

  const onFormSubmitted = () => {
    mutate(formData);
    setFormData({ assessment_min_mark: 0 });
    setIsOpen(false);
  };

  const onFormReset = () => {
    setFormData(data || { assessment_min_mark: 0 });
  };

  const onassessmentMinMarkChanged = (e) => {
    let value = e.target.value;

    // If empty, leave it as is or default to 0 depending on your preference
    if (value === "") return;

    let numValue = Number(value);

    // Clamping logic
    if (numValue < 0) {
      numValue = 0;
    } else if (numValue > 100) {
      numValue = 100;
    }

    // Update state only; the input value will update automatically on re-render
    setFormData((curData) => ({
      ...curData,
      assessment_min_mark: numValue,
    }));
  };

  useEffect(() => {
    console.log(formData);
    const isFormValid =
      formData.sub_code &&
      formData.sub_name &&
      formData.f_id &&
      formData.d_id &&
      formData.deg_id &&
      formData.syl_id &&
      formData.sem_no &&
      formData.pass_grade &&
      formData.assessment_min_mark !== "" &&
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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modelRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Subject</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({ assessment_min_mark: 0 });
                  setEditId("");
                }}
              />
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sub_code" className="text-right">
                  Subject Code
                </Label>
                <Input
                  id="sub_code"
                  name="sub_code"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData.sub_code || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sub_name" className="text-right">
                  Subject name
                </Label>
                <Input
                  id="sub_name"
                  name="sub_name"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData.sub_name || ""}
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
                      }));
                      onFormDataChanged(e);
                    }}
                    value={formData.deg_id || null}
                    disabled={
                      !degreeData || isDegreeDataLoading || isDegreeDataError
                    }
                  />
                </div>
              </div>
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
              <div
                className={`${
                  degreeLevelsData ? "grid" : "hidden"
                }  grid-cols-4 gap-4`}
              >
                <Label className="text-right">Level</Label>
                <div className="flex col-span-3 gap-4 flex-wrap">
                  {degreeLevelsData?.levels
                    ?.sort((a, b) => Number(a) - Number(b))
                    ?.map((item) => (
                      <div className="flex items-center space-x-2" key={item}>
                        <input
                          type="radio"
                          value={item}
                          id={`l${item}`}
                          checked={formData.level == item}
                          name="level"
                          onChange={(e) => onFormDataChanged(e)}
                          className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                        />
                        <Label htmlFor={`l${item}`} className="cursor-pointer">
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
                          onChange={(e) => onFormDataChanged(e)}
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
              </div>
              <div className={`grid grid-cols-4 items-center gap-4`}>
                <Label className="text-right">Offering Department</Label>
                <div className="col-span-3">
                  <LabelSearchCombobox
                    name="d_id"
                    items={departmentData}
                    labelField="d_name"
                    valueField="d_id"
                    placeholder="Search department..."
                    buttonText={
                      isDepartmentDataError
                        ? "Not found"
                        : isDepartmentDataLoading
                          ? "Loading..."
                          : "Select department"
                    }
                    onValueChange={(e) => {
                      onFormDataChanged(e);
                    }}
                    value={formData.d_id || null}
                    disabled={
                      !departmentData ||
                      isDepartmentDataLoading ||
                      isDepartmentDataError
                    }
                  />
                </div>
              </div>
              <div className={`grid grid-cols-4 items-center gap-4`}>
                <Label className="text-right">Pass grade</Label>
                <div className="col-span-3">
                  <LabelSearchCombobox
                    name="pass_grade"
                    items={gradesData}
                    labelField="grade"
                    valueField="id"
                    placeholder="Search grade..."
                    buttonText="Select grade"
                    onValueChange={(e) => {
                      onFormDataChanged(e);
                    }}
                    value={formData.pass_grade || null}
                    disabled={isGradesDataLoading || isGradesDataError}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assessment_min_mark" className="text-right">
                  assessment min mark
                </Label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter min mark"
                  className="flex h-9 col-span-3 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  name="assessment_min_mark"
                  id="assessment_min_mark"
                  onBlur={onassessmentMinMarkChanged} // Logic handles clamping
                  onChange={onFormDataChanged} // Standard change handler
                  value={formData.assessment_min_mark ?? ""}
                />
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
      )}
    </>
  );
};

export default Model;
