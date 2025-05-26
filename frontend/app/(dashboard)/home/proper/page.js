"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getBatchesByStudent } from "@/utils/apiRequests/batch.api";
import { useEffect, useState } from "react";
import { numberToOrdinalWord } from "@/utils/functions";
import CryptoJS from "crypto-js";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const StudentHome = () => {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  const onApplyClick = (e) => {
    e.preventDefault();
    const deg = e.currentTarget.dataset.deg;
    const degEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(deg),
      "uov"
    ).toString();

    router.push(
      `/home/proper/form?deg=${encodeURIComponent(degEncryptedData)}`
    );
  };

  const {
    data: bathchesOfStudentData,
    isLoading: isBathchesOfStudentLoading,
    isError: isBathchesOfStudentError,
  } = useQuery({
    queryFn: getBatchesByStudent,
    queryKey: ["batchesOfStudent"],
  });

  return (
    <div className="flex justify-center relative">
      <div
        className={`${
          generating ? "fixed" : "hidden"
        } left-0 top-0 w-full h-full flex justify-center items-center bg-white/35 z-50`}
      >
        <img
          className="w-20 h-20 animate-spin "
          src="https://www.svgrepo.com/show/491270/loading-spinner.svg"
          alt="Loading icon"
        />
      </div>

      <div className="hidden sm:block w-[80%] md:w-[85%] lg:w-[70%] rounded-md bg-white">
        <Table>
          <TableCaption>A list of your recent examinations.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Examination</TableHead>
              <TableHead className="max-w-[150px] text-center">
                Status
              </TableHead>
              <TableHead className="max-w-[150px] text-center">
                Actions
              </TableHead>
              <TableHead className="max-w-[150px] text-center">
                Deadline
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bathchesOfStudentData?.length && !isBathchesOfStudentError ? (
              bathchesOfStudentData?.map((batch) => {
                const level_ordinal = numberToOrdinalWord(batch.level);
                const sem_ordinal = numberToOrdinalWord(batch.sem);

                if (new Date(batch.application_open) > new Date()) {
                  return (
                    <TableRow key={batch.batch_id + Math.random() * 10}>
                      <td colSpan={4}>
                        <Skeleton className="w-full h-24 rounded-sm flex flex-col justify-center items-center text-center p-2">
                          <span className="font-semibold">
                            New exam coming soon!
                          </span>
                          <h1 className="font-base uppercase text-center">
                            {level_ordinal} examination in {batch.course_title}{" "}
                            - {batch.academic_year} - {sem_ordinal}
                            &nbsp;semester
                          </h1>
                        </Skeleton>
                      </td>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={batch.batch_id}>
                    <TableCell className="font-medium uppercase text-center">
                      {level_ordinal} examination in {batch.course_title} -{" "}
                      {batch.academic_year} - {sem_ordinal}
                      &nbsp;semester
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          batch.status === "done"
                            ? "success"
                            : batch.status === "pending"
                            ? "pending"
                            : batch.status === "expired"
                            ? "failure"
                            : "active"
                        }
                        className="uppercase"
                      >
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-around items-center h-full">
                        {batch.status == "active" ? (
                          <Button
                            variant="outline"
                            className="uppercase"
                            data-deg={`${level_ordinal} examination in ${batch.course_title} - ${batch.academic_year} - ${sem_ordinal} semester`}
                            onClick={(e) => onApplyClick(e)}
                          >
                            apply
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="uppercase"
                            disabled={true}
                          >
                            apply
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(batch.deadline)
                        .toString()
                        .slice(
                          4,
                          new Date(batch.deadline).toString().indexOf("GMT")
                        )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tr></tr>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="sm:hidden flex flex-col items-center gap-3">
        {isBathchesOfStudentLoading &&
          [1, 2, 3, 4].map((_, i) => (
            <Skeleton key={i} className="w-full h-48 rounded-md" />
          ))}

        {bathchesOfStudentData?.length && !isBathchesOfStudentError ? (
          bathchesOfStudentData?.map((batch) => {
            const level_ordinal = numberToOrdinalWord(batch.level);
            const sem_ordinal = numberToOrdinalWord(batch.sem);
            if (new Date(batch.application_open) > new Date()) {
              return (
                <Skeleton
                  key={batch.batch_id + Math.random() * 10}
                  className="w-full h-48 rounded-md flex flex-col justify-center items-center p-4 text-center"
                >
                  <span className="font-semibold">New exam coming soon!</span>
                  <h1 className="font-base uppercase text-center">
                    {level_ordinal} examination in {batch.course_title} -{" "}
                    {batch.academic_year} - {sem_ordinal}
                    &nbsp;semester
                  </h1>
                </Skeleton>
              );
            }

            return (
              <div
                className=" rounded-md text-sm bg-white p-3 gap-3 flex flex-col items-center"
                key={batch.batch_id}
              >
                <h1 className="font-medium uppercase text-center">
                  {level_ordinal} examination in {batch.course_title} -{" "}
                  {batch.academic_year} - {sem_ordinal}
                  &nbsp;semester{" "}
                  <Badge
                    variant={
                      batch.status === "done"
                        ? "success"
                        : batch.status === "pending"
                        ? "pending"
                        : batch.status === "expired"
                        ? "failure"
                        : "active"
                    }
                    className="uppercase"
                  >
                    {batch.status}
                  </Badge>
                </h1>
                <div className="flex justify-around items-center self-stretch">
                  {batch.status == "active" ? (
                    <Button
                      variant="outline"
                      className="uppercase"
                      size="sm"
                      data-deg={`${level_ordinal} examination in ${batch.course_title} - ${batch.academic_year} - ${sem_ordinal} semester`}
                      onClick={(e) => onApplyClick(e)}
                    >
                      apply
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="uppercase"
                      size="sm"
                      disabled={true}
                    >
                      apply
                    </Button>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="font-semibold">Deadline</span>
                  {new Date(batch.deadline)
                    .toString()
                    .slice(
                      4,
                      new Date(batch.deadline).toString().indexOf("GMT")
                    )}
                </div>
              </div>
            );
          })
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default StudentHome;
