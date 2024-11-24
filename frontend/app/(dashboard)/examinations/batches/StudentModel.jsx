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

const StudentModel = ({ editId, isOpen, setIsOpen, modalRef, setEditId }) => {
  const [formData, setFormData] = useState({ status: "true" });
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

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

  const { data: degreeLevelsData, refetch: degreeLevelsDataRefetch } = useQuery(
    {
      queryFn: () => getDegreeById(formData.deg_id),
      queryKey: ["degrees", formData.deg_id],
      enabled: false,
    }
  );

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
    if (formData?.deg_id) degreeLevelsDataRefetch();
  }, [formData?.deg_id]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className={`sm:max-w-[425px] w-full transition-all duration-300 bg-white rounded-lg shadow-lg p-6 h-[95vh]`}
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
            <div className="w-full flex flex-col justify-between h-[80vh]">
              <StudentSelection
                setFormData={setFormData}
                btnEnable={btnEnable}
              />
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

export default StudentModel;
