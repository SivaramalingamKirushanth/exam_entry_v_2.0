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

const dashboard = () => {
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
            <TableRow>
              <TableCell className="font-medium uppercase">
                2nd year second examination
              </TableCell>
              <TableCell>
                <Badge variant="active">NOT APPLIED</Badge>
              </TableCell>
              <TableCell className="flex justify-around">
                <Link href="home/form">
                  <Button variant="outline">APPLY</Button>
                </Link>
                <Link href="#">
                  <Button variant="outline">DOWNLOAD</Button>
                </Link>
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
                <Link href="home/form">
                  <Button variant="outline">APPLY</Button>
                </Link>
                <Link href="#">
                  <Button variant="outline">DOWNLOAD</Button>
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default dashboard;
