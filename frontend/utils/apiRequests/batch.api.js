import axiosInstance from "@/lib/axiosInstance";

export const getAllBatches = async () => {
  const response = await axiosInstance.get("/batch/getAllBatches");
  return response.data;
};

export const getBatchById = async (batch_id) => {
  const response = await axiosInstance.get("/batch/getBatchById", {
    batch_id,
  });
  return response.data;
};
