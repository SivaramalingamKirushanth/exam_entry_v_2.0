import axiosInstance from "@/lib/axiosInstance";

export const getAllFaculties = async () => {
  const response = await axiosInstance.get("/course/getAllFaculties");
  return response.data;
};

export const getDepartmentsByFacultyId = async (f_id) => {
  const response = await axiosInstance.post(
    "/course/getDepartmentsByFacultyId",
    { f_id }
  );
  return response.data;
};
