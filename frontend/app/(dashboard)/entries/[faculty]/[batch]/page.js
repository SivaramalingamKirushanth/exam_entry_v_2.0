"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getCurriculumBybatchId } from "@/utils/apiRequests/curriculum.api";

const departments = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const batch_id = searchParams.get("batch_id");

  const { data: curriculumsOfBatchData } = useQuery({
    queryFn: () => getCurriculumBybatchId(batch_id),
    queryKey: ["curriculumsOfBatch"],
  });

  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[70%] flex gap-6 flex-wrap">
        {curriculumsOfBatchData &&
          curriculumsOfBatchData.map((obj) => (
            <Link
              href={{
                pathname: `${pathname}/${obj.sub_code}`,
                query: {
                  sub_id: obj.sub_id,
                },
              }}
              className="w-[30%] hover:shadow-md rounded-xl"
              key={obj.sub_id}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{obj.sub_name}</CardTitle>
                  <CardDescription>{obj.sub_code}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default departments;
