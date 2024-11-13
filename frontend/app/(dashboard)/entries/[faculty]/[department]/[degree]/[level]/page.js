import UserDetails from "./UserDetails";

const users = () => {
  return (
    <div className="flex justify-end md:justify-center">
      <div className="md:w-[70%] ">
        <UserDetails />
      </div>
    </div>
  );
};

export default users;
