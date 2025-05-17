import Link from "next/link";
import { RiGraduationCapLine, RiHome2Line } from "react-icons/ri";
import { LucideBook, LucideUser2 } from "lucide-react";
import { PiNotePencil, PiNoteDuotone } from "react-icons/pi";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { useUser } from "@/utils/useUser";
import { useEffect, useState } from "react";
import { LuChartColumn } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { checkPendingMedicalResitRequests } from "@/utils/apiRequests/entry.api";
import { IoMdAlert } from "react-icons/io";

const Sidebar = () => {
  const [roleId, setRoleID] = useState(null);
  const { data: user, isLoading } = useUser();

  const pathname = usePathname();

  useEffect(() => {
    if (user?.role_id) {
      setRoleID(user?.role_id);
    }
  }, [user]);

  const { data } = useQuery({
    queryFn: () => checkPendingMedicalResitRequests(),
    queryKey: ["requests", "pending"],
  });

  console.log(data);

  return (
    (roleId == "1" || roleId == "2" || roleId == "3") && (
      <div className="w-12 hover:w-48 transition-all duration-300 overflow-hidden rounded-xl fixed top-[50%] left-2 -translate-y-1/2 shadow-2xl bg-white py-3 flex flex-col gap-y-1 items-start bg-background supports-[backdrop-filter]:bg-background z-50">
        <Link
          href="/home"
          className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
            pathname.startsWith("/home") ? "bg-zinc-300" : ""
          }`}
        >
          <RiHome2Line size={25} className="shrink-0" />
          home
        </Link>

        {roleId !== "1" && (
          <Link
            href="/report"
            className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
              pathname.startsWith("/report") ? "bg-zinc-300" : ""
            }`}
          >
            <LuChartColumn size={23} className="shrink-0" />
            Report
          </Link>
        )}

        {roleId === "1" && (
          <>
            <Link
              href="/courses"
              className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
                pathname.startsWith("/courses") ? "bg-zinc-300" : ""
              }`}
            >
              <RiGraduationCapLine size={25} className="shrink-0" />
              Courses
            </Link>
            <Link
              href="/curriculums"
              className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
                pathname.startsWith("/curriculums") ? "bg-zinc-300" : ""
              }`}
            >
              <LucideBook size={25} className="shrink-0" />
              curriculums
            </Link>
            <Link
              href="/users"
              className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
                pathname.startsWith("/users") ? "bg-zinc-300" : ""
              }`}
            >
              <LucideUser2 size={25} className="shrink-0" />
              users
            </Link>
            <Link
              href="/examinations"
              className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
                pathname.startsWith("/examinations") ? "bg-zinc-300" : ""
              }`}
            >
              <PiNotePencil size={25} className="shrink-0" />
              Examinations
            </Link>
            <Link
              href="/requests"
              className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 relative hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
                pathname.startsWith("/requests") ? "bg-zinc-300" : ""
              }`}
            >
              <VscGitPullRequestGoToChanges size={25} className="shrink-0" />
              Requests
              {data?.medical || data?.resit ? (
                <IoMdAlert className="text-red-600 absolute right-1 top-1" />
              ) : (
                ""
              )}
            </Link>
            <Link
              href="/entries"
              className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
                pathname.startsWith("/entries") ? "bg-zinc-300" : ""
              }`}
            >
              <PiNoteDuotone size={25} className="shrink-0" />
              entries
            </Link>
          </>
        )}
      </div>
    )
  );
};

export default Sidebar;
