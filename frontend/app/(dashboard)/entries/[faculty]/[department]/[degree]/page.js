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
          href={`${pathname}/level 1`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Level 1</CardTitle>
              <CardDescription>no of Entries</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/level 2`}
          className="w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Level 2</CardTitle>
              <CardDescription>no of Entries</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default users;
