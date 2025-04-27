import axiosInstance from "@/lib/axiosInstance";

export const getAllSubjects = async () => {
  const response = await axiosInstance.get("/curriculum/getAllSubjects");
  return response.data;
};

export const getAllSubjectsWithExtraDetails = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getAllSubjectsWithExtraDetails"
  );
  return response.data;
};

export const getSubjectById = async (sub_id) => {
  const response = await axiosInstance.post("/curriculum/getSubjectById", {
    sub_id,
  });
  return response.data;
};

export const getSubjectByDegLevSem = async (deg_id, level, sem_no) => {
  const response = await axiosInstance.post(
    "/curriculum/getSubjectByDegLevSem",
    {
      deg_id,
      level,
      sem_no,
    }
  );
  return response.data;
};

export const getSubjectsByLecId = async () => {
  const response = await axiosInstance.get("/curriculum/getSubjectsByLecId");
  return response.data;
};
export const getSubjectsByHodId = async () => {
  const response = await axiosInstance.get("/curriculum/getSubjectsByHodId");
  return response.data;
};
export const createSubject = async (data) => {
  const response = await axiosInstance.post("/curriculum/createSubject", data);
  return response.data;
};

export const updateSubject = async (data) => {
  const response = await axiosInstance.put("/curriculum/updateSubject", data);
  return response.data;
};

export const updateSubjectStatus = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateSubjectStatus",
    data
  );
  return response.data;
};

export const getNoOfSubjects = async () => {
  const response = await axiosInstance.get("/curriculum/getNoOfSubjects");
  return response.data;
};

export const getSubjectBybatchId = async (batch_id) => {
  const response = await axiosInstance.post("/curriculum/getSubjectBybatchId", {
    batch_id,
  });
  return response.data;
};

export const getStudentApplicationDetails = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getStudentApplicationDetails"
  );
  return response.data;
};

export const checkSubjectExist = async (data) => {
  const response = await axiosInstance.post(
    "/curriculum/checkSubjectExist",
    data
  );
  return response.data;
};

export const getAllSubjectsForLecturer = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getAllSubjectsForLecturer"
  );
  return response.data;
};

export const getAllSubjectsForDepartment = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getAllSubjectsForDepartment"
  );
  return response.data;
};

export const getAllSubjectsForFaculty = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getAllSubjectsForFaculty"
  );
  return response.data;
};

export const updateEligibility = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateEligibility",
    data
  );
  return response.data;
};

export const updateMultipleEligibility = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateMultipleEligibility",
    data
  );
  return response.data;
};

export const createSyllabus = async (data) => {
  const response = await axiosInstance.post("/curriculum/createSyllabus", data);
  return response.data;
};
