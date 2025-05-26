"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getActiveFacultiesWithDepartmentsCount } from "@/utils/apiRequests/course.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { TfiImport } from "react-icons/tfi";
import Model from "./Model";
import ImportModel from "./ImportModel";

const Entries = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const modelRef = useRef(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const importModelRef = useRef(null);

  const {
    data: noOfDepartmentsWithFacultyData,
    isLoading: isNoOfDepartmentsWithFacultyDataLoading,
  } = useQuery({
    queryFn: getActiveFacultiesWithDepartmentsCount,
    queryKey: ["noOfDepartmentsWithFaculty"],
  });

  const toggleModel = () => {
    isOpen && setEditId("");
    setIsOpen((prev) => !prev);
  };

  const toggleImportModel = () => {
    setIsImportOpen((prev) => !prev);
  };

  if (isNoOfDepartmentsWithFacultyDataLoading)
    return (
      <div className="flex justify-end md:justify-center">
        <div className="w-[80%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <Skeleton
              key={i}
              className="sm:w-[30%] h-32 sm:max-w-[30%] rounded-xl"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-end md:items-center gap-y-3">
      <div className="flex gap-x-2 w-[80%] md:w-[85%] lg:w-[70%]">
        <Button
          onClick={toggleModel}
          className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md px-3 py-2 mb-3 text-sm mr-3"
        >
          <FaPlus />
          &nbsp;Create student
        </Button>
        <Button
          onClick={toggleImportModel}
          className="flex items-center bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md px-3 py-2 mb-3 text-sm"
        >
          <TfiImport />
          &nbsp;Import students
        </Button>
      </div>

      <div className="w-[80%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
        {noOfDepartmentsWithFacultyData &&
          noOfDepartmentsWithFacultyData.map((obj) => (
            <Link
              href={{
                pathname: `${pathname}/${obj.f_name}`,
                query: {
                  f_id: obj.f_id,
                },
              }}
              className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
              key={obj.f_id}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{obj.f_name}</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
      <Model isOpen={isOpen} setIsOpen={setIsOpen} modelRef={modelRef} />
      <ImportModel
        isImportOpen={isImportOpen}
        setIsImportOpen={setIsImportOpen}
        importModelRef={importModelRef}
      />
    </div>
  );
};

export default Entries;
