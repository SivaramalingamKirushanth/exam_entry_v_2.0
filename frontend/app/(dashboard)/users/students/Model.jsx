"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentRegister } from "@/utils/apiRequests/auth.api";
import { GiCancel } from "react-icons/gi";
import {
  getAllFaculties,
  getDegreesByFacultyId,
} from "@/utils/apiRequests/course.api";
import { getSyllabiByDegreeId } from "@/utils/apiRequests/curriculum.api";
import { LabelSearchCombobox } from "@/components/ui/customCommand";

const Model = ({ isOpen, setIsOpen, modelRef }) => {
  const [formData, setFormData] = useState({});
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: studentRegister,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["students"]);
      toast.success(res.message);
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
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

  const onFormDataChanged = (e) => {
    if (e.target) {
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
    setFormData({});
    setIsOpen(false);
  };

  const onFormReset = () => {
    setFormData(data || {});
  };

  useEffect(() => {
    const isFormValid =
      formData.name &&
      formData.user_name &&
      formData.email &&
      formData.contact_no &&
      formData.f_id &&
      formData.deg_id &&
      formData.syl_id;
    setBtnEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    if (formData?.f_id) degreeDataRefetch();
  }, [formData?.f_id]);

  useEffect(() => {
    if (formData?.deg_id) syllabusDataRefetch();
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
              <h3 className="text-lg font-semibold">Student</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({});
                }}
              />
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData.name || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user_name" className="text-right">
                  User name
                </Label>
                <Input
                  id="user_name"
                  name="user_name"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData.user_name || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="index_num" className="text-right">
                  Index no
                  <br /> (optional)
                </Label>
                <Input
                  id="index_num"
                  name="index_num"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData.index_num || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData.email || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_no" className="text-right">
                  Contact No
                </Label>
                <Input
                  id="contact_no"
                  name="contact_no"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData?.contact_no || ""}
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
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Model;
