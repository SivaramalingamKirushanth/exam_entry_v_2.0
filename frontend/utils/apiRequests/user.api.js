import axiosInstance from "@/lib/axiosInstance";

export const getAllManagers = async () => {
  const response = await axiosInstance.get("/user/getAllManagers");
  console.log(response.data);
  return response.data;
};

export const getManagerById = async (user_id) => {
  const response = await axiosInstance.post("/user/getManagerById", {
    user_id,
  });
  return response.data;
};
