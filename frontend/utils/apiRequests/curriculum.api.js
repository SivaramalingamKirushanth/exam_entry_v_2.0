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

export const getGroupsBySylLevSem = async (syl_id, level, sem_no) => {
  const response = await axiosInstance.post(
    "/curriculum/getGroupsBySylLevSem",
    {
      syl_id,
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

export const checkSubjectExistOnBSL = async (data) => {
  const response = await axiosInstance.post(
    "/curriculum/checkSubjectExistOnBSL",
    data
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

export const getAllSyllabiWithExtraDetails = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getAllSyllabiWithExtraDetails"
  );
  return response.data;
};

export const updateSyllabusStatus = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateSyllabusStatus",
    data
  );
  return response.data;
};

export const getSyllabusById = async (syl_id) => {
  const response = await axiosInstance.post("/curriculum/getSyllabusById", {
    syl_id,
  });
  return response.data;
};

export const getSyllabiByDegreeId = async (deg_id) => {
  const response = await axiosInstance.post(
    "/curriculum/getSyllabiByDegreeId",
    {
      deg_id,
    }
  );
  return response.data;
};

export const updateSyllabus = async (data) => {
  const response = await axiosInstance.put("/curriculum/updateSyllabus", data);
  return response.data;
};

export const getAllSubjectsForGroupCreation = async (
  f_id,
  syl_id,
  level,
  sem_no
) => {
  const response = await axiosInstance.post(
    "/curriculum/getAllSubjectsForGroupCreation",
    {
      f_id,
      syl_id,
      level,
      sem_no,
    }
  );
  return response.data;
};

export const createGroup = async (data) => {
  const response = await axiosInstance.post("/curriculum/createGroup", data);
  return response.data;
};

export const getAllGroupsWithExtraDetails = async () => {
  const response = await axiosInstance.get(
    "/curriculum/getAllGroupsWithExtraDetails"
  );
  return response.data;
};

export const updateGroupStatus = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateGroupStatus",
    data
  );
  return response.data;
};

export const getGroupById = async (grp_id) => {
  const response = await axiosInstance.post("/curriculum/getGroupById", {
    grp_id,
  });
  return response.data;
};

export const updateGroup = async (data) => {
  const response = await axiosInstance.put("/curriculum/updateGroup", data);
  return response.data;
};

export const getNoOfSyllabi = async () => {
  const response = await axiosInstance.get("/curriculum/getNoOfSyllabi");
  return response.data;
};

export const getNoOfGroups = async () => {
  const response = await axiosInstance.get("/curriculum/getNoOfGroups");
  return response.data;
};

export const getSubjectsByGrp = async (grp_id) => {
  const response = await axiosInstance.post("/curriculum/getSubjectsByGrp", {
    grp_id,
  });
  return response.data;
};

export const getStudentResitApplicationDetails = async (batch_id) => {
  const response = await axiosInstance.post(
    "/curriculum/getStudentResitApplicationDetails",
    {
      batch_id,
    }
  );
  return response.data;
};

export const getStudentMedicalApplicationDetails = async (batch_id) => {
  const response = await axiosInstance.post(
    "/curriculum/getStudentMedicalApplicationDetails",
    {
      batch_id,
    }
  );
  return response.data;
};

export const updateResitEligibility = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateResitEligibility",
    data
  );
  return response.data;
};

export const updateMultipleResitEligibility = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateMultipleResitEligibility",
    data
  );
  return response.data;
};

export const updateMedicalEligibility = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateMedicalEligibility",
    data
  );
  return response.data;
};

export const updateMultipleMedicalEligibility = async (data) => {
  const response = await axiosInstance.put(
    "/curriculum/updateMultipleMedicalEligibility",
    data
  );
  return response.data;
};
