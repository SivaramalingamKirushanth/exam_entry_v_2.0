"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllBatchesForFaculty } from "@/utils/apiRequests/batch.api";
import { numberToOrdinalWord, parseString } from "@/utils/functions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DeanHome = () => {
  const pathname = usePathname();

  const { data: batchesOfFacultyData, isLoading: isBatchesOfFacultyLoading } =
    useQuery({
      queryFn: getAllBatchesForFaculty,
      queryKey: ["batchesOfFaculty"],
    });

  if (isBatchesOfFacultyLoading)
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
    <div className="flex justify-end md:justify-center">
      <div className="w-[80%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
        {batchesOfFacultyData && batchesOfFacultyData.length ? (
          batchesOfFacultyData.map((obj) => {
            const decodeBatchCode = parseString(obj.batch_code);
            const level_ordinal = numberToOrdinalWord(decodeBatchCode.level);
            const sem_ordinal = numberToOrdinalWord(decodeBatchCode.sem_no);
            return (
              <Link
                href={{
                  pathname: `${pathname}/batches/${obj.batch_code}`,
                  query: {
                    batch_id: obj.batch_id,
                  },
                }}
                className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
                key={obj.batch_id}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize text-center">
                      <p>
                        {level_ordinal} examination in {obj.deg_name}
                      </p>
                      <p>{decodeBatchCode.academic_year}</p>
                      <br />
                      <p>{sem_ordinal} semester</p>
                    </CardTitle>
                    <CardDescription className="capitalize text-center">
                      {obj.batch_code}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })
        ) : (
          <h1 className="text-2xl text-center w-full">No batches available!</h1>
        )}
      </div>
    </div>
  );
};

export default DeanHome;
