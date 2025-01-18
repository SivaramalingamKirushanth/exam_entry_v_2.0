import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

const handleRequest = async (requestFn, errorMessage) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch {
    throw new Error(errorMessage);
  }
};

export const getAllBatches = async () => {
  return handleRequest(
    () => axiosInstance.get("/batch/getAllBatches"),
    "Failed to fetch batches."
  );
};

export const getAllBatchDetails = async () => {
  return handleRequest(
    () => axiosInstance.get("/batch/getAllBatchDetails"),
    "Failed to fetch batch details."
  );
};

export const getBatchById = async (batch_id) => {
  return handleRequest(
    () =>
      axiosInstance.post("/batch/getBatchById", {
        batch_id,
      }),
    "Failed to fetch batch by ID."
  );
};

export const getStudentsByBatchId = async (batch_id) => {
  return handleRequest(
    () =>
      axiosInstance.post("/batch/getStudentsByBatchId", {
        batch_id,
      }),
    "Failed to fetch students by batch ID."
  );
};

export const createBatch = async (data) => {
  return handleRequest(
    () => axiosInstance.post("/batch/createBatch", data),
    "Failed to create batch."
  );
};

export const addStudentsToTheBatchTable = async (data) => {
  return handleRequest(
    () => axiosInstance.post("/batch/addStudentsToTheBatchTable", data),
    "Failed to add students to the batch."
  );
};

export const updateBatch = async (data) => {
  return handleRequest(
    () => axiosInstance.put("/batch/updateBatch", data),
    "Failed to update batch."
  );
};

export const updateBatchStatus = async (data) => {
  return handleRequest(
    () => axiosInstance.put("/batch/updateBatchStatus", data),
    "Failed to update batch status."
  );
};

export const getNoOfBatches = async () => {
  return handleRequest(
    () => axiosInstance.get("/batch/getNoOfBatches"),
    "Failed to fetch the number of batches."
  );
};

export const getBatchByFacultyId = async (f_id) => {
  return handleRequest(
    () =>
      axiosInstance.post("/batch/getBatchByFacultyId", {
        f_id,
      }),
    "Failed to fetch batches by faculty ID."
  );
};

export const getBatchesByStudent = async () => {
  return handleRequest(
    () => axiosInstance.get("/batch/getBatchesByStudent"),
    "Failed to fetch batches for the student."
  );
};

export const setBatchTimePeriod = async (data) => {
  return handleRequest(
    () => axiosInstance.put("/batch/setBatchTimePeriod", data),
    "Failed to set batch time period."
  );
};

export const getBatchTimePeriod = async (batch_id) => {
  return handleRequest(
    () =>
      axiosInstance.post("/batch/getBatchTimePeriod", {
        batch_id,
      }),
    "Failed to fetch batch time period."
  );
};

export const getNonBatchStudents = async (batch_id) => {
  return handleRequest(
    () =>
      axiosInstance.post("/batch/getNonBatchStudents", {
        batch_id,
      }),
    "Failed to fetch non-batch students."
  );
};

export const getBatchFullDetails = async (batch_id) => {
  return handleRequest(
    () =>
      axiosInstance.post("/batch/getBatchFullDetails", {
        batch_id,
      }),
    "Failed to fetch batch full details."
  );
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
      const responseData = JSON.parse(await response.data.text());
      return { message: responseData.message, isFile: false };
    } else if (contentType.includes("text/plain")) {
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
  } catch {
    throw new Error("Failed to upload attendance sheet.");
  }
};
