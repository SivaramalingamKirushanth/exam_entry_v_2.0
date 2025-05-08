"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getNoOfBatches } from "@/utils/apiRequests/batch.api";
import { getNoOfSubjects } from "@/utils/apiRequests/curriculum.api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Examination = () => {
  const pathname = usePathname();
  const { data: noOfSubjectsData, isLoading: isNoOfSubjectsDataLoading } =
    useQuery({
      queryFn: getNoOfSubjects,
      queryKey: ["noOfSubjects"],
    });

  const { data: noOfBatchesData, isLoading: isNoOfBatchesDataLoading } =
    useQuery({
      queryFn: getNoOfBatches,
      queryKey: ["noOfBatches"],
    });

  if (isNoOfSubjectsDataLoading || isNoOfBatchesDataLoading)
    return (
      <div className="flex justify-end md:justify-center">
        <div className="w-[80%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
          {[1, 2, 3].map((_, i) => (
            <Skeleton
              key={i}
              className="sm:w-[30%] h-32 sm:max-w-[30%] rounded-xl"
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="flex justify-end md:justify-center">
      <div className="w-[80%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
        <Link
          href={`${pathname}/syllabi`}
          className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Syllabi</CardTitle>
              <CardDescription>
                {noOfSubjectsData?.count} {noOfSubjectsData && "Syllabi"}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/subjects`}
          className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>
                {noOfSubjectsData?.count} {noOfSubjectsData && "Subjects"}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/groups`}
          className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Groups</CardTitle>
              <CardDescription>
                {noOfBatchesData?.count} {noOfBatchesData && "Groups"}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Examination;
