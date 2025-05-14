import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RequestDetails from "./RequestDetails";
import { Badge } from "@/components/ui/badge";

const Batches = () => {
  return (
    <div className="flex justify-end md:justify-center">
      <div className="w-[80%] md:w-[85%] lg:w-[90%]">
        <table className="table-auto border border-gray-300 border-separate  w-full rounded-md">
          <thead>
            <tr>
              <th
                rowSpan={3}
                className="text-slate-500 px-2 border border-gray-300 font-semibold"
              >
                Username
              </th>
              <th
                colSpan={2}
                className="text-slate-500 py-2 border border-gray-300 font-semibold"
              >
                Medical
              </th>
              <th
                colSpan={2}
                className="text-slate-500 py-2 border border-gray-300 font-semibold"
              >
                Resit
              </th>
              <th
                rowSpan={3}
                className="text-slate-500 px-2 border border-gray-300 font-semibold"
              >
                Action
              </th>
            </tr>
            <tr>
              <th className="text-slate-500 py-2 border border-gray-300 font-semibold">
                Subjects
              </th>
              <th className="text-slate-500 py-2 border border-gray-300 font-semibold">
                Reference
              </th>
              <th className="text-slate-500 py-2 border border-gray-300 font-semibold ">
                Subjects
              </th>
              <th className="text-slate-500 py-2 border border-gray-300  font-semibold">
                Reference
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-3">
              <td colspan="6"></td>
            </tr>
            <tr className="bg-white">
              <td
                className="text-slate-500 px-2 border border-gray-300"
                rowSpan={3}
              >
                2020/ICT/119
              </td>
              <td className="text-slate-500 p-2 border border-gray-300">
                <span className="flex flex-col items-start justify-start">
                  {[1, 1, 1, 1, 1, 1, 1, 1].map((item) => (
                    <Badge className="">gdfgsgd-dsfasdhsadhiusdh</Badge>
                  ))}
                </span>
              </td>
              <td className="text-slate-500 p-2 border border-gray-300">
                35435465755756756
              </td>
              <td className="text-slate-500 p-2 border border-gray-300">
                {[1, 1, 1, 1, 1, 1, 1, 1].map((item) => (
                  <Badge className="">gdfgsgd-dsfasdhsadhiusdh</Badge>
                ))}
              </td>
              <td className="text-slate-500 p-2 border border-gray-300">
                32543546565756767
              </td>
              <td
                className="text-slate-500 px-2 border border-gray-300"
                rowSpan={3}
              >
                <button>proceed</button>
              </td>
            </tr>
            <tr className="bg-white border border-gray-300">
              <td className="text-slate-500 text-center pt-3 pb-5 border border-gray-300">
                <input type="checkbox" />
              </td>
              <td className="text-slate-500 text-center pt-3 pb-5 border border-gray-300">
                <input type="checkbox" />
              </td>
              <td className="text-slate-500 text-center pt-3 pb-5 border border-gray-300">
                <input type="checkbox" />
              </td>
              <td className="text-slate-500 text-center pt-3 pb-5 border border-gray-300">
                <input type="checkbox" />
              </td>
            </tr>
            <tr className="bg-white">
              <td
                className="text-slate-500 text-center pt-3 pb-5 font-semibold border border-gray-300"
                colSpan={4}
              >
                Third Examination Information Technology- 2023- First Semester
              </td>
            </tr>

            <tr className="h-5">
              <td colspan="6"></td>
            </tr>
            <tr className="bg-white rounded-md">
              <td className="text-slate-500 px-2" rowSpan={3}>
                2020/ICT/119
              </td>
              <td className="text-slate-500 pt-5">
                {[1, 1, 1, 1, 1, 1, 1].map((item) => (
                  <Badge className="">gdfgsgd-dsfasdhsadhiusdh</Badge>
                ))}
              </td>
              <td className="text-slate-500 pt-5">35435465755756756</td>
              <td className="text-slate-500 pt-5">
                {[1, 1, 1, 1, 1, 1].map((item) => (
                  <Badge className="">gdfgsgd-dsfasdhsadhiusdh</Badge>
                ))}
              </td>
              <td className="text-slate-500 pt-5">32543546565756767</td>
              <td className="text-slate-500 px-2" rowSpan={3}>
                <button>proceed</button>
              </td>
            </tr>
            <tr className="bg-white">
              <td
                className="text-slate-500 text-center pt-3 pb-5 font-semibold"
                colSpan={4}
              >
                Third Examination Information Technology- 2023- First Semester
              </td>
            </tr>
            <tr className="h-3">
              <td colspan="6"></td>
            </tr>
          </tbody>
        </table>
        {/* <RequestDetails /> */}
      </div>
    </div>
  );
};

export default Batches;
