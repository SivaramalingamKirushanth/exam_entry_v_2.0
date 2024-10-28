"use ";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/Sidebar";

const RootLayout = ({ children }) => {
  
  return (
    <div>
      <DashboardHeader />
      <Sidebar />
      <div className="p-3 pt-16 h-full w-full">{children}</div>
    </div>
  );
};

export default RootLayout;
