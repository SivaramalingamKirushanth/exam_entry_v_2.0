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
  createDegree,
  getAllFaculties,
  getDegreeById,
  updateDegree,
} from "@/utils/apiRequests/course.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LabelSearchCombobox } from "@/components/ui/customCommand";

const Model = ({ editId, isOpen, setIsOpen, modalRef, setEditId }) => {
  const [formData, setFormData] = useState({
    levels: [],
    no_of_sem_per_year: "2",
  });
  const [btnEnable, setBtnEnable] = useState(false);
  const [levelMore, setLevelMore] = useState(false);
  const queryClient = useQueryClient();

  const { status, mutate } = useMutation({
    mutationFn: editId ? updateDegree : createDegree,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["degreesExtra"]);
      setEditId("");
      setLevelMore(false);
      toast.success(res.message);
    },
    onError: (err) => {
      setEditId("");
      setLevelMore(false);
      toast.error("Operation failed");
    },
  });

  const { data, refetch } = useQuery({
    queryFn: () => getDegreeById(editId),
    queryKey: ["degrees", editId],
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

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const onFormDataChanged = (e) => {
    if (typeof e == "string" && e.startsWith("level")) {
      setFormData((curData) => ({
        ...curData,
        levels: [...curData.levels, e.split(":")[1]],
      }));
    } else if (e?.target) {
      setFormData((curData) => ({
        ...curData,
        [e.target?.name]: e.target?.value,
      }));
    }
  };

  const onFormSubmitted = () => {
    mutate(formData);
    setFormData({ levels: [], no_of_sem_per_year: "2" });
    setIsOpen(false);
  };

  const onFormReset = () => {
    setFormData(data || { levels: [], no_of_sem_per_year: "2" });
  };

  const onSemCountChanged = (e) => {
    let value = +e.target.value;
    if (value < +e.target.min) {
      value = +e.target.min;
    } else if (value > +e.target.max) {
      value = +e.target.max;
    }

    setFormData((curData) => ({
      ...curData,
      no_of_sem_per_year: value,
    }));
    e.target.value = value;
  };

  useEffect(() => {
    const isFormValid =
      formData.deg_name &&
      formData.short &&
      formData.f_id &&
      formData.no_of_sem_per_year &&
      formData.levels.length;
    setBtnEnable(isFormValid);
  }, [formData]);

  useEffect(() => {
    editId && refetch();
  }, [editId]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg w-[425px] p-6"
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-lg font-semibold">Degree</h3>

              <GiCancel
                className="text-2xl hover:cursor-pointer hover:text-zinc-700"
                onClick={() => {
                  setIsOpen(false);
                  setFormData({
                    levels: [],
                    no_of_sem_per_year: "2",
                  });
                  setLevelMore(false);
                  setEditId("");
                }}
              />
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deg_name" className="text-right">
                  Name
                </Label>
                <Input
                  id="deg_name"
                  name="deg_name"
                  className="col-span-3"
                  onChange={(e) => onFormDataChanged(e)}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    onFormDataChanged(e);
                  }}
                  value={formData.deg_name || ""}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="short" className="text-right">
                  Short name
                </Label>
                <Input
                  id="short"
                  name="short"
                  className="col-span-3 uppercase"
                  onChange={(e) => {
                    let ele = e;
                    ele.target.value = ele.target.value.toUpperCase();
                    onFormDataChanged(ele);
                  }}
                  onBlur={(e) => {
                    e.target.value = e.target.value.trim();
                    let ele = e;
                    ele.target.value = ele.target.value.toUpperCase();
                    onFormDataChanged(ele);
                  }}
                  value={formData.short || ""}
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
                    onValueChange={onFormDataChanged}
                    value={formData.f_id || null}
                    disabled={isFacultyDataLoading || isFacultyDataError}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right">Levels</Label>

                <div className="items-top flex col-span-3 items-center gap-4 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    .slice(0, !levelMore ? 4 : undefined)
                    .map((item) => (
                      <div
                        className="items-top flex space-x-2 items-center"
                        key={item}
                      >
                        <Checkbox
                          id={`level${item}`}
                          onCheckedChange={(e) => {
                            e
                              ? onFormDataChanged(`level:${item}`)
                              : setFormData((curData) => ({
                                  ...curData,
                                  levels: curData.levels.filter(
                                    (ele) => ele != item
                                  ),
                                }));
                          }}
                          checked={
                            formData.levels?.includes(item.toString()) || ""
                          }
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`level${item}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {item}
                          </label>
                        </div>
                      </div>
                    ))}
                  {!levelMore && (
                    <span
                      className="text-blue-500 hover:text-blue-600 cursor-pointer"
                      onClick={() => setLevelMore(true)}
                    >
                      more..
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="no_of_sem_per_year" className="text-right">
                  Semesters per year
                </Label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  placeholder="Enter semesters count"
                  className="flex h-9 col-span-3 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  name="no_of_sem_per_year"
                  id="no_of_sem_per_year"
                  onBlur={(e) => onSemCountChanged(e)}
                  onChange={(e) => onFormDataChanged(e)}
                  value={formData.no_of_sem_per_year || ""}
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
