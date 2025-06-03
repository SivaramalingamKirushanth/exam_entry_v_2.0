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
        {/* <div className="mt-6">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem className="mt-2" value="item-1">
              <AccordionTrigger>
                Who can apply under the "Proper" exam type?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                Only students applying for their own batch can apply under the
                "Proper" section. The subject list is auto-filled based on your
                batch.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-2">
              <AccordionTrigger>
                Can I remove subjects from the application?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                Yes, if you're not sitting for a subject this time, you may
                remove it. However, make sure it's intentional — once submitted,
                applications cannot be modified.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-3">
              <AccordionTrigger>
                What does "Not Eligible" mean?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                "Not Eligible" is based on your current attendance record. It
                does not mean you're permanently disqualified from sitting. You
                must meet the relevant lecturer or authority to explain and
                request eligibility.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-4">
              <AccordionTrigger>
                Should I remove a subject marked as "Not Eligible"?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                No. If you wish to sit for the subject, keep it in your
                application and talk to the appropriate person. Removing it by
                mistake could prevent you from applying again.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-5">
              <AccordionTrigger>
                Can I edit or reapply after submitting?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                No. Once submitted, the application cannot be changed. If you've
                made a mistake before submitting, you can refresh the page to
                reset the form.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-6">
              <AccordionTrigger>
                Can I apply for multiple batches in Medical or Resit?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                Yes. You can select one or more eligible batches when applying
                for Medical or Resit exams.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-7">
              <AccordionTrigger>
                What happens after submitting a Medical or Resit application?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                After the Dean's deadline, you can download your payment
                invoice.{" "}
                {instructionsdata
                  ? instructionsdata.find((item) => item.type == "payment")
                      ?.instruction
                  : "You must pay the amount to the university account, upload the reference number, and submit physical receipts to the exam branch."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-8">
              <AccordionTrigger>
                Do I need to make separate payments for each batch?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                Yes. You must make separate payments for each batch and each
                application type (Medical or Resit).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-9">
              <AccordionTrigger>
                Can a Medical application be converted to Resit?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                Yes. If your medical requirements are not satisfied, the
                examination branch may convert your application from Medical to
                Resit.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem className="mt-2" value="item-10">
              <AccordionTrigger>
                Can I apply for the same subject in both Medical and Resit?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                No. You can apply for different subjects in Medical and Resit
                from the same batch, but the same subject cannot be in both
                applications.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div> */}
      </div>
    </div>
  );
};

export default Users;
