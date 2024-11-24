import axiosInstance from "@/lib/axiosInstance";

export const getAllCurriculums = async () => {
  const response = await axiosInstance.get("/curriculum/getAllCurriculums");
  return response.data;
};

export const getAllCurriculumsWithExtraDetails = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getAllCurriculumsWithExtraDetails"
  );
  return response.data;
};

export const getCurriculumById = async (sub_id) => {
  const response = await axiosInstance.post("/curriculum/getCurriculumById", {
    sub_id,
  });
  return response.data;
};

export const getCurriculumByDegLevSem = async (deg_id, level, sem_no) => {
  console.log(deg_id, level, sem_no);
  const response = await axiosInstance.post(
    "/curriculum/getCurriculumByDegLevSem",
    {
      deg_id,
      level,
      sem_no,
    }
  );
  console.log(response.data);
  return response.data;
};

export const getCurriculumsByLecId = async () => {
  const response = await axiosInstance.get("/curriculum/getCurriculumsByLecId");
  return response.data;
};
export const getCurriculumsByHodId = async () => {
  const response = await axiosInstance.get("/curriculum/getCurriculumsByHodId");
  return response.data;
};
export const createCurriculum = async (data) => {
  const response = await axiosInstance.post(
    "/curriculum/createCurriculum",
    data
  );
  return response.data;
};
export const updateCurriculum = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateCurriculum",
    data
  );
  return response.data;
};
export const getNoOfCurriculums = async () => {
  const response = await axiosInstance.get("/curriculum/getNoOfCurriculums");
  return response.data;
};
