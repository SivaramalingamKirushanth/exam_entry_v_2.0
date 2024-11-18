import DepartmentDetails from "./DepartmentDetails";

const departments = () => {
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[80%] ">
        <DepartmentDetails />
      </div>
    </div>
  );
};

export default departments;
