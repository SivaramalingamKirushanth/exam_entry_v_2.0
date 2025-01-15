import axiosInstance from "@/lib/axiosInstance";

export const applyExam = async () => {
  const response = await axiosInstance.put("/entry/applyExam");
  return response.data;
};

export const getStudentSubjects = async (batch_id, s_id) => {
  const response = await axiosInstance.post("/entry/getStudentSubjects", {
    batch_id,
    s_id,
  });
  return response.data;
};

export const addMedicalResitStudents = async (data) => {
  const response = await axiosInstance.post(
    "/entry/addMedicalResitStudents",
    data
  );
  return response.data;
};

export const getStudentsWithoutIndexNumber = async (batch_id) => {
  console.log(batch_id);
  const response = await axiosInstance.post(
    "/entry/getStudentsWithoutIndexNumber",
    {
      batch_id,
    }
  );
  console.log(response.data);
  return response.data;
};

export const generateIndexNumbers = async (data) => {
  const response = await axiosInstance.post(
    "/entry/generateIndexNumbers",
    data
  );
  return response.data;
};

export const getLastAssignedIndexNumber = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getLastAssignedIndexNumber",
    data
  );
  return response.data;
};

export const createOrUpdateAdmission = async (data) => {
  const response = await axiosInstance.post(
    "/entry/createOrUpdateAdmission",
    data
  );
  return response.data;
};

export const getLatestAdmissionTemplate = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/getLatestAdmissionTemplate",
    { batch_id }
  );
  return response.data;
};

export const fetchStudentsWithSubjects = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/fetchStudentsWithSubjects",
    { batch_id }
  );
  return response.data;
};

export const getBatchAdmissionDetails = async (batch_id) => {
  const response = await axiosInstance.post("/entry/getBatchAdmissionDetails", {
    batch_id,
  });
  return response.data;
};

export const fetchStudentWithSubjectsByUserId = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/fetchStudentWithSubjectsByUserId",
    {
      batch_id,
    }
  );
  return response.data;
};

export const getEligibleStudentsBySub = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getEligibleStudentsBySub",
    data
  );
  return response.data;
};

export const createOrUpdateAttendance = async (data) => {
  const response = await axiosInstance.post(
    "/entry/createOrUpdateAttendance",
    data
  );
  return response.data;
};

export const getLatestAttendanceTemplate = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/getLatestAttendanceTemplate",
    { batch_id }
  );
  return response.data;
};
