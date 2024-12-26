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
import { useEffect, useRef, useState } from "react";
import { getCurriculumBybatchId } from "@/utils/apiRequests/curriculum.api";
import { Button } from "@/components/ui/button";
import { FaGear, FaPlus } from "react-icons/fa6";
import Modal from "./Model";
import IndexModel from "./IndexModel";
import { getStudentsWithoutIndexNumber } from "@/utils/apiRequests/entry.api";

const batches = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isIndexOpen, setIsIndexOpen] = useState(false);
  const modalRef = useRef(null);
  const indexModalRef = useRef(null);

  const batch_id = searchParams.get("batch_id");

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const { data: curriculumsOfBatchData } = useQuery({
    queryFn: () => getCurriculumBybatchId(batch_id),
    queryKey: ["curriculumsOfBatch"],
  });

  const { data: studentsWithoutIndexNumberData } = useQuery({
    queryFn: () => getStudentsWithoutIndexNumber(batch_id),
    queryKey: ["studentsWithoutIndexNumber", batch_id],
  });

  const toggleIndexModal = () => {
    if (studentsWithoutIndexNumberData?.count) {
      setIsIndexOpen((prev) => !prev);
    } else {
      console.log("you can generate now");
    }
  };

  return (
    <div className="flex flex-col items-end md:items-center">
      <div className="flex self-stretch md:w-[70%] mb-2 mx-auto justify-between">
        <Button onClick={toggleModal} variant="outline">
          <FaPlus />
          &nbsp;Insert Medical/Resit
        </Button>
        <Button onClick={toggleIndexModal}>
          Finish &nbsp;
          <FaGear />
        </Button>
      </div>
      <div className="md:w-[70%] flex gap-6 flex-wrap">
        {curriculumsOfBatchData &&
          curriculumsOfBatchData.map((obj) => (
            <Link
              href={{
                pathname: `${pathname}/${obj.sub_code}`,
                query: {
                  sub_id: obj.sub_id,
                  batch_id: batch_id,
                },
              }}
              className="min-w-[30%] max-w-[30%] hover:shadow-md rounded-xl"
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
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalRef={modalRef}
        curriculumsOfBatchData={curriculumsOfBatchData}
        batch_id={batch_id}
      />
      <IndexModel
        isIndexOpen={isIndexOpen}
        setIsIndexOpen={setIsIndexOpen}
        indexModalRef={indexModalRef}
        batch_id={batch_id}
        studentsWithoutIndexNumberData={studentsWithoutIndexNumberData}
      />
    </div>
  );
};

export default batches;
