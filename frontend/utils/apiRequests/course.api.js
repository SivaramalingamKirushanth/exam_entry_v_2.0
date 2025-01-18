import axiosInstance from "@/lib/axiosInstance";

export const getAllFaculties = async () => {
  try {
    const response = await axiosInstance.get("/course/getAllFaculties");
    return response.data;
  } catch (error) {
    console.error("Error fetching all faculties:", error);
    throw new Error("Failed to fetch faculties. Please try again.");
  }
};

export const getAllFacultiesWithExtraDetails = async () => {
  try {
    const response = await axiosInstance.get(
      "/course/getAllFacultiesWithExtraDetails"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching faculties with extra details:", error);
    throw new Error("Failed to fetch faculty details. Please try again.");
  }
};

export const createFaculty = async (data) => {
  try {
    const response = await axiosInstance.post("/course/createFaculty", data);
    return response.data;
  } catch (error) {
    console.error("Error creating faculty:", error);
    throw new Error("Failed to create faculty. Please try again.");
  }
};

export const updateFacultyStatus = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/course/updateFacultyStatus",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating faculty status:", error);
    throw new Error("Failed to update faculty status. Please try again.");
  }
};

export const updateFaculty = async (data) => {
  try {
    const response = await axiosInstance.put("/course/updateFaculty", data);
    return response.data;
  } catch (error) {
    console.error("Error updating faculty:", error);
    throw new Error("Failed to update faculty. Please try again.");
  }
};

export const getFacultyById = async (f_id) => {
  try {
    const response = await axiosInstance.post("/course/getFacultyById", {
      f_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty by ID:", error);
    throw new Error("Failed to fetch faculty details. Please try again.");
  }
};

export const getNoOfFaculty = async () => {
  try {
    const response = await axiosInstance.get("/course/getNoOfFaculty");
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty count:", error);
    throw new Error("Failed to fetch faculty count. Please try again.");
  }
};

export const getDepartmentsByFacultyId = async (f_id) => {
  try {
    const response = await axiosInstance.post(
      "/course/getDepartmentsByFacultyId",
      { f_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching departments by faculty ID:", error);
    throw new Error("Failed to fetch departments. Please try again.");
  }
};

export const getAllDepartments = async () => {
  try {
    const response = await axiosInstance.get("/course/getAllDepartments");
    return response.data;
  } catch (error) {
    console.error("Error fetching all departments:", error);
    throw new Error("Failed to fetch departments. Please try again.");
  }
};

export const getAllDepartmentsWithExtraDetails = async () => {
  try {
    const response = await axiosInstance.get(
      "/course/getAllDepartmentsWithExtraDetails"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching departments with extra details:", error);
    throw new Error("Failed to fetch department details. Please try again.");
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await axiosInstance.post("/course/createDepartment", data);
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    throw new Error("Failed to create department. Please try again.");
  }
};

export const updateDepartment = async (data) => {
  try {
    const response = await axiosInstance.put("/course/updateDepartment", data);
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    throw new Error("Failed to update department. Please try again.");
  }
};

export const updateDepartmentStatus = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/course/updateDepartmentStatus",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating department status:", error);
    throw new Error("Failed to update department status. Please try again.");
  }
};

export const getDepartmentById = async (d_id) => {
  try {
    const response = await axiosInstance.post("/course/getDepartmentById", {
      d_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching department by ID:", error);
    throw new Error("Failed to fetch department details. Please try again.");
  }
};

export const getNoOfDepartments = async () => {
  try {
    const response = await axiosInstance.get("/course/getNoOfDepartments");
    return response.data;
  } catch (error) {
    console.error("Error fetching department count:", error);
    throw new Error("Failed to fetch department count. Please try again.");
  }
};

export const getAllDegrees = async () => {
  try {
    const response = await axiosInstance.get("/course/getAllDegrees");
    return response.data;
  } catch (error) {
    console.error("Error fetching all degrees:", error);
    throw new Error("Failed to fetch degrees. Please try again.");
  }
};

export const getAllDegreesWithExtraDetails = async () => {
  try {
    const response = await axiosInstance.get(
      "/course/getAllDegreesWithExtraDetails"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching degrees with extra details:", error);
    throw new Error("Failed to fetch degree details. Please try again.");
  }
};

export const createDegree = async (data) => {
  try {
    const response = await axiosInstance.post("/course/createDegree", data);
    return response.data;
  } catch (error) {
    console.error("Error creating degree:", error);
    throw new Error("Failed to create degree. Please try again.");
  }
};

export const updateDegree = async (data) => {
  try {
    const response = await axiosInstance.put("/course/updateDegree", data);
    return response.data;
  } catch (error) {
    console.error("Error updating degree:", error);
    throw new Error("Failed to update degree. Please try again.");
  }
};

export const updateDegreeStatus = async (data) => {
  try {
    const response = await axiosInstance.put(
      "/course/updateDegreeStatus",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating degree status:", error);
    throw new Error("Failed to update degree status. Please try again.");
  }
};

export const getDegreeById = async (deg_id) => {
  try {
    const response = await axiosInstance.post("/course/getDegreeById", {
      deg_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching degree by ID:", error);
    throw new Error("Failed to fetch degree details. Please try again.");
  }
};

export const getDegreesByDepartmentId = async (d_id) => {
  try {
    const response = await axiosInstance.post(
      "/course/getDegreesByDepartmentId",
      { d_id }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching degrees by department ID:", error);
    throw new Error("Failed to fetch degrees. Please try again.");
  }
};

export const getNoOfDegrees = async () => {
  try {
    const response = await axiosInstance.get("/course/getNoOfDegrees");
    return response.data;
  } catch (error) {
    console.error("Error fetching degree count:", error);
    throw new Error("Failed to fetch degree count. Please try again.");
  }
};

export const getActiveFacultiesWithDepartmentsCount = async () => {
  try {
    const response = await axiosInstance.get(
      "/course/getActiveFacultiesWithDepartmentsCount"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching active faculties count:", error);
    throw new Error(
      "Failed to fetch active faculties count. Please try again."
    );
  }
};

export const getActiveDepartmentsInAFacultyWithDegreesCount = async (f_id) => {
  try {
    const response = await axiosInstance.post(
      "/course/getActiveDepartmentsInAFacultyWithDegreesCount",
      { f_id }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active departments with degrees count:",
      error
    );
    throw new Error(
      "Failed to fetch active departments count. Please try again."
    );
  }
};

export const getActiveDegreesInADepartmentWithLevelsCount = async (d_id) => {
  try {
    const response = await axiosInstance.post(
      "/course/getActiveDegreesInADepartmentWithLevelsCount",
      { d_id }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active degrees in a department with levels count:",
      error
    );
    throw new Error("Failed to fetch active degrees count. Please try again.");
  }
};

export const getDegreeByShort = async (short) => {
  try {
    const response = await axiosInstance.post("/course/getDegreeByShort", {
      short,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching degree by short code:", error);
    throw new Error("Failed to fetch degree details. Please try again.");
  }
};
