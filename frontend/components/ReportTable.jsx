import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

const ReportTable = ({ subjects, data, exam_type, batch_id }) => {
  const totObj = {};

  Object.values(data).forEach((stuArr) =>
    stuArr.forEach((subObj) => {
      if (subObj.eligibility == "true") {
        if (totObj.hasOwnProperty(subObj.sub_id)) {
          totObj[subObj.sub_id]++;
        } else {
          totObj[subObj.sub_id] = 1;
        }
      }
    })
  );

  return (
    <Table className="bg-white">
      <TableHeader>
        <TableRow className="bg-black hover:bg-black">
          <TableHead className="w-[100px] text-white">Index No</TableHead>

          {subjects?.map((obj) => (
            <TableHead
              className="text-white"
              key={"header" + obj.sub_id + exam_type + batch_id}
            >
              {obj.sub_code}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(data).map(([index_num, subObjArr]) => (
          <TableRow key={index_num + exam_type}>
            <TableCell>{index_num}</TableCell>
            {subjects?.map((obj) => (
              <TableCell
                key={"body" + index_num + obj.sub_id + exam_type + batch_id}
              >
                {subObjArr.some((subObj) => subObj.sub_id == obj.sub_id) ? (
                  subObjArr.find((subObj) => subObj.sub_id == obj.sub_id)
                    .eligibility == "true" ? (
                    <h1 className="justify-center flex">
                      <FaCheck />
                    </h1>
                  ) : (
                    <h1 className="justify-center flex">
                      <FaTimes />
                    </h1>
                  )
                ) : (
                  <h1 className="justify-center flex">
                    <FaTimes />
                  </h1>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow className="bg-zinc-200">
          <TableCell className="font-bold">Total</TableCell>
          {subjects?.map((obj) => (
            <TableCell key={"total" + obj.sub_id + exam_type + batch_id}>
              <h1 className="justify-center flex font-bold">
                {totObj[obj.sub_id] ? totObj[obj.sub_id] : 0}
              </h1>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default ReportTable;
