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
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/utils/useUser";
import { useQuery } from "@tanstack/react-query";
import { getBathchesByStudent } from "@/utils/apiRequests/batch.api";
import { useEffect, useState } from "react";
import { numberToOrdinalWord, parseString } from "@/utils/functions";
import { getDegreeByShort } from "@/utils/apiRequests/course.api";
import CryptoJS from "crypto-js";

const dashboard = () => {
  const pathname = usePathname();
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  const { data: bathchesOfStudentData, refetch: batchDataRefetch } = useQuery({
    queryFn: getBathchesByStudent,
    queryKey: ["batchesOfStudent"],
    enabled: false,
  });

  const handleNavigate = () => {};

  const onApplyClick = (e) => {
    e.preventDefault();
    const deg = e.currentTarget.dataset.deg;
    const sem = e.currentTarget.dataset.sem;
    const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET;
    const degEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(deg),
      secretKey
    ).toString();
    const semEncryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sem),
      secretKey
    ).toString();

    router.push(
      `/home/form?deg=${encodeURIComponent(
        degEncryptedData
      )}&sem=${encodeURIComponent(semEncryptedData)}`
    );
  };

  if (user?.role_id == "1") {
    return;
  }
  if (user?.role_id == "2") {
    return;
  }
  if (user?.role_id == "3") {
    return;
  }
  if (user?.role_id == "4") {
    return (
      <div className="flex justify-end md:justify-center">
        <div className="md:w-[70%] flex gap-6 flex-wrap">
          <Link
            href={`${pathname}/it3113`}
            className="w-[30%] hover:shadow-md rounded-xl"
          >
            <Card>
              <CardHeader>
                <CardTitle>IT3213</CardTitle>
                <CardDescription>56 Entries</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link
            href={`${pathname}/it1242`}
            className="w-[30%] hover:shadow-md rounded-xl"
          >
            <Card>
              <CardHeader>
                <CardTitle>IT1242</CardTitle>
                <CardDescription>80 Entries</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  if (user?.role_id == "5") {
    batchDataRefetch();
    return (
      <div className="flex justify-end md:justify-center">
        <div className="md:w-[70%] rounded-md bg-white">
          <Table>
            <TableCaption>A list of your recent examinations.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Examination</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[230px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bathchesOfStudentData?.length &&
                bathchesOfStudentData?.map((batch) => {
                  const decodeBatchCode = parseString(batch.batch_code);
                  const level_ordinal = numberToOrdinalWord(
                    decodeBatchCode.level
                  );
                  const sem_ordinal = numberToOrdinalWord(
                    decodeBatchCode.sem_no
                  );

                  return (
                    <TableRow key={batch.batch_id}>
                      <TableCell className="font-medium uppercase">
                        {level_ordinal} examination in {batch.deg_name} -{" "}
                        {decodeBatchCode.academic_year} {sem_ordinal}
                        &nbsp;semester
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            batch.applied_to_exam == "true" &&
                            batch.admission_ready == "true"
                              ? "success"
                              : batch.applied_to_exam == "true" &&
                                batch.admission_ready == "false"
                              ? "pending"
                              : "active"
                          }
                          className="uppercase"
                        >
                          {batch.applied_to_exam == "true" &&
                          batch.admission_ready == "true"
                            ? "done"
                            : batch.applied_to_exam == "true" &&
                              batch.admission_ready == "false"
                            ? "pending"
                            : "active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-around items-center h-full">
                          <Button
                            variant="outline"
                            className="uppercase"
                            disabled={batch.applied_to_exam == "true"}
                            data-deg={`${level_ordinal} examination in ${batch.deg_name} - ${decodeBatchCode.academic_year}`}
                            data-sem={`${sem_ordinal} semester`}
                            onClick={(e) => onApplyClick(e)}
                          >
                            apply
                          </Button>
                          <Link href="#">
                            <Button
                              variant="outline"
                              className="uppercase"
                              disabled={batch.admission_ready == "false"}
                            >
                              download
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
};

export default dashboard;
