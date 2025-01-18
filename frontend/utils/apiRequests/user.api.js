import axiosInstance from "@/lib/axiosInstance";

export const getAllManagers = async () => {
  try {
    const response = await axiosInstance.get("/user/getAllManagers");
    return response.data;
  } catch (error) {
    console.error("Error in getAllManagers:", error);
    throw error;
  }
};

export const getAllActiveManagers = async () => {
  try {
    const response = await axiosInstance.get("/user/getAllActiveManagers");
    return response.data;
  } catch (error) {
    console.error("Error in getAllActiveManagers:", error);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await axiosInstance.get("/user/getAllStudents");
    return response.data;
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    throw error;
  }
};

export const getManagerById = async (user_id) => {
  try {
    const response = await axiosInstance.post("/user/getManagerById", {
      user_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error in getManagerById:", error);
    throw error;
  }
};

export const getStudentById = async (user_id) => {
  try {
    const response = await axiosInstance.post("/user/getStudentById", {
      user_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error in getStudentById:", error);
    throw error;
  }
};

export const getStudentByDegShort = async (short) => {
  try {
    const response = await axiosInstance.post("/user/getStudentByDegShort", {
      short,
    });
    return response.data;
  } catch (error) {
    console.error("Error in getStudentByDegShort:", error);
    throw error;
  }
};

export const updateManager = async (data) => {
  try {
    const response = await axiosInstance.put("/user/updateManager", data);
    return response.data;
  } catch (error) {
    console.error("Error in updateManager:", error);
    throw error;
  }
};

export const updateManagerStatus = async (data) => {
  try {
    const response = await axiosInstance.put("/user/updateManagerStatus", data);
    return response.data;
  } catch (error) {
    console.error("Error in updateManagerStatus:", error);
    throw error;
  }
};

export const updateStudent = async (data) => {
  try {
    const response = await axiosInstance.put("/user/updateStudent", data);
    return response.data;
  } catch (error) {
    console.error("Error in updateStudent:", error);
    throw error;
  }
};

export const updateStudentStatus = async (data) => {
  try {
    const response = await axiosInstance.put("/user/updateStudentStatus", data);
    return response.data;
  } catch (error) {
    console.error("Error in updateStudentStatus:", error);
    throw error;
  }
};

export const getNoOfManagers = async () => {
  try {
    const response = await axiosInstance.get("/user/getNoOfManagers");
    return response.data;
  } catch (error) {
    console.error("Error in getNoOfManagers:", error);
    throw error;
  }
};

export const getNoOfStudents = async () => {
  try {
    const response = await axiosInstance.get("/user/getNoOfStudents");
    return response.data;
  } catch (error) {
    console.error("Error in getNoOfStudents:", error);
    throw error;
  }
};
