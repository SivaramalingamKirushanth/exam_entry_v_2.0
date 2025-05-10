"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Users = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-center">
      <div className="w-[80%] md:w-[85%] lg:w-[70%] flex flex-col sm:flex-row gap-6 flex-wrap">
        <Link
          href={`${pathname}/proper`}
          className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Proper</CardTitle>
            </CardHeader>
          </Card>
        </Link>

        <Link
          href={`${pathname}/medical`}
          className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Medical</CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`${pathname}/resit`}
          className="sm:w-[30%] sm:max-w-[30%] hover:shadow-md rounded-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Re-sit (Repeat)</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Users;
