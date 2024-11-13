import StudentDetails from "./StudentDetails";

const students = () => {
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[80%] ">
        <StudentDetails />
      </div>
    </div>
  );
};

export default students;
