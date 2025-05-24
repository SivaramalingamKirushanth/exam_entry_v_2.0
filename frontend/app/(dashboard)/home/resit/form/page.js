"use client";

import { Button } from "@/components/ui/button";
import {
  getGrades,
  getStudentResitApplicationDetails,
} from "@/utils/apiRequests/curriculum.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaMinusCircle } from "react-icons/fa";

import ReactSelect from "react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyResitExam } from "@/utils/apiRequests/entry.api";
import { formatResitData } from "@/utils/functions";

const Form = (request) => {
  const router = useRouter();
  const [examName, setExamName] = useState(null);
  const deg = request.searchParams.deg;
  const batch = request.searchParams.batch;
  const queryClient = useQueryClient();
  const [subjectsArr, setSubjectArr] = useState([]);
  const [formData, setFormData] = useState({ subjects: [] });
  const [attemptsData, setAttemptsData] = useState({});

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

  const onSelectChange = (e) => {
    const valArr = e.split(":");
    const sub_id = valArr[0];
    const attempt = valArr[1];
    const result = valArr[2];
    setAttemptsData((cur) => ({
      ...cur,
      [sub_id]: {
        1: "",
        2: "",
        3: "",
        ...cur?.[sub_id],
        [attempt]: result,
      },
    }));
  };

  useEffect(() => {
    if (deg) {
      const degBytes = CryptoJS.AES.decrypt(deg, "uov");
      const originalDegData = JSON.parse(degBytes.toString(CryptoJS.enc.Utf8));
      setExamName(originalDegData);
    }
  }, [deg]);

  const {
    data: applicationData,
    error,
    isLoading,
  } = useQuery({
    queryFn: () => getStudentResitApplicationDetails(batch),
    queryKey: ["studentApplicationDetails", "resit"],
  });

  const {
    data: gradesData,
    isLoading: isGradesDataLoading,
    isError: isGradesDataError,
  } = useQuery({
    queryFn: getGrades,
    queryKey: ["grades"],
  });

  const { status, mutate } = useMutation({
    mutationFn: applyResitExam,
    onSuccess: (res) => {
      queryClient.invalidateQueries(["batchesOfStudent", "resit"]);
      toast.success(res.message);
      router.replace("/home/resit");
    },
    onError: (err) => {
      toast.error("Operation failed");
    },
  });

  const onSubmit = () => {
    const subjects_string = formatResitData(attemptsData);

    mutate({ subjects_string, batch_id: batch });
  };

  useEffect(() => {
    if (error) router.replace("/home/resit");
  }, [error]);

  useEffect(() => {
    if (applicationData?.subjects.length) {
      const modifiedArr = applicationData?.subjects.map((obj) => ({
        value: obj.sub_id,
        label: `${obj.sub_code} - ${obj.sub_name}`,
      }));
      setSubjectArr(modifiedArr);
    }
  }, [applicationData]);

  return (
    <>
      {applicationData && Object.keys(applicationData).length && (
        <div className="flex flex-col items-end md:items-center">
          <div className="md:w-[60%] w-full">
            <div className="text-center uppercase font-bold">
              <h1 className="font-extrabold tracking-wide sm:text-lg">
                Faculty of {applicationData?.f_name}
              </h1>
              <h1 className="text-sm sm:text-base">{examName}</h1>
            </div>
            <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row justify-between text-xs sm:text-sm font-semibold w-full px-2">
              <p>
                <span className="uppercase w-20 inline-block">Reg No</span>
                <span className="uppercase p-2 ">
                  {applicationData?.user_name}
                </span>
              </p>
              {applicationData?.index_num && (
                <p>
                  <span className="uppercase w-20 inline-block">Index No</span>
                  <span className="uppercase p-2">
                    {applicationData?.index_num}
                  </span>
                </p>
              )}
            </div>
            <div className="mt-0 sm:mt-3 flex text-xs sm:text-sm font-semibold  px-2">
              <p>
                <span className="uppercase w-20 inline-block">Name</span>
                <span className="uppercase p-2 ">{applicationData?.name}</span>
              </p>
            </div>
            <div className="w-full max-w-md mt-5 flex justify-center">
              <div className="w-[80%] ">
                <ReactSelect
                  value={formData.subjects}
                  onChange={handleChange}
                  options={subjectsArr}
                  isMulti
                  isClearable={false}
                  isDisabled={error || isLoading}
                  name="subjects"
                  placeholder={
                    error
                      ? "Not found"
                      : isLoading
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
                      fontSize: "0.9rem",
                      "&:hover": {
                        borderColor: "#000",
                      },
                    }),
                    menuList: () => ({
                      fontSize: "0.9rem",
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
              </div>
            </div>
          </div>
          <div className="md:w-[85%] w-full">
            <div className="my-5 sm:my-10 flex flex-col gap-2">
              {formData?.subjects.length ? (
                <div className="hidden sm:flex gap-2 items-center text-sm">
                  <div className="flex-1 flex flex-col sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg  items-center w-full">
                    <h1 className="uppercase w-full sm:w-[12.5%] shrink-0 text-center text-sm">
                      Subject Code
                    </h1>
                    <h1 className="uppercase w-full sm:w-1/2 shrink-0 text-center text-sm">
                      Subject Name
                    </h1>
                    <h1 className="uppercase w-full sm:w-[37.5%] shrink-0 text-center text-sm">
                      Result
                    </h1>
                  </div>
                  <h1>
                    <FaMinusCircle size={20} className="opacity-0" />
                  </h1>
                </div>
              ) : (
                <span></span>
              )}
              {applicationData?.subjects?.length &&
                formData?.subjects.map((obj, ind) => {
                  const sub_id = obj.value;
                  const subject = obj.label
                    .split("-")
                    .map((item) => item.trim());
                  return (
                    <div key={sub_id} className="flex gap-2 items-center">
                      <div className="flex-1 flex flex-col sm:flex-row px-3 py-2 sm:py-4 bg-white rounded-lg  items-center w-full">
                        <h1 className="uppercase w-full sm:w-[12.5%] shrink-0 text-center text-sm sm:text-base">
                          {subject[0]}
                        </h1>
                        <h1 className="capitalize w-full sm:w-1/2 shrink-0 text-center text-sm sm:text-base mb-2 sm:mb-0">
                          {subject[1]}
                        </h1>
                        {[
                          { no: 1, suffix: "st" },
                          { no: 2, suffix: "nd" },
                          { no: 3, suffix: "rd" },
                        ].map((attempt) => (
                          <h1
                            key={attempt.no}
                            className="capitalize w-full sm:w-[12.5%] mb-2 sm:mb-0 shrink-0 text-center text-sm sm:text-base"
                          >
                            <Select onValueChange={(e) => onSelectChange(e)}>
                              <SelectTrigger className="w-[90%]">
                                <SelectValue
                                  placeholder={`${attempt.no}${attempt.suffix} Try`}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value={`${sub_id}:${attempt.no}:`}
                                  className="text-center font-bold w-full"
                                >
                                  {attempt.no}
                                  {attempt.suffix} Try
                                </SelectItem>
                                {gradesData?.map((grdObj) => (
                                  <SelectItem
                                    key={
                                      "item" + attempt.no + "-grade" + grdObj.id
                                    }
                                    value={`${sub_id}:${attempt.no}:${grdObj.id}`}
                                  >
                                    {grdObj.grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </h1>
                        ))}
                      </div>
                      <h1>
                        <FaMinusCircle
                          onClick={() => {
                            const obj = { ...attemptsData };
                            delete obj[sub_id];
                            setAttemptsData(obj);
                            handleRemove(sub_id);
                          }}
                          size={20}
                          className="text-red-500 hover:text-red-600 cursor-pointer"
                        />
                      </h1>
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-center sm:justify-end">
              {Object.keys(applicationData).length &&
              Object.keys(attemptsData)?.length ? (
                <Button
                  onClick={onSubmit}
                  className="h-8 rounded-md px-3 text-xs sm:h-9 sm:px-4 sm:py-2"
                >
                  Submit
                </Button>
              ) : (
                <span></span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
