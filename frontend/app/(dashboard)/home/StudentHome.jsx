"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAllInstructions } from "@/utils/apiRequests/entry.api";
import { useQuery } from "@tanstack/react-query";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { useState } from "react";
import CustomFAQ from "@/components/CustomFAQ";

const Users = () => {
  const pathname = usePathname();
  const [expandId, setExpandId] = useState("item-1");

  const { data: instructionsdata } = useQuery({
    queryFn: getAllInstructions,
    queryKey: ["instructions"],
  });

  const expandHandler = (e) => {
    if (e.target.id == expandId) {
      setExpandId(null);
    } else {
      setExpandId(e.target.id);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-[80%] md:w-[85%] lg:w-[70%]">
        <div className="flex flex-col sm:flex-row gap-6 flex-wrap">
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
                <CardTitle>Resit (Repeat)</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
        <CustomFAQ
          expandId={expandId}
          expandHandler={expandHandler}
          dynamicInstruction={
            instructionsdata?.find((i) => i.type === "payment")?.instruction
          }
        />
      </div>
    </div>
  );
};

export default Users;
