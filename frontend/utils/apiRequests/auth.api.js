import axiosInstance from "@/lib/axiosInstance";

export const managerRegister = async (data) => {
  const response = await axiosInstance.post("/auth/managerRegister", data);
  return response.data;
};

export const studentRegister = async (data) => {
  const response = await axiosInstance.post("/auth/studentRegister", data);
  return response.data;
};
