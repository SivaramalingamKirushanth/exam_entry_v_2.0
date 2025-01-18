import axiosInstance from "@/lib/axiosInstance";

export const getAllCurriculums = async () => {
  try {
    const response = await axiosInstance.get("/curriculum/getAllCurriculums");
    return response.data;
  } catch (error) {
    console.error("Error fetching all curriculums:", error);
    throw error;
  }
};

export const getAllCurriculumsWithExtraDetails = async () => {
  try {
    const response = await axiosInstance.get(
      "/curriculum/getAllCurriculumsWithExtraDetails"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching curriculums with extra details:", error);
    throw error;
  }
};

export const getCurriculumById = async (sub_id) => {
  try {
    const response = await axiosInstance.post("/curriculum/getCurriculumById", {
      sub_id,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching curriculum by ID (${sub_id}):`, error);
    throw error;
  }
};

export const getCurriculumByDegLevSem = async (deg_id, level, sem_no) => {
  try {
    const response = await axiosInstance.post(
      "/curriculum/getCurriculumByDegLevSem",
      {
        deg_id,
        level,
        sem_no,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching curriculum by degree (${deg_id}), level (${level}), semester (${sem_no}):`,
      error
    );
    throw error;
  }
};

export const getCurriculumsByLecId = async () => {
  try {
    const response = await axiosInstance.get(
      "/curriculum/getCurriculumsByLecId"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching curriculums by lecturer ID:", error);
    throw error;
  }
};

export const getCurriculumsByHodId = async () => {
  try {
    const response = await axiosInstance.get(
      "/curriculum/getCurriculumsByHodId"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching curriculums by HOD ID:", error);
    throw error;
  }
};

export const createCurriculum = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/curriculum/createCurriculum",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating curriculum:", error);
    throw error;
  }
};

export const updateCurriculum = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/curriculum/updateCurriculum",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating curriculum:", error);
    throw error;
  }
};

export const updateCurriculumStatus = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/curriculum/updateCurriculumStatus",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating curriculum status:", error);
    throw error;
  }
};

export const getNoOfCurriculums = async () => {
  try {
    const response = await axiosInstance.get("/curriculum/getNoOfCurriculums");
    return response.data;
  } catch (error) {
    console.error("Error fetching number of curriculums:", error);
    throw error;
  }
};

export const getCurriculumBybatchId = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/curriculum/getCurriculumBybatchId",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching curriculum by batch ID (${batch_id}):`,
      error
    );
    throw error;
  }
};

export const getStudentApplicationDetails = async () => {
  try {
    const response = await axiosInstance.get(
      "/curriculum/getStudentApplicationDetails"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student application details:", error);
    throw error;
  }
};

export const getAllSubjectsForManager = async () => {
  try {
    const response = await axiosInstance.get(
      "/curriculum/getAllSubjectsForManager"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subjects for manager:", error);
    throw error;
  }
};

export const getAppliedStudentsForSubject = async (batch_id, sub_id) => {
  try {
    const response = await axiosInstance.post(
      "/curriculum/getAppliedStudentsForSubject",
      { batch_id, sub_id }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching applied students for subject (Batch ID: ${batch_id}, Subject ID: ${sub_id}):`,
      error
    );
    throw error;
  }
};

export const updateEligibility = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/curriculum/updateEligibility",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating eligibility:", error);
    throw error;
  }
};
