"use client";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
});

import React, { useEffect, useState } from "react";
import UoV_Logo from "./../images/UoV_Logo.png";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  getDayName,
  getModifiedDate,
  numberToOrdinalWord,
  parseString,
  sortByExamType,
  titleCase,
} from "@/utils/functions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CiCalendar as CalendarIcon } from "react-icons/ci";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaTimes } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function arrayPadEnd(array) {
  const arr = new Array(80 - array.length).fill(0);
  let final = [...array, ...arr];
  return final;
}

const makePagination = (sortedArray) => {
  let exam_type = "P";
  let grpArr = [];
  let pageArr = [];
  let pageArrInd = 0;
  for (let j = 0; j < sortedArray.length; j++) {
    if (sortedArray[j].exam_type != exam_type) {
      pageArr.push(sortedArray[j].exam_type);
      exam_type = sortedArray[j].exam_type;
      pageArrInd++;
    }

    pageArr.push(sortedArray[j]);

    if (pageArrInd == 79 || j == sortedArray.length - 1) {
      grpArr.push(pageArr);
      pageArr = [];
      pageArrInd = 0;
    } else {
      pageArrInd++;
    }

    if (j == sortedArray.length - 1) {
      break;
    }
  }
  return grpArr;
};

const AttendanceSheetTemplate = ({
  setFormData,
  formData,
  batchFullDetailsData,
  latestAdmissionTemplateData,
  batchCurriculumData,
  level_ordinal,
  sem_ordinal,
  decodeBatchCode,
  subjectObject,
  sub_name,
  sub_code,
  pageArr,
  pageNo,
  groupNo,
  totalPages,
  totalGroups,
  setFinalNameList,
  finalNameList,
}) => {
  const [splittedArray, setSplittedArray] = useState([]);

  const onGroupMoved = (from, to, s_id) => {
    let fromGroup = [...finalNameList[from]].flat();
    let toGroup = [...finalNameList[to]].flat();

    let ele = fromGroup.find((obj) => obj.s_id == s_id);
    let eleInd = fromGroup.findIndex((obj) => obj.s_id == s_id);
    if (eleInd >= 0) {
      fromGroup.splice(eleInd, 1);
    }

    let exist = toGroup.some((obj) => obj.s_id == s_id);
    if (!exist && ele) {
      toGroup.push(ele);
    }

    let sortedFromGroup = sortByExamType(fromGroup);
    let sortedToGroup = sortByExamType(toGroup);

    let finalFromGroup = makePagination(sortedFromGroup);
    let finalToGroup = makePagination(sortedToGroup);

    setFinalNameList((cur) => ({
      ...cur,
      [from]: finalFromGroup,
      [to]: finalToGroup,
    }));
  };

  const handleMonthChange = (month, yearIndex, monthIndex) => {
    setFormData((cur) => {
      const updatedDates = [...cur.date];
      updatedDates[yearIndex].months[monthIndex] = month;
      return { ...cur, date: updatedDates };
    });
  };

  const addNewMonth = (yearIndex) => {
    const monthsLength = formData?.date[yearIndex]?.months?.length;
    setFormData((cur) => {
      const updatedDates = [...cur.date];

      if (
        updatedDates[yearIndex]?.months &&
        updatedDates[yearIndex]?.months.length < monthsLength + 1
      ) {
        let lastItem =
          updatedDates[yearIndex].months[
            updatedDates[yearIndex].months.length - 1
          ];
        updatedDates[yearIndex].months.push(lastItem == 11 ? 0 : +lastItem + 1);
      }
      return { ...cur, date: updatedDates };
    });
  };

  const handleYearChange = (e, yearIndex) => {
    const year = e.target.value;
    setFormData((cur) => {
      const updatedDates = [...cur.date];
      updatedDates[yearIndex].year = year;
      return { ...cur, date: updatedDates };
    });
  };

  const addNewYearBlock = () => {
    setFormData((cur) => {
      let lastYear = cur.date[cur.date.length - 1].year;

      return {
        ...cur,
        date: [...cur.date, { year: +lastYear + 1, months: [0] }],
      };
    });
  };

  const removeYearBlock = (yearIndex) => {
    setFormData((cur) => {
      const updatedDates = [...cur.date];
      updatedDates.splice(yearIndex, 1);
      return { ...cur, date: updatedDates };
    });
  };

  const removeMonth = (yearIndex, monthIndex) => {
    setFormData((cur) => {
      const updatedDates = [...cur.date];
      updatedDates[yearIndex].months.splice(monthIndex, 1);
      return { ...cur, date: updatedDates };
    });
  };

  const onYearBlured = (e, yearIndex) => {
    let value = +e.target.value;
    if (value < +e.target.min) {
      value = +e.target.min;
    } else if (value > +e.target.max) {
      value = +e.target.max;
    }

    setFormData((cur) => {
      const updatedDates = [...cur.date];
      updatedDates[yearIndex].year = value;
      return { ...cur, date: updatedDates };
    });
    e.target.value = value;
  };

  useEffect(() => {
    if (latestAdmissionTemplateData) {
      console.log(latestAdmissionTemplateData);
      let obj = {};
      if (latestAdmissionTemplateData.exist) {
        obj.generated_date = latestAdmissionTemplateData?.data?.generated_date;
        obj.date = latestAdmissionTemplateData?.data?.exam_date;
        obj.description = latestAdmissionTemplateData?.data?.description;
        obj.instructions = latestAdmissionTemplateData?.data?.instructions;
        obj.provider = latestAdmissionTemplateData?.data?.provider;

        const transformedSubjects =
          latestAdmissionTemplateData?.data?.subject_list
            ?.split(",")
            .map((comSubs) => comSubs.split(":"));
        const transformedDate = latestAdmissionTemplateData?.data?.exam_date
          ?.split(",")
          .map((item) => {
            const [year, months] = item.split(":");
            return {
              year: parseInt(year),
              months: months.split(";").map((mon) => +mon),
            };
          });

        obj.subjects = transformedSubjects;
        obj.date = transformedDate;
      } else {
        obj.description = latestAdmissionTemplateData?.data?.description;
        obj.instructions = latestAdmissionTemplateData?.data?.instructions;
        obj.provider = latestAdmissionTemplateData?.data?.provider;
      }

      setFormData((cur) => ({
        ...cur,
        ...obj,
      }));
    }
  }, [latestAdmissionTemplateData]);

  useEffect(() => {
    if (pageArr.length) {
      console.log(pageArr);
      let arr = arrayPadEnd(pageArr);

      let final = [
        arr.slice(0, 16),
        arr.slice(16, 32),
        arr.slice(32, 48),
        arr.slice(48, 64),
        arr.slice(64),
      ];

      setSplittedArray(final);
    }
  }, [pageArr]);

  useEffect(() => {
    console.log(splittedArray);
  }, [splittedArray]);

  return (
    <div className="border-2 border-black p-8 max-w-4xl mx-auto font-serif bg-white mb-2">
      {/* <div className="text-center mb-4"> */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex">
          Page : {pageNo} of {totalPages}
        </div>
        <div className="flex items-center">
          <span>Hall&nbsp;No&nbsp;:&nbsp;</span>
          <Input />
        </div>
      </div>
      <h1 className="font-bold text-lg uppercase text-center mb-2">
        University of Vavuniya
      </h1>
      <div className="flex mb-1">
        <div className="w-36 flex justify-between shrink-0">
          Examination <span>:&nbsp;</span>
        </div>
        <div className="flex flex-wrap">
          {titleCase(
            `${level_ordinal} examination in ${batchFullDetailsData?.deg_name} - ${decodeBatchCode.academic_year} -${sem_ordinal} semester -`
          )}
          <div className="flex space-x-2 items-center flex-wrap">
            {" "}
            {formData.date?.map((yearBlock, yearIndex) => (
              <React.Fragment key={yearIndex}>
                <span>
                  {formData.date?.length > 1 && (yearIndex || "") && ","}
                </span>
                <div key={yearIndex} className="flex space-x-3">
                  <div className="flex items-center space-x-2">
                    {yearBlock.months?.map((month, monthIndex) => (
                      <div
                        key={monthIndex}
                        className="flex items-center space-x-1"
                      >
                        {yearBlock.months?.length > 1 && (monthIndex || "") && (
                          <span> &#47;</span>
                        )}
                        <Select
                          onValueChange={(selectedMonth) =>
                            handleMonthChange(
                              selectedMonth,
                              yearIndex,
                              monthIndex
                            )
                          }
                          value={month}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Months</SelectLabel>
                              {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December",
                              ].map((m, i) => (
                                <SelectItem key={i} value={i}>
                                  {m}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        {yearBlock.months.length > 1 && (monthIndex || "") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMonth(yearIndex, monthIndex)}
                            className="text-red-500 text-xs rounded-full size-6 p-0"
                          >
                            <FaTimes />
                          </Button>
                        )}
                      </div>
                    ))}

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() => addNewMonth(yearIndex)}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 text-xs rounded-full size-6 p-0"
                        >
                          <FaPlus />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add a month</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={new Date().getFullYear()}
                      max="2100"
                      placeholder="Year"
                      className="w-20 rounded-md border px-2 py-1 text-sm h-8"
                      value={yearBlock.year}
                      onChange={(e) => handleYearChange(e, yearIndex)}
                      onBlur={(e) => onYearBlured(e, yearIndex)}
                      autoFocus={true}
                    />

                    {yearIndex ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeYearBlock(yearIndex)}
                        className="text-red-500 text-xs rounded-full size-6 p-0"
                      >
                        <FaTimes />
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={addNewYearBlock}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 text-xs rounded-full size-6 p-0"
                >
                  <FaPlus />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a month of another year</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex mb-1">
        <div className="w-36 flex justify-between shrink-0">
          Subject <span>:&nbsp;</span>
        </div>
        <div>{sub_name}</div>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex">
            <div className="w-36 flex justify-between shrink-0">
              Course unit no <span>:&nbsp;</span>
            </div>
            <div>{sub_code}</div>
          </div>
          <div className="flex items-center">
            <div className="w-36 flex justify-between shrink-0">
              Center <span>:&nbsp;</span>
            </div>
            <Input />
          </div>
          <div className="flex">
            <div className="w-36 flex justify-between shrink-0">
              Group no <span>:&nbsp;</span>
            </div>
            <div>
              {groupNo} of {totalGroups}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <div className="w-36 flex justify-between shrink-0">
              Date <span>:&nbsp;</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-between text-left font-normal",
                    !formData.generated_date && "text-muted-foreground"
                  )}
                >
                  {formData.generated_date || <span>Pick a date</span>}{" "}
                  <CalendarIcon className="mr-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.generated_date}
                  onSelect={(e) =>
                    setFormData((cur) => ({
                      ...cur,
                      generated_date: `${getModifiedDate(e)} (${getDayName(
                        e
                      )})`,
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center">
            <div className="w-36 flex justify-between shrink-0">
              Time <span>:&nbsp;</span>
            </div>
            <Input />
          </div>
          <div className="flex">
            <div className="w-36 flex justify-between shrink-0">
              Students count <span>:&nbsp;</span>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-lg mt-1 uppercase text-center">
        attendance list
      </h3>
      {/* </div> */}

      <RichTextEditor
        setFormData={setFormData}
        text={formData.description}
        element="description"
        height="110px"
        width="100%"
      />
      <div className="flex">
        <table className="w-1/5 border-collapse border border-black text-sm mb-2">
          <thead>
            <tr>
              <th className="border border-black px-1 py-3">Index no</th>
              <th className="border border-black px-1 py-3 text-xs">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {splittedArray[0]?.map((obj) => (
              <tr className="h-12">
                <td className="border border-black">
                  {obj ? (
                    typeof obj == "string" ? (
                      obj == "R" ? (
                        <h1 className="font-semibold text-center">Resit</h1>
                      ) : (
                        <h1 className="font-semibold text-center">Medical</h1>
                      )
                    ) : (
                      <h1 className="text-center">{obj.index_num}</h1>
                    )
                  ) : (
                    ""
                  )}
                </td>
                <td className="border border-black ">
                  <h1 className="text-center">
                    {" "}
                    {obj && typeof obj != "string" && totalGroups > 1 ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Move to</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Groups</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            onValueChange={(to) =>
                              onGroupMoved(groupNo, to, obj.s_id)
                            }
                          >
                            {new Array(totalGroups)
                              .fill(0)
                              .map((_, i) => i + 1)
                              .filter((ele) => ele != groupNo)
                              .map((ele) => (
                                <DropdownMenuRadioItem value={ele}>
                                  {ele}
                                </DropdownMenuRadioItem>
                              ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      ""
                    )}
                  </h1>
                </td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
        <table className="w-1/5 border-collapse border border-black text-sm mb-2">
          <thead>
            <tr>
              <th className="border border-black px-1 py-3">Index no</th>
              <th className="border border-black px-1 py-3 text-xs">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {splittedArray[1]?.map((obj) => (
              <tr className="h-12">
                <td className="border border-black">
                  {obj ? (
                    typeof obj == "string" ? (
                      obj == "R" ? (
                        <h1 className="font-semibold text-center">Resit</h1>
                      ) : (
                        <h1 className="font-semibold text-center">Medical</h1>
                      )
                    ) : (
                      <h1 className="text-center">{obj.index_num}</h1>
                    )
                  ) : (
                    ""
                  )}
                </td>
                <td className="border border-black"></td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
        <table className="w-1/5 border-collapse border border-black text-sm mb-2">
          <thead>
            <tr>
              <th className="border border-black px-1 py-3">Index no</th>
              <th className="border border-black px-1 py-3 text-xs">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {splittedArray[2]?.map((obj) => (
              <tr className="h-12">
                <td className="border border-black">
                  {obj ? (
                    typeof obj == "string" ? (
                      obj == "R" ? (
                        <h1 className="font-semibold text-center">Resit</h1>
                      ) : (
                        <h1 className="font-semibold text-center">Medical</h1>
                      )
                    ) : (
                      <h1 className="text-center">{obj.index_num}</h1>
                    )
                  ) : (
                    ""
                  )}
                </td>
                <td className="border border-black"></td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
        <table className="w-1/5 border-collapse border border-black text-sm mb-2">
          <thead>
            <tr>
              <th className="border border-black px-1 py-3">Index no</th>
              <th className="border border-black px-1 py-3 text-xs">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {splittedArray[3]?.map((obj) => (
              <tr className="h-12">
                <td className="border border-black">
                  {obj ? (
                    typeof obj == "string" ? (
                      obj == "R" ? (
                        <h1 className="font-semibold text-center">Resit</h1>
                      ) : (
                        <h1 className="font-semibold text-center">Medical</h1>
                      )
                    ) : (
                      <h1 className="text-center">{obj.index_num}</h1>
                    )
                  ) : (
                    ""
                  )}
                </td>
                <td className="border border-black"></td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
        <table className="w-1/5 border-collapse border border-black text-sm mb-2">
          <thead>
            <tr>
              <th className="border border-black px-1 py-3">Index no</th>
              <th className="border border-black px-1 py-3 text-xs">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {splittedArray[4]?.map((obj) => (
              <tr className="h-12">
                <td className="border border-black">
                  {obj ? (
                    typeof obj == "string" ? (
                      obj == "R" ? (
                        <h1 className="font-semibold text-center">Resit</h1>
                      ) : (
                        <h1 className="font-semibold text-center">Medical</h1>
                      )
                    ) : (
                      <h1 className="text-center">{obj.index_num}</h1>
                    )
                  ) : (
                    ""
                  )}
                </td>
                <td className="border border-black"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-end"></div>
    </div>
  );
};

export default AttendanceSheetTemplate;
