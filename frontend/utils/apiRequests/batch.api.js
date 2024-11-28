import axiosInstance from "@/lib/axiosInstance";

export const getAllBatches = async () => {
  const response = await axiosInstance.get("/batch/getAllBatches");
  return response.data;
};

export const getBatchById = async (batch_id) => {
  const response = await axiosInstance.post("/batch/getBatchById", {
    batch_id,
  });
  console.log(response.data);
  return response.data;
};

export const getStudentsByBatchId = async (batch_id) => {
  const response = await axiosInstance.post("/batch/getStudentsByBatchId", {
    batch_id,
  });
  return response.data;
};

export const createBatch = async (data) => {
  console.log("hiiioo");
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
