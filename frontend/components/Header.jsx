import Image from "next/image";
import UoV_Logo_C from "./../images/UoV_Logo_C.png";

const Header = () => {
  return (
    <div className="fixed h-14 sm:h-16 md:h-18 lg:h-20 z-50 w-full bg-white flex items-center px-5">
      <Image
        src={UoV_Logo_C}
        alt="UOV logo"
        className="sm:absolute h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px] sm:left-5"
      />
      <h1 className="uppercase grow text-lg font-semibold md:text-2xl lg:text-3xl lg:font-normal text-right sm:text-center">
        System for Examination Entry
      </h1>
    </div>
  );
};

export default Header;
