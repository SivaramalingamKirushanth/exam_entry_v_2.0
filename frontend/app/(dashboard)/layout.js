"use client";

import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const RootLayout = ({ children }) => {
  const logoutHandler = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");

      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-between">
      <Suspense>
        <DashboardHeader logoutHandler={logoutHandler} />
        <Sidebar />
        <div className="p-3 pt-10 sm:pt-16 h-full w-full">{children}</div>
        <Footer />
      </Suspense>
    </div>
  );
};

export default RootLayout;
