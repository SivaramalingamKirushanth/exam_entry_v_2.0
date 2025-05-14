const Deadlines = ({ openDateData, deadlineObj }) => {
  return (
    <div className="flex px-1 mb-4 text-xs lg:text-sm">
      <div className="self-center text-wrap w-16 text-center text-slate-600">
        {new Date(openDateData?.application_open)
          .toString()
          .slice(
            4,
            new Date(openDateData?.application_open).toString().indexOf("GMT")
          )}
      </div>
      <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
        <div className="bg-gradient-to-r from-green-100 to-blue-300 h-1 w-full mt-6 mb-1"></div>
        <div className="bg-gradient-to-r from-green-100 to-green-500 h-1 w-full"></div>
        <div className="flex justify-end self-stretch gap-3">
          <div className="text-green-900 font-serif ">Student Submission</div>
          <div className="bg-green-500 h-6 w-1"></div>
        </div>
        <div className="absolute right-0 translate-x-1/2 bottom-0 text-green-700  font-semibold  font-mono">
          {new Date(deadlineObj.stu_deadline)
            .toString()
            .slice(
              4,
              new Date(deadlineObj.stu_deadline).toString().indexOf("GMT")
            )}
        </div>
      </div>
      <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
        <div className="absolute right-0 translate-x-1/2 top-0 text-blue-700  font-semibold  font-mono">
          {new Date(deadlineObj.lec_deadline)
            .toString()
            .slice(
              4,
              new Date(deadlineObj.lec_deadline).toString().indexOf("GMT")
            )}{" "}
        </div>
        <div className="flex justify-end self-stretch gap-3 items-end">
          <div className="text-blue-900 font-serif">Lecturer Review</div>
          <div className="bg-blue-500 h-6 w-1"></div>
        </div>

        <div className="bg-gradient-to-r from-blue-300 to-blue-500 h-1 w-full"></div>
      </div>
      <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-500 h-1 w-full mt-8"></div>
        <div className="flex justify-end self-stretch gap-3 ">
          <div className="text-yellow-900 font-serif">HOD Approval</div>
          <div className="bg-yellow-500 h-6 w-1"></div>
        </div>
        <div className="absolute right-0 translate-x-1/2 bottom-0 text-yellow-700  font-semibold  font-mono">
          {new Date(deadlineObj.hod_deadline)
            .toString()
            .slice(
              4,
              new Date(deadlineObj.hod_deadline).toString().indexOf("GMT")
            )}{" "}
        </div>
      </div>
      <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
        <div className="absolute right-0 translate-x-1/2 top-0 text-orange-700  font-semibold  font-mono">
          {new Date(deadlineObj.dean_deadline)
            .toString()
            .slice(
              4,
              new Date(deadlineObj.dean_deadline).toString().indexOf("GMT")
            )}
        </div>
        <div className="flex justify-end self-stretch gap-3 items-end">
          <div className="text-orange-900 font-serif">Dean Approval</div>
          <div className="bg-orange-500 h-6 w-1"></div>
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-orange-500 h-1 w-full"></div>
      </div>
      <div className="flex flex-col flex-1 shrink-0 relative py-7 items-center">
        <div className="bg-gradient-to-r from-red-100 to-red-500 h-1 w-full mt-8"></div>
        <div className="flex justify-end self-stretch gap-3 ">
          <div className="text-red-900 font-serif">Payment Processing</div>
          <div className="bg-red-500 h-6 w-1"></div>
        </div>
        <div className="absolute right-0 translate-x-1/4 bottom-0 text-red-700  font-semibold  font-mono">
          {new Date(openDateData?.payment_end)
            .toString()
            .slice(
              4,
              new Date(openDateData?.payment_end).toString().indexOf("GMT")
            )}
        </div>
      </div>
    </div>
  );
};

export default Deadlines;
