import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

export const getAllBatches = async () => {
  const response = await axiosInstance.get("/batch/getAllBatches");
  return response.data;
};

export const getAllBatchDetails = async () => {
  const response = await axiosInstance.get("/batch/getAllBatchDetails");
  return response.data;
};

export const getBatchById = async (batch_id) => {
  const response = await axiosInstance.post("/batch/getBatchById", {
    batch_id,
  });
  return response.data;
};

export const getStudentsByBatchId = async (batch_id) => {
  const response = await axiosInstance.post("/batch/getStudentsByBatchId", {
    batch_id,
  });
  return response.data;
};

export const createBatch = async (data) => {
  const response = await axiosInstance.post("/batch/createBatch", data);
  return response.data;
};

export const addStudentsToTheBatchTable = async (data) => {
  const response = await axiosInstance.post(
    "/batch/addStudentsToTheBatchTable",
    data
  );
  return response.data;
};

export const updateBatch = async (data) => {
  const response = await axiosInstance.put("/batch/updateBatch", data);
  return response.data;
};

export const updateBatchStatus = async (data) => {
  const response = await axiosInstance.put("/batch/updateBatchStatus", data);
  return response.data;
};

export const getNoOfBatches = async () => {
  const response = await axiosInstance.get("/batch/getNoOfBatches");
  return response.data;
};

export const getBatchByFacultyId = async (f_id) => {
  const response = await axiosInstance.post("/batch/getBatchByFacultyId", {
    f_id,
  });
  return response.data;
};

export const getBatchesByStudent = async () => {
  const response = await axiosInstance.get("/batch/getBatchesByStudent");
  return response.data;
};

export const setBatchTimePeriod = async (data) => {
  const response = await axiosInstance.put("/batch/setBatchTimePeriod", data);
  return response.data;
};

export const getBatchTimePeriod = async (batch_id) => {
  const response = await axiosInstance.post("/batch/getBatchTimePeriod", {
    batch_id,
  });
  return response.data;
};

export const getNonBatchStudents = async (batch_id) => {
  const response = await axiosInstance.post("/batch/getNonBatchStudents", {
    batch_id,
  });
  return response.data;
};

export const getBatchFullDetails = async (batch_id) => {
  const response = await axiosInstance.post("/batch/getBatchFullDetails", {
    batch_id,
  });
  return response.data;
};

export const uploadAttendanceSheet = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api1/batch/uploadAttendanceSheet",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        responseType: "blob", // Handle file responses
      }
    );

    const contentType = response.headers["content-type"];
    if (contentType.includes("application/json")) {
      // Handle JSON response
      const responseData = JSON.parse(await response.data.text());
      return { message: responseData.message, isFile: false };
    } else if (contentType.includes("text/plain")) {
      // Handle file response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "failed_records.txt"); // File name for download
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { message: "Failed records file downloaded.", isFile: true };
    }

    throw new Error("Unexpected response type");
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
};
