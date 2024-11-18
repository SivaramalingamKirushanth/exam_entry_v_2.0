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
import { usePathname } from "next/navigation";

const dashboard = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-end md:justify-center">
      {0 ? (
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
              <TableRow>
                <TableCell className="font-medium uppercase">
                  2nd year second examination
                </TableCell>
                <TableCell>
                  <Badge variant="active">NOT APPLIED</Badge>
                </TableCell>
                <TableCell className="flex justify-around">
                  <Link href={`${pathname}/form`}>
                    <Button variant="outline">APPLY</Button>
                  </Link>

                  <Button variant="outline" disabled>
                    <Link href="#">DOWNLOAD </Link>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium uppercase">
                  2nd year second examination
                </TableCell>
                <TableCell>
                  <Badge variant="success">DONE</Badge>
                </TableCell>
                <TableCell className="flex justify-around">
                  <Button variant="outline" disabled>
                    <Link href={`${pathname}/form`}>APPLY </Link>
                  </Button>

                  <Button variant="outline" disabled>
                    <Link href="#">DOWNLOAD </Link>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default dashboard;
