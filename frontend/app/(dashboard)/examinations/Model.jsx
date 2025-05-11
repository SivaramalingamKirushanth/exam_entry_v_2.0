"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GiCancel } from "react-icons/gi";
import {
  getAllFaculties,
  getDegreeById,
  getDegreesByFacultyId,
} from "@/utils/apiRequests/course.api";

import {
  getGroupsBySylLevSem,
  getSubjectsByGrp,
  getSyllabiByDegreeId,
} from "@/utils/apiRequests/curriculum.api";
import { getAllActiveLecturers } from "@/utils/apiRequests/user.api";
import { FaExclamation } from "react-icons/fa";
import {
  createBatch,
  getBatchById,
  getBatchTimePeriod,
  setBatchTimePeriod,
  updateBatch,
} from "@/utils/apiRequests/batch.api";
import { FaCircleCheck } from "react-icons/fa6";
import { convertUTCToLocal } from "@/utils/functions";
import Image from "next/image";
import { LabelSearchCombobox } from "@/components/ui/customCommand";

const extractEndDates = (batchTimePeriodData) => {
  if (batchTimePeriodData && batchTimePeriodData.length) {
    let students_end = convertUTCToLocal(
      batchTimePeriodData?.filter((obj) => obj.user_type == "5")[0]?.end_date
    );
    let lecturers_end = convertUTCToLocal(
      batchTimePeriodData?.filter((obj) => obj.user_type == "4")[0]?.end_date
    );
    let hod_end = convertUTCToLocal(
      batchTimePeriodData?.filter((obj) => obj.user_type == "3")[0]?.end_date
    );
    let dean_end = convertUTCToLocal(
      batchTimePeriodData?.filter((obj) => obj.user_type == "2")[0]?.end_date
    );

    return {
      students_end,
      lecturers_end,
      hod_end,
      dean_end,
    };
  }
};

const Model = ({ editId, isOpen, setIsOpen, modalRef, setEditId }) => {
  const [formData, setFormData] = useState({});
  const [timePeriods, setTimePeriods] = useState({});
  const [sidePartEnable, setSidePartEnable] = useState(false);
  const [btnEnable, setBtnEnable] = useState(false);
  const [lecturersPartValid, setLecturersPartValid] = useState(false);
  const [datesPartValid, setDatesPartValid] = useState(false);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: editId ? updateBatch : createBatch,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["batches"]);
      toast.success(res.message);
      setEditId("");
    },
    onError: (err) => {
      setEditId("");
      toast.error("Operation failed");
    },
  });

  const { mutate: batchTimePeriodMutate } = useMutation({
    mutationFn: setBatchTimePeriod,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["batches", "timePeriod", editId]);
      toast.success(res.message);
      setEditId("");
    },
    onError: (err) => {
      setEditId("");
      toast.error("Operation failed");
    },
  });

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => getBatchById(editId),
    queryKey: ["batches", editId],
    enabled: false,
  });

  const {
    data: batchTimePeriodData,
    refetch: batchTimePeriodRefetch,
    isLoading: isLoadingBatchTimePeriod,
  } = useQuery({
    queryFn: () => getBatchTimePeriod(editId),
    queryKey: ["batches", "timePeriod", editId],
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

  const {
    data: specificDegreeData,
    refetch: specificDegreeDataRefetch,
    isLoading: isSpecificDegreeDataLoading,
    error: isSpecificDegreeDataError,
  } = useQuery({
    queryFn: () => getDegreeById(formData.deg_id),
    queryKey: ["degrees", formData.deg_id],
    enabled: false,
  });

  const {
    data: groupsBySylLevSemData,
    refetch: groupsBySylLevSemRefetch,
    isLoading: isGroupsBySylLevSemLoading,
    isError: isGroupsBySylLevSemError,
  } = useQuery({
    queryFn: () =>
      getGroupsBySylLevSem(formData.syl_id, formData.level, formData.sem_no),
    queryKey: ["groups", formData.syl_id, formData.level, formData.sem_no],
    enabled: false,
  });

  const {
    data: subjectsByGrpData,
    refetch: subjectsByGrpRefetch,
    isLoading: isSubjectsByGrpLoading,
    isError: isSubjectsByGrpError,
  } = useQuery({
    queryFn: () => getSubjectsByGrp(formData.grp_id),
    queryKey: ["subjects", "group", formData.grp_id],
    enabled: false,
  });

  const {
    data: lecturers,
    isLoading: isLecturersLoading,
    isError: isLecturersError,
  } = useQuery({
    queryFn: getAllActiveLecturers,
    queryKey: ["activeLecturers"],
  });

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        old_batch_code: data.batch_code,
        old_subjects: data.subjects,
        application_open: convertUTCToLocal(data.application_open),
        payment_end: convertUTCToLocal(data.payment_end),
      });
    }
  }, [data]);

  useEffect(() => {
    if (batchTimePeriodData) {
      setTimePeriods(extractEndDates(batchTimePeriodData));
    }
  }, [batchTimePeriodData]);

  const onFormDataChanged = (e) => {
    if (e?.target) {
      setFormData((curData) => ({
        ...curData,
        [e.target?.name]: e.target?.value,
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

    setFormData((curData) => ({
      ...curData,
      academic_year: value,
    }));
    e.target.value = value;
  };

  const onFormSubmitted = () => {
    const batch_code = `${formData.academic_year || "XXXX"}-${
      specificDegreeData?.short || "XX"
    }${formData.level || "X"}${formData.sem_no || "X"}-${
      syllabusData?.find((obj) => obj.syl_id == formData.syl_id)
        ?.commenced_year || "XXXX"
    }${
      groupsBySylLevSemData?.find((obj) => obj.grp_id == formData.grp_id)
        ?.custom_suffix
        ? "-" +
          groupsBySylLevSemData?.find((obj) => obj.grp_id == formData.grp_id)
            ?.custom_suffix
        : ""
    }`;

    if (editId) {
      if (new Date(data?.application_open) < new Date()) {
        const { students_end, lecturers_end, hod_end, dean_end } = timePeriods;

        batchTimePeriodMutate({
          batch_id: editId,
          students_end,
          lecturers_end,
          hod_end,
          dean_end,
        });
      } else {
        const {
          old_batch_code,
          subjects,
          old_subjects,
          batch_id,
          deg_id,
          syl_id,
          application_open,
          level,
          sem_no,
          academic_year,
          payment_end,
          grp_id,
        } = formData;
        const { students_end, lecturers_end, hod_end, dean_end } = timePeriods;

        mutate({
          batch_code,
          old_batch_code,
          subjects,
          old_subjects,
          batch_id,
          deg_id,
          syl_id,
          application_open,
          academic_year,
          level,
          sem_no,
          students_end,
          lecturers_end,
          hod_end,
          dean_end,
          payment_end,
          grp_id,
        });
      }
    } else {
      const {
        subjects,
        deg_id,
        syl_id,
        application_open,
        level,
        sem_no,
        academic_year,
        payment_end,
        grp_id,
      } = formData;
      const { students_end, lecturers_end, hod_end, dean_end } = timePeriods;

      mutate({
        batch_code,
        subjects,
        deg_id,
        syl_id,
        application_open,
        academic_year,
        level,
        sem_no,
        students_end,
        lecturers_end,
        hod_end,
        dean_end,
        payment_end,
        grp_id,
      });
    }

    setTimePeriods({});
    setFormData({});
    setIsOpen(false);
  };

  const onFormReset = () => {
    if (data) {
      setFormData({
        ...data,
        old_batch_code: data.batch_code,
        old_subjects: data.subjects,
        application_open: convertUTCToLocal(data.application_open),
        payment_end: convertUTCToLocal(data.payment_end),
      });
    } else {
      setFormData({});
    }

    if (batchTimePeriodData) {
      setTimePeriods(extractEndDates(batchTimePeriodData));
    } else {
      setTimePeriods({});
    }
  };

  useEffect(() => {
    if (
      data?.sem_no == formData.sem_no &&
      data?.level == formData.level &&
      data?.deg_id == formData.deg_id &&
      data?.syl_id == formData.syl_id &&
      data?.grp_id == formData.grp_id
    ) {
      setFormData((cur) => ({ ...cur }));
    } else {
      setFormData((cur) => ({ ...cur, subjects: {} }));
    }
  }, [
    formData.sem_no,
    formData.level,
    formData.deg_id,
    ,
    formData.syl_id,
    formData.grp_id,
  ]);

  useEffect(() => {
    let isFormValid =
      formData.academic_year &&
      formData.syl_id &&
      formData.f_id &&
      formData.deg_id &&
      formData.sem_no &&
      formData.level &&
      formData.grp_id;

    if (isFormValid) {
      editId && batchTimePeriodRefetch();
      subjectsByGrpRefetch();
    }

    setSidePartEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    let isLecturersPartValid = true;

    if (sidePartEnable) {
      if (subjectsByGrpData?.length) {
        if (formData.subjects) {
          if (
            Object.values(formData.subjects).length == subjectsByGrpData.length
          ) {
            Object.values(formData.subjects).forEach((value) => {
              if (!value) {
                isLecturersPartValid = false;
              }
            });
          } else {
            isLecturersPartValid = false;
          }
        } else {
          isLecturersPartValid = false;
        }
      } else {
        isLecturersPartValid = false;
      }

      setLecturersPartValid(sidePartEnable && isLecturersPartValid);

      let isDatesPartValid =
        formData?.application_open &&
        timePeriods?.students_end &&
        timePeriods?.lecturers_end &&
        timePeriods?.hod_end &&
        timePeriods?.dean_end &&
        formData?.payment_end;

      setDatesPartValid(sidePartEnable && isDatesPartValid);
    }
  }, [formData, timePeriods]);

  useEffect(() => {
    if (sidePartEnable && lecturersPartValid && datesPartValid) {
      setBtnEnable(true);
    } else {
      setBtnEnable(false);
    }
  }, [sidePartEnable, lecturersPartValid, datesPartValid]);

  useEffect(() => {
    if (editId) {
      refetch();
    }
  }, [editId]);

  useEffect(() => {
    if (formData?.f_id) degreeDataRefetch();
  }, [formData?.f_id]);

  useEffect(() => {
    if (formData?.deg_id) syllabusDataRefetch();
  }, [formData?.deg_id]);

  useEffect(() => {
    if (formData?.syl_id && formData?.level && formData?.sem_no)
      groupsBySylLevSemRefetch();
  }, [formData?.syl_id, formData?.level, formData?.sem_no]);

  useEffect(() => {
    if (formData?.deg_id) {
      specificDegreeDataRefetch();
    }
  }, [formData?.deg_id]);

  useEffect(() => {
    setFormData((curData) => ({
      ...curData,
    }));
  }, [
    formData?.f_id,
    formData?.syl_id,
    formData?.deg_id,
    formData?.level,
    formData?.sem_no,
    specificDegreeData,
  ]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div
            ref={modalRef}
            className={`${
              sidePartEnable
                ? "sm:max-w-[90vw] w-[850px]"
                : "sm:max-w-[425px] w-[425px]"
            } transition-all duration-300 bg-white rounded-lg shadow-lg p-6 h-[95vh]`}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Batch</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({});
                  setTimePeriods({});
                  setEditId("");
                }}
              />
            </div>
            {editId ? (
              !isLoading &&
              !isLoadingBatchTimePeriod &&
              !isSubjectsByGrpLoading &&
              !isDegreeDataLoading &&
              !isFacultyDataLoading &&
              !isLecturersLoading ? (
                <div className="w-full flex flex-col gap-1 justify-between h-[80vh]">
                  <div className="flex h-[70%] shrink-0 gap-2">
                    <div
                      className={`flex flex-col justify-start shrink-0 border rounded-md ${
                        sidePartEnable
                          ? "border-green-300 sm:max-w-[360px] w-[360px]"
                          : "border-slate-300 w-full"
                      } p-2`}
                    >
                      <h1 className="font-bold capitalize text-sm mb-1 flex gap-2 items-center">
                        general
                        <FaCircleCheck
                          size={15}
                          className={
                            sidePartEnable ? "text-green-600" : "text-slate-400"
                          }
                        />
                      </h1>
                      <div className="flex flex-col justify-start gap-3 overflow-auto pb-2 w-full h-full">
                        <div className="grid grid-cols-4 items-center gap-4 pr-[2px]">
                          <Label htmlFor="batch_code" className="text-right">
                            Batch Code
                          </Label>
                          <Input
                            id="batch_code"
                            name="batch_code"
                            className="col-span-3"
                            disabled={true}
                            value={`${formData.academic_year || "XXXX"}-${
                              specificDegreeData?.short || "XX"
                            }${formData.level || "X"}${
                              formData.sem_no || "X"
                            }-${
                              syllabusData?.find(
                                (obj) => obj.syl_id == formData.syl_id
                              )?.commenced_year || "XXXX"
                            }${
                              groupsBySylLevSemData?.find(
                                (obj) => obj.grp_id == formData.grp_id
                              )?.custom_suffix
                                ? "-" +
                                  groupsBySylLevSemData?.find(
                                    (obj) => obj.grp_id == formData.grp_id
                                  )?.custom_suffix
                                : ""
                            }`}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 pr-[2px]">
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
                            disabled={
                              data
                                ? new Date(data?.application_open) < new Date()
                                : false
                            }
                            autoFocus
                          />
                        </div>

                        <div
                          className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                        >
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
                              disabled={
                                data
                                  ? new Date(data?.application_open) <
                                    new Date()
                                  : !facultyData ||
                                    isFacultyDataLoading ||
                                    isFacultyDataError
                              }
                            />
                          </div>
                        </div>
                        <div
                          className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                        >
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
                                  grp_id: "",
                                }));
                                onFormDataChanged(e);
                              }}
                              value={formData.deg_id || null}
                              disabled={
                                data
                                  ? new Date(data?.application_open) <
                                    new Date()
                                  : !degreeData ||
                                    isDegreeDataLoading ||
                                    isDegreeDataError
                              }
                            />
                          </div>
                        </div>
                        <div
                          className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                        >
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
                                setFormData((cur) => ({
                                  ...cur,
                                  grp_id: "",
                                }));
                                onFormDataChanged(e);
                              }}
                              value={formData.syl_id || null}
                              disabled={
                                data
                                  ? new Date(data?.application_open) <
                                    new Date()
                                  : !syllabusData ||
                                    isSyllabusDataLoading ||
                                    isSyllabusDataError
                              }
                            />
                          </div>
                        </div>

                        <div
                          className={`${
                            specificDegreeData ? "grid" : "hidden"
                          }  grid-cols-4 gap-4`}
                        >
                          <Label className="text-right">Level</Label>
                          <div className="flex col-span-3 gap-4 flex-wrap">
                            {specificDegreeData?.levels?.map((item) => (
                              <div
                                className="flex items-center space-x-2"
                                key={item}
                              >
                                <input
                                  type="radio"
                                  value={item}
                                  id={`l${item}`}
                                  checked={formData.level == item}
                                  name="level"
                                  onChange={(e) => {
                                    setFormData((cur) => ({
                                      ...cur,
                                      grp_id: "",
                                    }));
                                    onFormDataChanged(e);
                                  }}
                                  onBlur={(e) => {
                                    e.target.value = e.target.value.trim();
                                    onFormDataChanged(e);
                                  }}
                                  className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                                  disabled={
                                    data
                                      ? new Date(data?.application_open) <
                                        new Date()
                                      : !specificDegreeData ||
                                        isSpecificDegreeDataError ||
                                        isSpecificDegreeDataLoading
                                  }
                                />
                                <Label
                                  htmlFor={`l${item}`}
                                  className={`cursor-pointer ${
                                    data &&
                                    new Date(data?.application_open) <
                                      new Date() &&
                                    "text-slate-400"
                                  }`}
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
                            {Array(+specificDegreeData?.no_of_sem_per_year || 0)
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
                                      setFormData((cur) => ({
                                        ...cur,
                                        grp_id: "",
                                      }));
                                      onFormDataChanged(e);
                                    }}
                                    className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                                    disabled={
                                      data
                                        ? new Date(data?.application_open) <
                                          new Date()
                                        : !specificDegreeData ||
                                          isSpecificDegreeDataError ||
                                          isSpecificDegreeDataLoading
                                    }
                                  />
                                  <Label
                                    htmlFor={`s${ind + 1}`}
                                    className={`cursor-pointer ${
                                      data &&
                                      new Date(data?.application_open) <
                                        new Date() &&
                                      "text-slate-400"
                                    }`}
                                  >
                                    {ind + 1}
                                  </Label>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div
                          className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                        >
                          <Label className="text-right">Group</Label>
                          <div className="col-span-3">
                            <LabelSearchCombobox
                              name="grp_id"
                              items={groupsBySylLevSemData}
                              labelField="grp_code"
                              valueField="grp_id"
                              placeholder="Search group..."
                              buttonText={
                                isGroupsBySylLevSemError
                                  ? "Not found"
                                  : isGroupsBySylLevSemLoading
                                  ? "Loading..."
                                  : "Select group"
                              }
                              onValueChange={(e) => {
                                onFormDataChanged(e);
                              }}
                              value={formData.grp_id || null}
                              disabled={
                                data
                                  ? new Date(data?.application_open) <
                                    new Date()
                                  : !groupsBySylLevSemData ||
                                    isGroupsBySylLevSemLoading ||
                                    isGroupsBySylLevSemError
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {sidePartEnable &&
                      (subjectsByGrpData?.length ? (
                        <div
                          className={`flex flex-col justify-start border rounded-md container flex-1 mx-auto ${
                            lecturersPartValid
                              ? "border-green-300"
                              : "border-slate-300"
                          } p-2`}
                        >
                          <h1 className="font-bold capitalize text-sm mb-1 flex gap-2 items-center">
                            Lecturer in Charge
                            <FaCircleCheck
                              size={15}
                              className={
                                lecturersPartValid
                                  ? "text-green-600"
                                  : "text-slate-400"
                              }
                            />
                          </h1>
                          <div className="overflow-auto pb-2 h-full w-full p-1 flex flex-col justify-start gap-3">
                            {subjectsByGrpData?.map((obj) => {
                              return (
                                <div
                                  className={`grid grid-cols-4 items-center gap-4`}
                                  key={obj.sub_id}
                                >
                                  <Label className="text-right">
                                    {obj.sub_code}
                                  </Label>
                                  <div className="col-span-3">
                                    <LabelSearchCombobox
                                      name={"sub-" + obj.sub_id}
                                      items={lecturers}
                                      labelField="name"
                                      valueField="l_id"
                                      placeholder="Search lecturer..."
                                      buttonText={
                                        isLecturersError
                                          ? "Not found"
                                          : isLecturersLoading
                                          ? "Loading..."
                                          : "Select lecturer"
                                      }
                                      onValueChange={(e) => {
                                        const l_id = e.target.value;
                                        setFormData((cur) => ({
                                          ...cur,
                                          subjects: {
                                            ...cur.subjects,
                                            [obj.sub_id]: l_id,
                                          },
                                        }));
                                      }}
                                      value={
                                        formData?.subjects[obj.sub_id] || null
                                      }
                                      disabled={
                                        data
                                          ? new Date(data?.application_open) <
                                            new Date()
                                          : false
                                      }
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 flex">
                          <FaExclamation className="text-red-700 text-5xl inline-block" />
                          <p>
                            There is no subject group available for{" "}
                            {formData.level}
                            {formData.level == "1" ? (
                              <sup>st</sup>
                            ) : formData.level == "2" ? (
                              <sup>nd</sup>
                            ) : formData.level == "3" ? (
                              <sup>rd</sup>
                            ) : (
                              <sup>th</sup>
                            )}
                            &nbsp; year, {formData.sem_no}
                            {formData.sem_no == "1" ? (
                              <sup>st</sup>
                            ) : formData.sem_no == "2" ? (
                              <sup>nd</sup>
                            ) : formData.sem_no == "3" ? (
                              <sup>rd</sup>
                            ) : (
                              <sup>th</sup>
                            )}
                            &nbsp; semester of {specificDegreeData?.deg_name}
                          </p>
                        </div>
                      ))}
                  </div>
                  {sidePartEnable && (
                    <div
                      className={`flex flex-col justify-between h-[22%] shrink-0 border rounded-md ${
                        datesPartValid ? "border-green-300" : "border-slate-300"
                      } p-2`}
                    >
                      <h1 className="font-bold capitalize text-sm mb-1 flex gap-2 items-center">
                        Important dates
                        <FaCircleCheck
                          size={15}
                          className={
                            datesPartValid ? "text-green-600" : "text-slate-400"
                          }
                        />
                      </h1>
                      <div className="flex flex-col justify-start gap-3 overflow-auto pb-2 w-full h-full">
                        <div className="flex justify-between px-2">
                          <div className="items-center gap-3">
                            <Label
                              htmlFor="application_open"
                              className="w-32 inline-block"
                            >
                              Application open
                            </Label>
                            <input
                              type="datetime-local"
                              id="application_open"
                              name="application_open"
                              className={`col-span-3 ${
                                data &&
                                new Date(data?.application_open) < new Date() &&
                                "text-slate-400"
                              }`}
                              onChange={(e) => {
                                if (new Date(e.target.value) > new Date()) {
                                  onFormDataChanged(e);
                                } else {
                                  toast.error(
                                    "Invalid date. Choose a future date."
                                  );
                                }
                              }}
                              value={formData?.application_open || ""}
                              disabled={
                                data
                                  ? new Date(data?.application_open) <
                                    new Date()
                                  : false
                              }
                            />
                          </div>
                          <div className="items-center gap-3">
                            <Label
                              htmlFor="students_end"
                              className="w-32 inline-block"
                            >
                              Students&apos; deadline
                            </Label>
                            <input
                              type="datetime-local"
                              id="students_end"
                              name="students_end"
                              className="col-span-3"
                              onChange={(e) =>
                                setTimePeriods((cur) => ({
                                  ...cur,
                                  [e.target.name]: e.target.value,
                                }))
                              }
                              value={timePeriods?.students_end || ""}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between px-2">
                          <div className="items-center gap-3">
                            <Label
                              htmlFor="lecturers_end"
                              className="w-32 inline-block"
                            >
                              Lecturers&apos; deadline
                            </Label>
                            <input
                              type="datetime-local"
                              id="lecturers_end"
                              name="lecturers_end"
                              className="col-span-3"
                              onChange={(e) =>
                                setTimePeriods((cur) => ({
                                  ...cur,
                                  [e.target.name]: e.target.value,
                                }))
                              }
                              value={timePeriods?.lecturers_end || ""}
                            />
                          </div>
                          <div className="items-center gap-3">
                            <Label
                              htmlFor="hod_end"
                              className="w-32 inline-block"
                            >
                              HOD&apos;s deadline
                            </Label>
                            <input
                              type="datetime-local"
                              id="hod_end"
                              name="hod_end"
                              className="col-span-3"
                              onChange={(e) =>
                                setTimePeriods((cur) => ({
                                  ...cur,
                                  [e.target.name]: e.target.value,
                                }))
                              }
                              value={timePeriods?.hod_end || ""}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between px-2">
                          <div className="items-center gap-3">
                            <Label
                              htmlFor="dean_end"
                              className="w-32 inline-block"
                            >
                              Dean&apos;s deadline
                            </Label>
                            <input
                              type="datetime-local"
                              id="dean_end"
                              name="dean_end"
                              className="col-span-3"
                              onChange={(e) =>
                                setTimePeriods((cur) => ({
                                  ...cur,
                                  [e.target.name]: e.target.value,
                                }))
                              }
                              value={timePeriods?.dean_end || ""}
                            />
                          </div>
                          <div className="items-center gap-3">
                            <Label
                              htmlFor="payment_end"
                              className="w-32 inline-block"
                            >
                              Payment deadline
                            </Label>
                            <input
                              type="datetime-local"
                              id="payment_end"
                              name="payment_end"
                              className="col-span-3"
                              onChange={(e) => onFormDataChanged(e)}
                              value={formData.payment_end || ""}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between space-x-2 my-1">
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
              ) : (
                <div className="h-full w-full flex justify-center items-center">
                  <Image
                    className="w-20 h-20 animate-spin "
                    src="https://www.svgrepo.com/show/491270/loading-spinner.svg"
                    alt="Loading icon"
                    width={80}
                    height={80}
                  />
                </div>
              )
            ) : (
              <div className="w-full flex flex-col gap-1 justify-between h-[80vh]">
                <div className="flex h-[70%] shrink-0 gap-2">
                  <div
                    className={`flex flex-col justify-start shrink-0 border rounded-md ${
                      sidePartEnable
                        ? "border-green-300 sm:max-w-[360px] w-[360px]"
                        : "border-slate-300 w-full"
                    } p-2`}
                  >
                    <h1 className="font-bold capitalize text-sm mb-1 flex gap-2 items-center">
                      general
                      <FaCircleCheck
                        size={15}
                        className={
                          sidePartEnable ? "text-green-600" : "text-slate-400"
                        }
                      />
                    </h1>
                    <div className="flex flex-col justify-start gap-3 overflow-auto pb-2 w-full h-full">
                      <div className="grid grid-cols-4 items-center gap-4 pr-[2px]">
                        <Label htmlFor="batch_code" className="text-right">
                          Batch Code
                        </Label>
                        <Input
                          id="batch_code"
                          name="batch_code"
                          className="col-span-3"
                          disabled={true}
                          value={`${formData.academic_year || "XXXX"}-${
                            specificDegreeData?.short || "XX"
                          }${formData.level || "X"}${formData.sem_no || "X"}-${
                            syllabusData?.find(
                              (obj) => obj.syl_id == formData.syl_id
                            )?.commenced_year || "XXXX"
                          }${
                            groupsBySylLevSemData?.find(
                              (obj) => obj.grp_id == formData.grp_id
                            )?.custom_suffix
                              ? "-" +
                                groupsBySylLevSemData?.find(
                                  (obj) => obj.grp_id == formData.grp_id
                                )?.custom_suffix
                              : ""
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4 pr-[2px]">
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
                          disabled={
                            data
                              ? new Date(data?.application_open) < new Date()
                              : false
                          }
                          autoFocus
                        />
                      </div>

                      <div
                        className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                      >
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
                            disabled={
                              data
                                ? new Date(data?.application_open) < new Date()
                                : !facultyData ||
                                  isFacultyDataLoading ||
                                  isFacultyDataError
                            }
                          />
                        </div>
                      </div>
                      <div
                        className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                      >
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
                                grp_id: "",
                              }));
                              onFormDataChanged(e);
                            }}
                            value={formData.deg_id || null}
                            disabled={
                              data
                                ? new Date(data?.application_open) < new Date()
                                : !degreeData ||
                                  isDegreeDataLoading ||
                                  isDegreeDataError
                            }
                          />
                        </div>
                      </div>
                      <div
                        className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                      >
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
                              setFormData((cur) => ({
                                ...cur,
                                grp_id: "",
                              }));
                              onFormDataChanged(e);
                            }}
                            value={formData.syl_id || null}
                            disabled={
                              data
                                ? new Date(data?.application_open) < new Date()
                                : !syllabusData ||
                                  isSyllabusDataLoading ||
                                  isSyllabusDataError
                            }
                          />
                        </div>
                      </div>

                      <div
                        className={`${
                          specificDegreeData ? "grid" : "hidden"
                        }  grid-cols-4 gap-4`}
                      >
                        <Label className="text-right">Level</Label>
                        <div className="flex col-span-3 gap-4 flex-wrap">
                          {specificDegreeData?.levels
                            ?.map((level) => Number(level))
                            ?.sort((a, b) => a - b)
                            ?.map((item) => (
                              <div
                                className="flex items-center space-x-2"
                                key={item}
                              >
                                <input
                                  type="radio"
                                  value={item}
                                  id={`l${item}`}
                                  checked={formData.level == item}
                                  name="level"
                                  onChange={(e) => {
                                    setFormData((cur) => ({
                                      ...cur,
                                      grp_id: "",
                                    }));
                                    onFormDataChanged(e);
                                  }}
                                  onBlur={(e) => {
                                    e.target.value = e.target.value.trim();
                                    onFormDataChanged(e);
                                  }}
                                  className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                                  disabled={
                                    data
                                      ? new Date(data?.application_open) <
                                        new Date()
                                      : !specificDegreeData ||
                                        isSpecificDegreeDataError ||
                                        isSpecificDegreeDataLoading
                                  }
                                />
                                <Label
                                  htmlFor={`l${item}`}
                                  className={`cursor-pointer ${
                                    data &&
                                    new Date(data?.application_open) <
                                      new Date() &&
                                    "text-slate-400"
                                  }`}
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
                          {Array(+specificDegreeData?.no_of_sem_per_year || 0)
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
                                    setFormData((cur) => ({
                                      ...cur,
                                      grp_id: "",
                                    }));
                                    onFormDataChanged(e);
                                  }}
                                  className="h-4 w-4 shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 accent-black"
                                  disabled={
                                    data
                                      ? new Date(data?.application_open) <
                                        new Date()
                                      : !specificDegreeData ||
                                        isSpecificDegreeDataLoading ||
                                        isSpecificDegreeDataError
                                  }
                                />
                                <Label
                                  htmlFor={`s${ind + 1}`}
                                  className={`cursor-pointer ${
                                    data &&
                                    new Date(data?.application_open) <
                                      new Date() &&
                                    "text-slate-400"
                                  }`}
                                >
                                  {ind + 1}
                                </Label>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div
                        className={`grid grid-cols-4 items-center gap-4 pr-[2px]`}
                      >
                        <Label className="text-right">Group</Label>
                        <div className="col-span-3">
                          <LabelSearchCombobox
                            name="grp_id"
                            items={groupsBySylLevSemData}
                            labelField="grp_code"
                            valueField="grp_id"
                            placeholder="Search group..."
                            buttonText={
                              isGroupsBySylLevSemError
                                ? "Not found"
                                : isGroupsBySylLevSemLoading
                                ? "Loading..."
                                : "Select group"
                            }
                            onValueChange={(e) => {
                              onFormDataChanged(e);
                            }}
                            value={formData.grp_id || null}
                            disabled={
                              data
                                ? new Date(data?.application_open) < new Date()
                                : !groupsBySylLevSemData ||
                                  isGroupsBySylLevSemLoading ||
                                  isGroupsBySylLevSemError
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {sidePartEnable &&
                    (subjectsByGrpData?.length ? (
                      <div
                        className={`flex flex-col justify-start border rounded-md container flex-1 mx-auto ${
                          lecturersPartValid
                            ? "border-green-300"
                            : "border-slate-300"
                        } p-2`}
                      >
                        <h1 className="font-bold capitalize text-sm mb-1 flex gap-2 items-center">
                          Lecturer in Charge
                          <FaCircleCheck
                            size={15}
                            className={
                              lecturersPartValid
                                ? "text-green-600"
                                : "text-slate-400"
                            }
                          />
                        </h1>
                        <div className="overflow-auto pb-2 h-full w-full p-1 flex flex-col justify-start gap-3">
                          {subjectsByGrpData?.map((obj) => {
                            return (
                              <div
                                className={`grid grid-cols-4 items-center gap-4`}
                                key={obj.sub_id}
                              >
                                <Label className="text-right">
                                  {obj.sub_code}
                                </Label>
                                <div className="col-span-3">
                                  <LabelSearchCombobox
                                    name={"sub-" + obj.sub_id}
                                    items={lecturers}
                                    labelField="name"
                                    valueField="l_id"
                                    placeholder="Search lecturer..."
                                    buttonText={
                                      isLecturersError
                                        ? "Not found"
                                        : isLecturersLoading
                                        ? "Loading..."
                                        : "Select lecturer"
                                    }
                                    onValueChange={(e) => {
                                      const l_id = e.target.value;
                                      setFormData((cur) => ({
                                        ...cur,
                                        subjects: {
                                          ...cur.subjects,
                                          [obj.sub_id]: l_id,
                                        },
                                      }));
                                    }}
                                    value={
                                      formData?.subjects[obj.sub_id] || null
                                    }
                                    disabled={
                                      data
                                        ? new Date(data?.application_open) <
                                          new Date()
                                        : false
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 flex">
                        <FaExclamation className="text-red-700 text-5xl inline-block" />
                        <p>
                          There is no subject group available for{" "}
                          {formData.level}
                          {formData.level == "1" ? (
                            <sup>st</sup>
                          ) : formData.level == "2" ? (
                            <sup>nd</sup>
                          ) : formData.level == "3" ? (
                            <sup>rd</sup>
                          ) : (
                            <sup>th</sup>
                          )}
                          &nbsp; year, {formData.sem_no}
                          {formData.sem_no == "1" ? (
                            <sup>st</sup>
                          ) : formData.sem_no == "2" ? (
                            <sup>nd</sup>
                          ) : formData.sem_no == "3" ? (
                            <sup>rd</sup>
                          ) : (
                            <sup>th</sup>
                          )}
                          &nbsp; semester of {specificDegreeData?.deg_name}
                        </p>
                      </div>
                    ))}
                </div>
                {sidePartEnable && (
                  <div
                    className={`flex flex-col justify-between h-[22%] shrink-0 border rounded-md ${
                      datesPartValid ? "border-green-300" : "border-slate-300"
                    } p-2`}
                  >
                    <h1 className="font-bold capitalize text-sm mb-1 flex gap-2 items-center">
                      Important dates
                      <FaCircleCheck
                        size={15}
                        className={
                          datesPartValid ? "text-green-600" : "text-slate-400"
                        }
                      />
                    </h1>
                    <div className="flex flex-col justify-start gap-3 overflow-auto pb-2 w-full h-full">
                      <div className="flex justify-between px-2">
                        <div className="items-center gap-3">
                          <Label
                            htmlFor="application_open"
                            className="w-32 inline-block"
                          >
                            Application open
                          </Label>
                          <input
                            type="datetime-local"
                            id="application_open"
                            name="application_open"
                            className={`col-span-3 ${
                              data &&
                              new Date(data?.application_open) < new Date() &&
                              "text-slate-400"
                            }`}
                            onChange={(e) => {
                              if (new Date(e.target.value) > new Date()) {
                                onFormDataChanged(e);
                              } else {
                                toast.error(
                                  "Invalid date. Choose a future date."
                                );
                              }
                            }}
                            value={formData?.application_open || ""}
                            disabled={
                              data
                                ? new Date(data?.application_open) < new Date()
                                : false
                            }
                          />
                        </div>
                        <div className="items-center gap-3">
                          <Label
                            htmlFor="students_end"
                            className="w-32 inline-block"
                          >
                            Students&apos; deadline
                          </Label>
                          <input
                            type="datetime-local"
                            id="students_end"
                            name="students_end"
                            className="col-span-3"
                            onChange={(e) =>
                              setTimePeriods((cur) => ({
                                ...cur,
                                [e.target.name]: e.target.value,
                              }))
                            }
                            value={timePeriods?.students_end || ""}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between px-2">
                        <div className="items-center gap-3">
                          <Label
                            htmlFor="lecturers_end"
                            className="w-32 inline-block"
                          >
                            Lecturers&apos; deadline
                          </Label>
                          <input
                            type="datetime-local"
                            id="lecturers_end"
                            name="lecturers_end"
                            className="col-span-3"
                            onChange={(e) =>
                              setTimePeriods((cur) => ({
                                ...cur,
                                [e.target.name]: e.target.value,
                              }))
                            }
                            value={timePeriods?.lecturers_end || ""}
                          />
                        </div>
                        <div className="items-center gap-3">
                          <Label
                            htmlFor="hod_end"
                            className="w-32 inline-block"
                          >
                            HOD&apos;s deadline
                          </Label>
                          <input
                            type="datetime-local"
                            id="hod_end"
                            name="hod_end"
                            className="col-span-3"
                            onChange={(e) =>
                              setTimePeriods((cur) => ({
                                ...cur,
                                [e.target.name]: e.target.value,
                              }))
                            }
                            value={timePeriods?.hod_end || ""}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between px-2">
                        <div className="items-center gap-3">
                          <Label
                            htmlFor="dean_end"
                            className="w-32 inline-block"
                          >
                            Dean&apos;s deadline
                          </Label>
                          <input
                            type="datetime-local"
                            id="dean_end"
                            name="dean_end"
                            className="col-span-3"
                            onChange={(e) =>
                              setTimePeriods((cur) => ({
                                ...cur,
                                [e.target.name]: e.target.value,
                              }))
                            }
                            value={timePeriods?.dean_end || ""}
                          />
                        </div>
                        <div className="items-center gap-3">
                          <Label
                            htmlFor="payment_end"
                            className="w-32 inline-block"
                          >
                            Payment deadline
                          </Label>
                          <input
                            type="datetime-local"
                            id="payment_end"
                            name="payment_end"
                            className="col-span-3"
                            onChange={(e) => onFormDataChanged(e)}
                            value={timePeriods?.payment_end || ""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between space-x-2 my-1">
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
