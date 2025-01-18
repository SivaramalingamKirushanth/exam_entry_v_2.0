import axiosInstance from "@/lib/axiosInstance";

export const applyExam = async () => {
  try {
    const response = await axiosInstance.put("/entry/applyExam");
    return response.data;
  } catch (error) {
    console.error("Error in applyExam:", error);
    throw error;
  }
};

export const getStudentSubjects = async (batch_id, s_id) => {
  try {
    const response = await axiosInstance.post("/entry/getStudentSubjects", {
      batch_id,
      s_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error in getStudentSubjects:", error);
    throw error;
  }
};

export const addMedicalResitStudents = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/entry/addMedicalResitStudents",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in addMedicalResitStudents:", error);
    throw error;
  }
};

export const getStudentsWithoutIndexNumber = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/entry/getStudentsWithoutIndexNumber",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getStudentsWithoutIndexNumber:", error);
    throw error;
  }
};

export const generateIndexNumbers = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/entry/generateIndexNumbers",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in generateIndexNumbers:", error);
    throw error;
  }
};

export const getLastAssignedIndexNumber = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/entry/getLastAssignedIndexNumber",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in getLastAssignedIndexNumber:", error);
    throw error;
  }
};

export const createOrUpdateAdmission = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/entry/createOrUpdateAdmission",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in createOrUpdateAdmission:", error);
    throw error;
  }
};

export const getLatestAdmissionTemplate = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/entry/getLatestAdmissionTemplate",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getLatestAdmissionTemplate:", error);
    throw error;
  }
};

export const fetchStudentsWithSubjects = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/entry/fetchStudentsWithSubjects",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchStudentsWithSubjects:", error);
    throw error;
  }
};

export const getBatchAdmissionDetails = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/entry/getBatchAdmissionDetails",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getBatchAdmissionDetails:", error);
    throw error;
  }
};

export const fetchStudentWithSubjectsByUserId = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/entry/fetchStudentWithSubjectsByUserId",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetchStudentWithSubjectsByUserId:", error);
    throw error;
  }
};

export const getEligibleStudentsBySub = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/entry/getEligibleStudentsBySub",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in getEligibleStudentsBySub:", error);
    throw error;
  }
};

export const createOrUpdateAttendance = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/entry/createOrUpdateAttendance",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error in createOrUpdateAttendance:", error);
    throw error;
  }
};

export const getLatestAttendanceTemplate = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/entry/getLatestAttendanceTemplate",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error in getLatestAttendanceTemplate:", error);
    throw error;
  }
};

export const deleteBatchSubjectEntries = async (batch_id) => {
  try {
    const response = await axiosInstance.post(
      "/entry/deleteBatchSubjectEntries",
      { batch_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleteBatchSubjectEntries:", error);
    throw error;
  }
};

export const getDeanDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/entry/getDeanDashboardData");
    return response.data;
  } catch (error) {
    console.error("Error in getDeanDashboardData:", error);
    throw error;
  }
};

export const getHodDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/entry/getHodDashboardData");
    return response.data;
  } catch (error) {
    console.error("Error in getHodDashboardData:", error);
    throw error;
  }
};
