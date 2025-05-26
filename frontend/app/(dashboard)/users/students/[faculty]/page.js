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
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getActiveDegreesInFaculty } from "@/utils/apiRequests/course.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { TfiImport } from "react-icons/tfi";
import ImportModel from "../ImportModel";
import Model from "../Model";

const Entries = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modelRef = useRef(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const importModelRef = useRef(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const f_id = searchParams.get("f_id");

  const {
    data: activeDegreesInFacultyData,
    isLoading: isActiveDegreesInFacultyDataLoading,
  } = useQuery({
    queryFn: () => getActiveDegreesInFaculty({ f_id }),
    queryKey: ["getActiveDegreesInFaculty"],
  });

  const toggleModel = () => {
    isOpen && setEditId("");
    setIsOpen((prev) => !prev);
  };

  const toggleImportModel = () => {
    setIsImportOpen((prev) => !prev);
  };

  if (isActiveDegreesInFacultyDataLoading)
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
        {activeDegreesInFacultyData &&
          activeDegreesInFacultyData.map((obj) => (
            <Link
              href={{
                pathname: `${pathname}/${obj.deg_name}`,
                query: {
                  deg_id: obj.deg_id,
                },
              }}
              className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
              key={obj.deg_id}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{obj.deg_name}</CardTitle>
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
