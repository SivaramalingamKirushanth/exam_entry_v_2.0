import axiosInstance from "@/lib/axiosInstance";

export const getAllLecturers = async () => {
  const response = await axiosInstance.get("/user/getAllLecturers");
  return response.data;
};

export const getAllActiveLecturers = async () => {
  const response = await axiosInstance.get("/user/getAllActiveLecturers");
  return response.data;
};

export const getAllStudents = async () => {
  const response = await axiosInstance.get("/user/getAllStudents");
  return response.data;
};

export const getLecturerById = async (user_id) => {
  const response = await axiosInstance.post("/user/getLecturerById", {
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

export const getFacStudentByBatchId = async (batch_id) => {
  const response = await axiosInstance.post("/user/getFacStudentByBatchId", {
    batch_id,
  });
  return response.data;
};

export const updateLecturer = async (data) => {
  const response = await axiosInstance.put("/user/updateLecturer", data);
  return response.data;
};

export const updateLecturerStatus = async (data) => {
  const response = await axiosInstance.put("/user/updateLecturerStatus", data);
  return response.data;
};

export const updateStudent = async (data) => {
  const response = await axiosInstance.put("/user/updateStudent", data);
  return response.data;
};

export const updateStudentStatus = async (data) => {
  const response = await axiosInstance.put("/user/updateStudentStatus", data);
  return response.data;
};

export const getNoOfLecturers = async () => {
  const response = await axiosInstance.get("/user/getNoOfLecturers");
  return response.data;
};

export const getNoOfStudents = async () => {
  const response = await axiosInstance.get("/user/getNoOfStudents");
  return response.data;
};

export const getSummaryData = async () => {
  const response = await axiosInstance.get("/user/getSummaryData");
  return response.data;
};

export const getVenues = async () => {
  const response = await axiosInstance.get("/user/getVenues");
  return response.data;
};

export const createVenue = async (data) => {
  const response = await axiosInstance.post("/user/createVenue", data);
  return response.data;
};

export const updateVenue = async (data) => {
  const response = await axiosInstance.put("/user/updateVenue", data);
  return response.data;
};

export const getVenueById = async (data) => {
  const response = await axiosInstance.post("/user/getVenueById", data);
  return response.data;
};
