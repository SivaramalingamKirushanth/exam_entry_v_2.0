import axiosInstance from "@/lib/axiosInstance";

export const getAllFaculties = async () => {
  const response = await axiosInstance.get("/course/getAllFaculties");
  return response.data;
};

export const createFaculty = async (data) => {
  const response = await axiosInstance.post("/course/createFaculty", data);
  return response.data;
};

export const updateFaculty = async (data) => {
  const response = await axiosInstance.put("/course/updateFaculty", data);
  return response.data;
};

export const getFacultyById = async (f_id) => {
  const response = await axiosInstance.post("/course/getFacultyById", { f_id });
  return response.data;
};

export const getDepartmentsByFacultyId = async (f_id) => {
  const response = await axiosInstance.post(
    "/course/getDepartmentsByFacultyId",
    { f_id }
  );
  return response.data;
};
