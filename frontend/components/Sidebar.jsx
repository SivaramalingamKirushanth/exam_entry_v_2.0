import Link from "next/link";
import { RiGraduationCapLine, RiHome2Line } from "react-icons/ri";
import { LucideBook, LucideUser2 } from "lucide-react";
import { PiNotePencil, PiNoteDuotone } from "react-icons/pi";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { useUser } from "@/utils/useUser";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { checkPendingMedicalResitRequests } from "@/utils/apiRequests/entry.api";
import { IoMdAlert } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { FiChevronLeft } from "react-icons/fi";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaArrowCircleLeft } from "react-icons/fa";

const Sidebar = () => {
  const [roleId, setRoleID] = useState(null);
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameArr = pathname.split("/").slice(1);

  const backHandler = () => {
    if (pathnameArr.length > 1) {
      router.back();
    }
  };

  useEffect(() => {
    if (user?.role_id) {
      setRoleID(user?.role_id);
    }
  }, [user]);

  const { data } = useQuery({
    queryFn: () => checkPendingMedicalResitRequests(),
    queryKey: ["requests", "pending"],
    enabled: roleId == "1",
  });

  return (
    <div className="w-12 sm:hover:w-48 transition-all duration-300 overflow-hidden rounded-xl fixed top-[45%] left-2 -translate-y-1/3 shadow-2xl bg-white py-3 flex flex-col gap-y-[2px] items-start bg-background supports-[backdrop-filter]:bg-background z-50">
      <Link
        href="/home"
        className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
          pathname.startsWith("/home") ? "bg-gray-200" : ""
        }`}
      >
        <RiHome2Line size={25} className="shrink-0" />
        home
      </Link>

      {roleId === "1" && (
        <>
          <Link
            href="/courses"
            className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
              pathname.startsWith("/courses") ? "bg-gray-200" : ""
            }`}
          >
            <RiGraduationCapLine size={25} className="shrink-0" />
            Courses
          </Link>
          <Link
            href="/curriculums"
            className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
              pathname.startsWith("/curriculums") ? "bg-gray-200" : ""
            }`}
          >
            <LucideBook size={25} className="shrink-0" />
            curriculums
          </Link>
          <Link
            href="/users"
            className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
              pathname.startsWith("/users") ? "bg-gray-200" : ""
            }`}
          >
            <LucideUser2 size={25} className="shrink-0" />
            users
          </Link>
          <Link
            href="/venues"
            className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
              pathname.startsWith("/venues") ? "bg-gray-200" : ""
            }`}
          >
            <GrLocation size={25} className="shrink-0" />
            venues
          </Link>
          <Link
            href="/examinations"
            className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
              pathname.startsWith("/examinations") ? "bg-gray-200" : ""
            }`}
          >
            <PiNotePencil size={25} className="shrink-0" />
            Examinations
          </Link>
          <Link
            href="/requests"
            className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900 relative hover:text-zinc-100 w-[95%] rounded-r-md transition-colors duration-150 ${
              pathname.startsWith("/requests") ? "bg-gray-200" : ""
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
              pathname.startsWith("/entries") ? "bg-gray-200" : ""
            }`}
          >
            <PiNoteDuotone size={25} className="shrink-0" />
            entries
          </Link>
        </>
      )}

      <span
        className={`flex gap-3 uppercase items-center px-3 py-2 text-nowrap hover:bg-zinc-900  w-[95%] rounded-r-md transition-colors duration-150 ${
          pathnameArr.length > 1
            ? "text-black cursor-pointer hover:text-zinc-100"
            : "text-slate-400 cursor-not-allowed hover:text-zinc-400"
        }`}
        onClick={backHandler}
      >
        <FaArrowCircleLeft size={23} className={`shrink-0 mr-[2px]`} />
        back
      </span>
    </div>
  );
};

export default Sidebar;
