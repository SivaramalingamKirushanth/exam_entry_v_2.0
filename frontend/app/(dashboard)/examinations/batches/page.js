import BatchesDetails from "./BatchesDetails";

const batches = () => {
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[85%] lg:w-[80%]">
        <BatchesDetails />
      </div>
    </div>
  );
};

export default batches;
