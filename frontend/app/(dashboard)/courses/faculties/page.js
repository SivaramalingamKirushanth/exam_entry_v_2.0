import DialogBox from "./DialogBox";
import FacultyDetails from "./FacultyDetails";

const faculties = () => {
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[80%] ">
        <FacultyDetails />
      </div>
    </div>
  );
};

export default faculties;
