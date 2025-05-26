"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { multipleStudentsRegister } from "@/utils/apiRequests/auth.api";
import { GiCancel } from "react-icons/gi";
import Dropzone from "@/components/Dropzone";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllFaculties,
  getDegreesByFacultyId,
} from "@/utils/apiRequests/course.api";
import { getSyllabiByDegreeId } from "@/utils/apiRequests/curriculum.api";
import { LabelSearchCombobox } from "@/components/ui/customCommand";

const ImportModel = ({ isImportOpen, setIsImportOpen, importModelRef }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [btnEnable, setBtnEnable] = useState(false);
  const queryClient = useQueryClient();

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
    }
  };

  const onFormSubmitted = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("f_id", formData.f_id);
    formData.append("syl_id", formData.syl_id);

    try {
      const result = await multipleStudentsRegister(formData);

      if (result.isFile) {
        toast.success("Failed records file downloaded.");
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Operation failed. Please try again.");
      console.error("Error:", error);
    } finally {
      queryClient.invalidateQueries(["students"]);
      setFile(null);
      setFormData({});
      setIsLoading(false);
      setIsImportOpen(false);
    }
  };

  useEffect(() => {
    const isFormValid = formData.f_id && formData.deg_id && formData.syl_id;
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
      {isImportOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={importModelRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Student</h3>
              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsImportOpen(false);
                  setFile(null);
                  setFormData({});
                }}
              />
            </div>
            <div className="grid gap-1 py-1">
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

            <div className="font-bahnschriftCon pl-5 mt-1">
              <h2 className="font-semibold">Instructions</h2>
              <ul className="list-disc text-sm">
                <li>Ensure the file is in CSV format.</li>
                <li>
                  The first row must be a header row, and the columns must be in
                  the following exact order:
                  <ol className="list-decimal list-inside">
                    <li>
                      <strong>Name</strong>
                    </li>
                    <li>
                      <strong>User name</strong>
                    </li>
                    <li>
                      <strong>Index no</strong>
                    </li>
                    <li>
                      <strong>Email</strong>
                    </li>
                    <li>
                      <strong>Contact no</strong>
                    </li>
                  </ol>
                </li>
                <li>
                  Each row after the header must represent a single student.
                </li>
              </ul>
            </div>

            <div className="grid gap-4 py-2">
              <Dropzone file={file} setFile={setFile} />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                disabled={!file || !btnEnable || isLoading}
                onClick={onFormSubmitted}
              >
                {isLoading ? "Importing..." : "Import"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportModel;
