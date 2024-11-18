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

const users = () => {
  const pathname = usePathname();
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[70%] flex gap-6 flex-wrap">
        <Link
          href={`${pathname}/information technology`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Information Technology</CardTitle>
              <CardDescription>no of Levels</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/information technology (hons)`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Information Technology (Hons)</CardTitle>
              <CardDescription>no of Levels</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/applied mathematics and computing`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Applied Mathematics And Computing</CardTitle>
              <CardDescription>no of Levels</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default users;
