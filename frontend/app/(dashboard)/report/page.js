"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examInfo, setExamInfo] = useState({
    title: "Third Examination in Information Technology- 2023",
    semester: "First Semester - January/February 2025",
  });

  // State to hold subject information
  const [subjects, setSubjects] = useState([
    {
      code: "IT 3113 T",
      name: "Knowledge Based Systems and Logic Programming",
      numGroups: 1,
      venue: "LH1/DBS",
      date: "15.02.2025",
      time: "1.00 pm - 3.00 pm",
      totalCandidates: 129,
    },

    // Add more subjects as needed
  ]);

  // This would be fetched from your database
  const fetchData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get("/api/examination-data");
      // Process the data
      // setExamInfo(response.data.examInfo);
      // setSubjects(response.data.subjects);
      // setStudents(response.data.students);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      setLoading(false);
    }
  };

  const generateExcel = () => {
    // Placeholder for actual student data - would be fetched from database
    // This is mocked data based on your CSV
    const students = [
      {
        run: 1,
        regNo: "2020/ICT/01",
        indexNo: "IT 16001",
        name: "Ms. Udisha W.H.I.",
        subjects: {
          "IT 3113 T": "P",
          "IT 3113 P": "P",
          "IT 3122": "P",
          "IT 3133 T": "P",
          "IT 3133 P": "P",
          "IT 3143 T": "P",
          "IT 3143 P": "P",
          "IT 3152": "P",
          "IT 3162": "P",
          "ACU 3112": "P",
        },
      },
    ];

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Calculate total number of columns based on subjects
    const totalColumns = 4 + subjects.length + 2; // 4 initial cols + subjects + 2 final cols

    // Initialize the data array with the header rows
    const data = [
      [
        `${examInfo.title} - ${examInfo.semester}`,
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
      const row = [student.run, student.regNo, student.indexNo, student.name];

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
      ...subjects.map(() => 105),
      105,
      105,
    ]);

    data.push([
      "No. of Proper Candidate (MC)",
      "",
      "",
      "",
      ...subjects.map(() => 0),
      0,
      0,
    ]);

    // For re-sit candidates, ensure we have the right number of columns
    const resitData = [24, 33, 6, 12, 1, 2, 2, 1, 0, 0];
    // Adjust if we have more or fewer subjects than the resit data
    const resitValues =
      subjects.length > resitData.length
        ? [...resitData, ...Array(subjects.length - resitData.length).fill(0)]
        : resitData.slice(0, subjects.length);

    data.push(["No. of Re-sit Candidate", "", "", "", ...resitValues, 0, 0]);

    data.push([
      "Total",
      "",
      "",
      "",
      ...subjects.map((s) => s.totalCandidates),
      105,
      105,
    ]);

    // Add legend
    data.push([
      "a",
      "Proper",
      "Ë",
      "Proper (MC)",
      "v",
      "",
      "Re-sit",
      "",
      "×",
      "Not allowed to sit the exam",
      "",
      "",
      "",
    ]);

    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    const cols = [
      { wch: 5 }, // Run
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
      `Examination_Summary_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="max-w-[800px] mx-auto p-5 font-sans">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
        Examination Summary Excel Generator
      </h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Examination Title:
          </label>
          <input
            type="text"
            value={examInfo.title}
            onChange={(e) =>
              setExamInfo({ ...examInfo, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Semester:
          </label>
          <input
            type="text"
            value={examInfo.semester}
            onChange={(e) =>
              setExamInfo({ ...examInfo, semester: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        {/* Add more input fields if needed */}

        <div className="flex gap-4 mt-6">
          <button
            onClick={fetchData}
            disabled={loading}
            className={`px-4 py-2 font-semibold text-white rounded transition 
            ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Loading..." : "Fetch Data"}
          </button>

          <button
            onClick={generateExcel}
            disabled={loading}
            className={`px-4 py-2 font-semibold text-white rounded transition 
            ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Generate Excel
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelGenerator;
