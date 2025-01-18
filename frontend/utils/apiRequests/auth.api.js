import axiosInstance from "@/lib/axiosInstance";
import axios from "axios";

export const managerRegister = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/managerRegister", data);
    return response.data;
  } catch {
    throw new Error("Manager registration failed.");
  }
};

export const studentRegister = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/studentRegister", data);
    return response.data;
  } catch {
    throw new Error("Student registration failed.");
  }
};

export const multipleStudentsRegister = async (data) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api1/auth/multipleStudentsRegister",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        responseType: "blob", // Handle file responses
      }
    );

    const contentType = response.headers["content-type"];
    if (contentType.includes("application/json")) {
      const responseData = JSON.parse(await response.data.text());
      return { message: responseData.message, isFile: false };
    } else if (contentType.includes("text/plain")) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "failed_records.txt"); // File name for download
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { message: "Failed records file downloaded.", isFile: true };
    }

    throw new Error("Unexpected response type.");
  } catch {
    throw new Error("Failed to register multiple students.");
  }
};

export const login = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch {
    throw new Error("Login failed.");
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/forgotPassword", data);
    return response.data;
  } catch {
    throw new Error("Forgot password request failed.");
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/resetPassword", data);
    return response.data;
  } catch {
    throw new Error("Password reset failed.");
  }
};

export const changePassword = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/changePassword", data);
    return response.data;
  } catch {
    throw new Error("Password change failed.");
  }
};
