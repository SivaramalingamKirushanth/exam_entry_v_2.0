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
import { getActiveDegreesInADepartmentWithLevelsCount } from "@/utils/apiRequests/course.api";

const departments = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const d_id = searchParams.get("d_id");

  const { data: ActiveDegreesInADepartmentWithLevelsCountData } = useQuery({
    queryFn: () => getActiveDegreesInADepartmentWithLevelsCount(d_id),
    queryKey: ["ActiveDegreesInADepartmentWithLevelsCount"],
  });

  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[70%] flex gap-6 flex-wrap">
        {ActiveDegreesInADepartmentWithLevelsCountData &&
          ActiveDegreesInADepartmentWithLevelsCountData.map((obj) => (
            <Link
              href={{
                pathname: `${pathname}/${obj.deg_name}`,
                query: {
                  deg_id: obj.deg_id,
                  levels: obj.levels,
                },
              }}
              className="w-[30%] hover:shadow-md rounded-xl"
              key={obj.deg_id}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{obj.deg_name}</CardTitle>
                  <CardDescription>
                    {obj.levels.split(":").length} Levels
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default departments;
