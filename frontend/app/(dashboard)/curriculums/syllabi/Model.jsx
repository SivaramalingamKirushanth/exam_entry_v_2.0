"use client";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GiCancel } from "react-icons/gi";

import {
  getAllFaculties,
  getDegreesByFacultyId,
} from "@/utils/apiRequests/course.api";

import {
  createSyllabus,
  getSyllabusById,
  updateSyllabus,
} from "@/utils/apiRequests/curriculum.api";
import { LabelSearchCombobox } from "@/components/ui/customCommand";

const Model = ({ editId, isOpen, setIsOpen, modalRef, setEditId }) => {
  const [formData, setFormData] = useState({});
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

  const onCommencedYearChanged = (e) => {
    let value = +e.target.value;
    if (value < +e.target.min) {
      value = +e.target.min;
    } else if (value > +e.target.max) {
      value = +e.target.max;
    }

    setFormData((curData) => ({
      ...curData,
      commenced_year: value,
    }));
    e.target.value = value;
  };

  const { status, mutate } = useMutation({
    mutationFn: editId ? updateSyllabus : createSyllabus,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["syllabusExtra"]);
      setEditId("");
      toast.success(res.message);
    },
    onError: (err) => {
      setEditId("");
      toast.error("Operation failed");
    },
  });

  const { data, refetch } = useQuery({
    queryFn: () => getSyllabusById(editId),
    queryKey: ["syllabus", editId],
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
    setFormData({});
    setIsOpen(false);
  };

  const onFormReset = () => {
    setFormData(data || {});
  };

  useEffect(() => {
    const isFormValid =
      formData.f_id && formData.deg_id && formData.commenced_year;
    setBtnEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    editId && refetch();
  }, [editId]);

  useEffect(() => {
    if (formData?.f_id) degreeDataRefetch();
  }, [formData?.f_id]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Syllabus</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({});
                  setEditId("");
                }}
              />
            </div>
            <div className="grid gap-4 py-4">
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
                      onFormDataChanged(e);
                    }}
                    value={formData.deg_id || null}
                    disabled={
                      !degreeData || isDegreeDataLoading || isDegreeDataError
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="commenced_year" className="text-right">
                  Commenced year
                </Label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  placeholder="Enter year"
                  className="flex h-9 col-span-3 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  name="commenced_year"
                  id="commenced_year"
                  onBlur={(e) => onCommencedYearChanged(e)}
                  onChange={(e) => onFormDataChanged(e)}
                  value={formData.commenced_year || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expired_year" className="text-right">
                  Expired year <br /> (optional)
                </Label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  placeholder="Enter year"
                  className="flex h-9 col-span-3 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  name="expired_year"
                  id="expired_year"
                  onChange={(e) => onFormDataChanged(e)}
                  value={formData.expired_year || ""}
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
