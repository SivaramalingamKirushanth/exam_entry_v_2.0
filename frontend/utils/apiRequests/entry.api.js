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
  const response = await axiosInstance.post(
    "/entry/getStudentsWithoutIndexNumber",
    {
      batch_id,
    }
  );
  return response.data;
};
