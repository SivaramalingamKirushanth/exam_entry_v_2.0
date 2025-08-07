import axiosInstance from "@/lib/axiosInstance";

export const applyExam = async (removedSubjects) => {
  const response = await axiosInstance.post("/entry/applyExam", {
    removedSubjects,
  });
  return response.data;
};

export const applyResitExam = async (data) => {
  const response = await axiosInstance.post("/entry/applyResitExam", data);
  return response.data;
};

export const applyMedicalExam = async (data) => {
  const response = await axiosInstance.post("/entry/applyMedicalExam", data);
  return response.data;
};

export const getStudentSubjects = async (batch_id, s_id) => {
  const response = await axiosInstance.post("/entry/getStudentSubjects", {
    batch_id,
    s_id,
  });
  return response.data;
};

export const acceptMedicalResitStudents = async (data) => {
  const response = await axiosInstance.post(
    "/entry/acceptMedicalResitStudents",
    data
  );
  return response.data;
};

export const rejectMedicalResitApplication = async (data) => {
  const response = await axiosInstance.post(
    "/entry/rejectMedicalResitApplication",
    data
  );
  return response.data;
};

export const revokeMedicalResitApplication = async (data) => {
  const response = await axiosInstance.post(
    "/entry/revokeMedicalResitApplication",
    data
  );
  return response.data;
};

export const revokeEntry = async (data) => {
  const response = await axiosInstance.post("/entry/revokeEntry", data);
  return response.data;
};

export const getStudentsWithoutIndexNumber = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/getStudentsWithoutIndexNumber",
    {
      batch_id,
    }
  );
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

export const getLatestAttendanceTemplate = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getLatestAttendanceTemplate",
    data
  );
  return response.data;
};

export const deleteBatchSubjectEntries = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/deleteBatchSubjectEntries",
    { batch_id }
  );
  return response.data;
};

export const getDeanDashboardData = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getDeanDashboardData",
    data
  );
  return response.data;
};

export const getHodDashboardData = async (data) => {
  const response = await axiosInstance.post("/entry/getHodDashboardData", data);
  return response.data;
};

export const getAppliedStudentsForSubject = async (batch_id, sub_id) => {
  const response = await axiosInstance.post(
    "/entry/getAppliedStudentsForSubject",
    { batch_id, sub_id }
  );
  return response.data;
};

export const getAppliedStudentsForSubjectOfFaculty = async (
  batch_id,
  sub_id
) => {
  const response = await axiosInstance.post(
    "/entry/getAppliedStudentsForSubjectOfFaculty",
    { batch_id, sub_id }
  );
  return response.data;
};

export const getAppliedStudentsForSubjectOfDepartment = async (
  batch_id,
  sub_id
) => {
  const response = await axiosInstance.post(
    "/entry/getAppliedStudentsForSubjectOfDepartment",
    { batch_id, sub_id }
  );
  return response.data;
};

export const getAppliedResitStudentsByBatchAndSubject = async (
  batch_id,
  sub_id
) => {
  const response = await axiosInstance.post(
    "/entry/getAppliedResitStudentsByBatchAndSubject",
    { batch_id, sub_id }
  );
  return response.data;
};

export const getAppliedMedicalStudentsByBatchAndSubject = async (
  batch_id,
  sub_id
) => {
  const response = await axiosInstance.post(
    "/entry/getAppliedMedicalStudentsByBatchAndSubject",
    { batch_id, sub_id }
  );
  return response.data;
};

export const getStudentMedicalResitApplications = async () => {
  const response = await axiosInstance.get(
    "/entry/getStudentMedicalResitApplications"
  );
  return response.data;
};

export const updateReference = async (data) => {
  const response = await axiosInstance.post("/entry/updateReference", data);
  return response.data;
};

export const updateVerified = async (data) => {
  const response = await axiosInstance.post("/entry/updateVerified", data);
  return response.data;
};

export const moveToMedical = async (data) => {
  const response = await axiosInstance.post("/entry/moveToMedical", data);
  return response.data;
};

export const moveToResit = async (data) => {
  const response = await axiosInstance.post("/entry/moveToResit", data);
  return response.data;
};

export const checkPendingMedicalResitRequests = async () => {
  const response = await axiosInstance.get(
    "/entry/checkPendingMedicalResitRequests"
  );
  return response.data;
};

export const getBatchDeadlineAndApprovalStatus = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getBatchDeadlineAndApprovalStatus",
    data
  );
  return response.data;
};

export const setApproval = async (data) => {
  const response = await axiosInstance.post("/entry/setApproval", data);
  return response.data;
};

export const upsertPayments = async (data) => {
  const response = await axiosInstance.post("/entry/upsertPayments", data);
  return response.data;
};

export const getAllPayments = async () => {
  const response = await axiosInstance.get("/entry/getAllPayments");
  return response.data;
};

export const getAllInstructions = async () => {
  const response = await axiosInstance.get("/entry/getAllInstructions");
  return response.data;
};

export const getEligibleMedicalSubjects = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getEligibleMedicalSubjects",
    data
  );
  return response.data;
};

export const getEligibleResitSubjects = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getEligibleResitSubjects",
    data
  );
  return response.data;
};

export const getSummarySubjectsData = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getSummarySubjectsData",
    data
  );
  return response.data;
};

export const getDynamicBatchTablesData = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getDynamicBatchTablesData",
    data
  );
  return response.data;
};

export const updateRequestReference = async (data) => {
  const response = await axiosInstance.post(
    "/entry/updateRequestReference",
    data
  );
  return response.data;
};

export const getStudentSubjectEligibility = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/getStudentSubjectEligibility",
    { batch_id }
  );
  return response.data;
};

export const getStudentMedicalSubjectEligibility = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/getStudentMedicalSubjectEligibility",
    { batch_id }
  );
  return response.data;
};

export const getStudentResitSubjectEligibility = async (batch_id) => {
  const response = await axiosInstance.post(
    "/entry/getStudentResitSubjectEligibility",
    { batch_id }
  );
  return response.data;
};

export const getRemarksForSubject = async (data) => {
  const response = await axiosInstance.post(
    "/entry/getRemarksForSubject",
    data
  );
  return response.data;
};
