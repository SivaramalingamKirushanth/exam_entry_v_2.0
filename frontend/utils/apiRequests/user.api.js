import axiosInstance from "@/lib/axiosInstance";

export const getAllManagers = async () => {
  const response = await axiosInstance.get("/user/getAllManagers");
  return response.data;
};

export const getAllActiveManagers = async () => {
  const response = await axiosInstance.get("/user/getAllActiveManagers");
  return response.data;
};

export const getAllStudents = async () => {
  const response = await axiosInstance.get("/user/getAllStudents");
  return response.data;
};

export const getManagerById = async (user_id) => {
  const response = await axiosInstance.post("/user/getManagerById", {
    user_id,
  });
  return response.data;
};

export const getStudentById = async (user_id) => {
  const response = await axiosInstance.post("/user/getStudentById", {
    user_id,
  });
  return response.data;
};

export const updateManager = async (data) => {
  const response = await axiosInstance.put("/user/updateManager", data);
  return response.data;
};

export const updateStudent = async (data) => {
  const response = await axiosInstance.put("/user/updateStudent", data);
  return response.data;
};
