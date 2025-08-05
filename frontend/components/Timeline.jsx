const Timeline = ({ timelineData }) => {
  const options = {
    dateStyle: "long",
    timeStyle: "short",
  };

  return (
    <ol className="relative border-s border-gray-700 dark:border-gray-700 max-h-48 overflow-auto pr-1">
      {timelineData?.map((item, index) => (
        <li key={index} className="mb-10 ms-4">
          <div className="absolute w-3 h-3 bg-gray-700 rounded-full mt-[0.45rem] -start-[0.15rem] border border-white dark:border-gray-900 dark:bg-gray-700"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-700 dark:text-gray-800">
            {new Intl.DateTimeFormat("en-US", options).format(
              new Date(item.date_time)
            )}
          </time>

          <div className="mb-1 text-base font-normal text-gray-500 dark:text-gray-500">
            Changed to{" "}
            <span className="font-semibold">
              {item.status_to == "true" ? "Eligible" : "Not Eligible"}
            </span>
          </div>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-600">
            {item.remark}
          </p>
          <p className="mb-4 text-sm italic text-end text-gray-500 dark:text-gray-600">
            {item.user_name}
          </p>
        </li>
      ))}
    </ol>
  );
};

export default Timeline;
