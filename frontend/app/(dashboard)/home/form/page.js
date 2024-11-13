import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Form = () => {
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[60%]">
        <div className="text-center capitalize font-bold">
          <h1>Faculty of Applied Science</h1>
          <h1>Department of Physical Science</h1>
          <h1>Third Examination in Information Technology - 2023</h1>
          <h1>First Semester - January 2025</h1>
        </div>
        <div className="mt-3 flex justify-between text-sm font-semibold">
          <p>
            Reg No: <span className="uppercase p-2 bg-white">2020/ICT/119</span>
          </p>
          <p>
            Reg No: <span className="uppercase p-2 bg-white">IT16110</span>
          </p>
        </div>
        <div className="my-10 flex flex-col items-center gap-2">
          <div className="flex px-3 py-4 bg-white rounded-lg justify-between w-full md:w-[80%]">
            <h1 className="uppercase w-1/6 shrink-0">IT3113(P)</h1>
            <h1 className="capitalize w-4/6 shrink-0">
              Knowledge Base System and Logic Programming (P)
            </h1>
            <h1 className="capitalize w-1/6 shrink-0 text-center">
              <Badge variant="success">Eligible</Badge>
            </h1>
          </div>
          <div className="flex px-3 py-4 bg-white rounded-lg justify-between w-full md:w-[80%]">
            <h1 className="uppercase w-1/6 shrink-0">IT3113(T)</h1>
            <h1 className="capitalize w-4/6 shrink-0">
              Knowledge Base System and Logic Programming (T)
            </h1>
            <h1 className="capitalize w-1/6 shrink-0 text-center">
              <Badge variant="failure">Not Eligible</Badge>
            </h1>
          </div>
          <div className="flex px-3 py-4 bg-white rounded-lg justify-between w-full md:w-[80%]">
            <h1 className="uppercase w-1/6 shrink-0">IT3113(P)</h1>
            <h1 className="capitalize w-4/6 shrink-0">
              Knowledge Base System and Logic Programming (P)
            </h1>
            <h1 className="capitalize w-1/6 shrink-0 text-center">
              <Badge variant="success">Eligible</Badge>
            </h1>
          </div>
          <div className="flex px-3 py-4 bg-white rounded-lg justify-between w-full md:w-[80%]">
            <h1 className="uppercase w-1/6 shrink-0">IT3113(T)</h1>
            <h1 className="capitalize w-4/6 shrink-0">
              Knowledge Base System and Logic Programming (T)
            </h1>
            <h1 className="capitalize w-1/6 shrink-0 text-center">
              <Badge variant="failure">Not Eligible</Badge>
            </h1>
          </div>
          <div className="flex px-3 py-4 bg-white rounded-lg justify-between w-full md:w-[80%]">
            <h1 className="uppercase w-1/6 shrink-0">IT3113(P)</h1>
            <h1 className="capitalize w-4/6 shrink-0">
              Knowledge Base System and Logic Programming (P)
            </h1>
            <h1 className="capitalize w-1/6 shrink-0 text-center">
              <Badge variant="success">Eligible</Badge>
            </h1>
          </div>
          <div className="flex px-3 py-4 bg-white rounded-lg justify-between w-full md:w-[80%]">
            <h1 className="uppercase w-1/6 shrink-0">IT3113(T)</h1>
            <h1 className="capitalize w-4/6 shrink-0">
              Knowledge Base System and Logic Programming (T)
            </h1>
            <h1 className="capitalize w-1/6 shrink-0 text-center">
              <Badge variant="failure">Not Eligible</Badge>
            </h1>
          </div>
        </div>
        <div className="flex justify-end">
          <Link href="/home">
            <Button>Submit</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;
