import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/utils/functions";
import { useEffect } from "react";

const ExamApplicationPrint = ({
  applicationData,
  examName,
  subjects = [],
  onRenderComplete,
}) => {
  const activeSubjects =
    applicationData?.subjects?.filter((obj) =>
      subjects?.some((item) => item.value == obj.sub_id)
    ) || [];

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (onRenderComplete) {
      const timer = setTimeout(() => {
        onRenderComplete();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [onRenderComplete]);

  return (
    <div
      className="w-full bg-white"
      style={{
        width: "190mm",
        minHeight: "270mm",
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div className="p-4">
        <div className="text-center border-b-2 border-gray-300 pb-3 mb-6">
          <h2 className="text-sm font-semibold uppercase mb-1">
            Faculty of {applicationData?.f_name}
          </h2>
          <h3 className="text-xs font-medium">{titleCase(examName)}</h3>
          <div className="mt-2 text-xs text-gray-600">
            Application Date: {currentDate}
          </div>
        </div>

        {/* Student Information */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 uppercase border-b border-gray-200 pb-1">
            Student Information
          </h4>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
            <div className="flex">
              <span className="font-semibold w-20 uppercase">Reg No:</span>
              <span className="uppercase">
                {applicationData?.user_name || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-20 uppercase">Type:</span>
              <span className="uppercase">Medical</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-20 uppercase">Name:</span>
              <span className="uppercase">{applicationData?.name || "-"}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-20 uppercase">Index No:</span>
              <span className="uppercase">
                {applicationData?.index_num || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Subjects Applied */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 uppercase border-b border-gray-200 pb-1">
            Subjects Applied For Examination
          </h4>

          {/* Fixed Table Structure */}
          <table className="w-full border-collapse border border-gray-300 text-xs">
            {/* Table Header */}
            <thead>
              <tr>
                <th
                  className="border border-gray-300 p-2 text-center font-semibold uppercase"
                  style={{ width: "80px" }}
                >
                  Subject Code
                </th>
                <th
                  className="border border-gray-300 p-2 text-center font-semibold uppercase"
                  style={{ width: "340px" }}
                >
                  Subject Name
                </th>
              </tr>
            </thead>

            {/* Table Body - Always show at least 10 rows */}
            <tbody>
              {Array.from({ length: Math.max(10, activeSubjects.length) }).map(
                (_, index) => {
                  const subject = activeSubjects[index];
                  return (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center uppercase font-medium">
                        {subject?.sub_code || ""}
                      </td>
                      <td className="border border-gray-300 p-2 text-left capitalize">
                        {subject?.sub_name || ""}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          <div className="mt-3 p-3 rounded border">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-semibold">Total Subjects Applied:</span>
                <span className="ml-2 text-sm font-bold">
                  {activeSubjects.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>This is a computer-generated document</p>
          <p className="mt-1">Generated on {currentDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ExamApplicationPrint;
