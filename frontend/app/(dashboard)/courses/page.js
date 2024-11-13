"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";

const users = () => {
  const pathname = usePathname();
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[70%] flex gap-6 flex-wrap">
        <Link
          href={`${pathname}/faculties`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Faculties</CardTitle>
              <CardDescription>no of Faculties</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/departments`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>no of Departments</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/degree programmes`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Degree programmes</CardTitle>
              <CardDescription>no of Degree programmes</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default users;
