"use client";

import { Button } from "@/components/ui/button";
import { getBatchFullDetails } from "@/utils/apiRequests/batch.api";
import {
  getDynamicBatchTablesData,
  getSummarySubjectsData,
} from "@/utils/apiRequests/entry.api";
import { numberToOrdinalWord } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

let months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

const SummaryExcelGenerator = ({ batch_id }) => {
  const [examTitle, setExamTitle] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: subjectsData } = useQuery({
    queryFn: () => getSummarySubjectsData({ batch_id }),
    queryKey: ["batch", "subjects"],
  });

  const { data: dynamicBatchTablesData } = useQuery({
    queryFn: () => getDynamicBatchTablesData({ batch_id }),
    queryKey: ["batch", "dynamic", "students"],
  });

  const { data: BatchFullDetails } = useQuery({
    queryFn: () => getBatchFullDetails(batch_id),
    queryKey: ["batchfulldetails", batch_id],
  });

  useEffect(() => {
    if (subjectsData && dynamicBatchTablesData) {
      const subjects = [...subjectsData].map((obj) => ({
        sub_id: obj.sub_id,
        code: obj.sub_code,
        name: obj.sub_name,
        numGroups: obj.no_of_groups,
        venue: obj.venues,
        date: obj.dates,
        time: obj.times,
        totalCandidates: 0,
        properCandidates: 0,
        medicalCandidates: 0,
        resitCandidates: 0,
      }));
      const students = dynamicBatchTablesData.map((stuObj, i) => {
        const obj = {
          no: i + 1,
          regNo: stuObj.user_name,
          indexNo: stuObj.index_num,
          name: stuObj.name,
          subjects: {},
        };

        subjects.forEach((subObj) => {
          let exam_type = stuObj[`sub_${subObj.sub_id}_exam_type`];
          let eligibility = stuObj[`sub_${subObj.sub_id}_eligibility`];

          obj.subjects[subObj.code] =
            eligibility == "true"
              ? exam_type
              : eligibility == "false"
              ? "X"
              : "-";

          const subInd = subjects.findIndex(
            (obj) => obj.sub_id == subObj.sub_id
          );

          if (subInd > -1) {
            if (eligibility == "true") {
              subjects[subInd].totalCandidates += 1;

              if (exam_type == "P") {
                subjects[subInd].properCandidates += 1;
              }
              if (exam_type == "M") {
                subjects[subInd].medicalCandidates += 1;
              }
              if (exam_type == "R") {
                subjects[subInd].resitCandidates += 1;
              }
            }
          }
        });

        return obj;
      });

      setStudents(students);
      setSubjects(subjects);
    }
  }, [subjectsData, dynamicBatchTablesData]);

  useEffect(() => {
    if (BatchFullDetails) {
      const level_ordinal = numberToOrdinalWord(BatchFullDetails.level);
      const sem_ordinal = numberToOrdinalWord(BatchFullDetails.sem);
      const transformedDate = BatchFullDetails.exam_date
        ?.split(",")
        .map((item) => {
          const [year, months] = item.split(":");
          return {
            year: parseInt(year),
            months: months.split(";"),
          };
        });
      setExamTitle(
        `${level_ordinal} examination in ${BatchFullDetails.course_title} - ${
          BatchFullDetails.academic_year
        } - ${sem_ordinal} semester - ${transformedDate?.map((obj, ind) =>
          ind
            ? " ," +
              obj.months
                .map((month, index) =>
                  index ? `/${months[month]}` : `${months[month]}`
                )
                .join("") +
              " " +
              obj.year
            : obj.months
                .map((month, index) =>
                  index ? `/${months[month]}` : `${months[month]}`
                )
                .join("") +
              " " +
              obj.year
        )}`.toUpperCase()
      );
    }
  }, [BatchFullDetails]);

  const generateExcel = () => {
    setLoading(true);

    if (BatchFullDetails && subjectsData && dynamicBatchTablesData) {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Calculate total number of columns based on subjects
      const totalColumns = 4 + subjects.length + 2; // 4 initial cols + subjects + 2 final cols

      // Initialize the data array with the header rows
      const data = [
        [
          `${examTitle}`,
          ...Array(totalColumns - 1).fill(""), // Fill the rest with empty strings
        ],
        [
          "",
          "",
          "",
          "Number of Groups",
          ...subjects.map((s) => s.numGroups),
          "",
          "",
        ],
        ["", "", "", "Venue(s)", ...subjects.map((s) => s.venue), "", ""],
        ["", "", "", "Date(s)", ...subjects.map((s) => s.date), "", ""],
        ["", "", "", "Time(s)", ...subjects.map((s) => s.time), "", ""],
        [
          "",
          "",
          "",
          "Total Candidates",
          ...subjects.map((s) => s.totalCandidates),
          "",
          "",
        ],
        ["No", "Reg.No.", "Index No", "Name", ...subjects.map((s) => s.name)],
        ["", "", "", "", ...subjects.map((s) => s.code)],
      ];

      // Add student rows
      students.forEach((student) => {
        const row = [student.no, student.regNo, student.indexNo, student.name];

        // Add subject attendance for each student
        subjects.forEach((subject) => {
          row.push(student.subjects[subject.code] || "");
        });

        data.push(row);
      });

      // Add summary rows
      data.push([
        "No. of Proper Candidate",
        "",
        "",
        "",
        ...subjects.map((s) => s.properCandidates),
      ]);

      data.push([
        "No. of Proper Candidate (MC)",
        "",
        "",
        "",
        ...subjects.map((s) => s.medicalCandidates),
      ]);

      data.push([
        "No. of Re-sit Candidate",
        "",
        "",
        "",
        ...subjects.map((s) => s.resitCandidates),
      ]);

      data.push([
        "Total",
        "",
        "",
        "",
        ...subjects.map((s) => s.totalCandidates),
      ]);

      // Add legend
      data.push([
        "",
        "",
        "",
        "",
        "P",
        "Proper",
        "",
        "M",
        "Proper (MC)",
        "",
        "R",
        "Re-sit",
        "",
        "X",
        "Not allowed to sit the exam",
      ]);

      // Create worksheet from data
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set column widths
      const cols = [
        { wch: 5 }, // no
        { wch: 15 }, // Reg.No.
        { wch: 12 }, // Index No
        { wch: 30 }, // Name
        // Set width for subject columns and final two columns
        ...Array(subjects.length + 2).fill({ wch: 15 }),
      ];
      ws["!cols"] = cols;

      // Apply styling (merge cells, center align title, add borders)
      // Title cell merging
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns - 1 } }, // Title row spans all columns
        {
          s: { r: students.length + 8, c: 0 },
          e: { r: students.length + 8, c: 3 },
        },
        {
          s: { r: students.length + 9, c: 0 },
          e: { r: students.length + 9, c: 3 },
        },
        {
          s: { r: students.length + 10, c: 0 },
          e: { r: students.length + 10, c: 3 },
        },
        {
          s: { r: students.length + 11, c: 0 },
          e: { r: students.length + 11, c: 3 },
        },
      ];

      // Apply borders and center alignment to all cells
      for (let R = 0; R < data.length; R++) {
        for (let C = 0; C < totalColumns; C++) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) ws[cellRef] = { v: "" };

          // Add cell styling
          if (!ws[cellRef].s) ws[cellRef].s = {};

          // Add borders to all cells
          ws[cellRef].s.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };

          // Center align the title
          if (R === 0) {
            ws[cellRef].s.alignment = {
              horizontal: "center",
              vertical: "center",
            };
            // Also make the title bold
            ws[cellRef].s.font = { bold: true };
          }

          // Center align header rows
          if (R < 8) {
            if (!ws[cellRef].s.alignment) {
              ws[cellRef].s.alignment = {
                horizontal: "center",
                vertical: "center",
              };
            }
          }
        }
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Examination Summary");

      // Generate Excel file
      XLSX.writeFile(
        wb,
        `Examination_Summary_${BatchFullDetails?.batch_code}.xlsx`
      );
    }

    setLoading(false);
  };

  return (
    <Button onClick={generateExcel} variant="outline">
      {loading ? "Downloading.." : "Download Summary"}
    </Button>
  );
};

export default SummaryExcelGenerator;
