"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllSubjectsForLecturer } from "@/utils/apiRequests/curriculum.api";
import { numberToOrdinalWord, titleCase } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LecturerHome = () => {
  const pathname = usePathname();

  const { data: subjectsOfManagerData, isLoading: isSubjectsOfManagerLoading } =
    useQuery({
      queryFn: getAllSubjectsForLecturer,
      queryKey: ["subjectsOfManager"],
    });

  if (isSubjectsOfManagerLoading)
    return (
      <div className="flex justify-center">
        <div className="w-[90%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
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
    <div className="flex justify-center">
      <div className="w-[90%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
        {subjectsOfManagerData && subjectsOfManagerData.length ? (
          subjectsOfManagerData.map((obj) => {
            const level_ordinal = numberToOrdinalWord(obj.level);
            const sem_ordinal = numberToOrdinalWord(obj.sem);
            return (
              <Link
                href={{
                  pathname: `${pathname}/subjects/${obj.sub_code}`,
                  query: {
                    sub_id: obj.sub_id,
                    batch_id: obj.batch_id,
                    deadline: obj.deadline,
                  },
                }}
                className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
                key={obj.sub_id}
              >
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{titleCase(obj.sub_name)}</CardTitle>
                    <CardDescription>{obj.sub_code}</CardDescription>
                  </CardHeader>
                  <CardFooter className="text-xs capitalize items-center text-slate-500 flex-col">
                    <p className="text-center">
                      {level_ordinal} examination in {obj.course_title}{" "}
                      {obj.academic_year}
                    </p>
                    <p>{sem_ordinal} semester</p>
                  </CardFooter>
                </Card>
              </Link>
            );
          })
        ) : (
          <h1 className="text-2xl text-center w-full">No entries available!</h1>
        )}
      </div>
    </div>
  );
};

export default LecturerHome;
