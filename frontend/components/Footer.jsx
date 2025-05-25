"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { FaGithub, FaLinkedin, FaRegTimesCircle } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";

const devs = [
  {
    name: "Chamith Jeewantha",
    regNo: "2020/ICT/18",
    github: "https://github.com/chamithjeewantha",
    linkedin: "https://www.linkedin.com/in/chamith-jeewantha-a40085296",
  },
  {
    name: "Awishka Piyumal",
    regNo: "2020/ICT/24",
    github: "https://github.com/AwishkaPiyumal",
    linkedin: "http://www.linkedin.com/in/awishka-piyumal",
  },
  {
    name: "Ilma Ismail",
    regNo: "2020/ICT/48",
    github: "https://github.com/IlmaIsmail",
    linkedin: "https://www.linkedin.com/in/ilma-ismail-243b24239",
  },
  {
    name: "Chamathka Hettiaracchi",
    regNo: "2020/ICT/57",
    github: "https://github.com/Chamathka01",
    linkedin: "https://www.linkedin.com/in/chamathka-hettiarachchi-415586317",
  },
  {
    name: "Ilma Ilmy",
    regNo: "2020/ICT/64",
    github: "https://github.com/Ilmfathima",
    linkedin: "http://www.linkedin.com/in/ilmai",
  },
  {
    name: "Achira Wijesuriya",
    regNo: "2020/ICT/101",
    github: "https://github.com/arwijesuriya",
    linkedin: "https://linkedin.com/in/arwijesuriya",
  },
];

export default function Footer() {
  const [showModel, setShowModel] = useState(false);

  return (
    <>
      <footer className="bg-[hsl(240,5.9%,10%)] text-white py-6 mt-6 text-center">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} University&nbsp;of&nbsp;Vavuniya.
            All&nbsp;rights&nbsp;reserved.
          </p>
          <button
            onClick={() => setShowModel(true)}
            className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 mt-3 text-white shadow-lg overflow-hidden border border-transparent mb-10 sm:mb-4"
          >
            {/* Animated Gradient Border Effect */}
            <span className="absolute inset-0 rounded-md p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x" />

            {/* Black Background */}
            <span className="absolute inset-[2px] bg-black backdrop-blur-md rounded-md" />

            {/* Gradient Text */}
            <span className="relative z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x bg-clip-text text-transparent">
              Meet the Team
            </span>
          </button>
        </div>
      </footer>

      {showModel && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-md transition-all duration-300 ease-out"
          id="modelWindow"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModel(false);
            }
          }}
        >
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-xl w-[95%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%] transition-transform transform scale-90 duration-500 ease-out model-animate max-h-[90vh] overflow-hidden flex flex-col">
            {/* Sticky Header */}
            <div className="px-6 sm:px-8 py-4 border-b border-gray-100 sticky top-0 bg-white bg-opacity-95 backdrop-blur-sm z-10">
              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Meet the Team
                </h2>
                <button
                  onClick={() => setShowModel(false)}
                  className="absolute -top-1 -right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close model"
                >
                  <FaRegTimesCircle className="h-6 w-6 text-pink-500 hover:text-purple-500" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-3">
              {/* Guided by section */}
              <div className="mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full mr-4"></div>
                  <p className="text-sm font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">
                    Guided by
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full ml-4"></div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex flex-col sm:items-center">
                    <p className="font-bold text-lg text-gray-800">
                      Dr. S. Kirushanth
                    </p>
                    <p className="text-sm text-gray-600 sm:text-center">
                      Senior Lecturer, Department of Physical Science, Faculty
                      of Applied Science
                    </p>
                    <a
                      href="mailto:SivaramalingamK@vau.ac.lk"
                      className="text-sm text-blue-500 hover:text-blue-700 transition-colors sm:text-center mt-1"
                    >
                      SivaramalingamK@vau.ac.lk
                    </a>
                  </div>
                </div>
              </div>

              {/* Developed by section */}
              <div>
                <div className="flex items-center justify-center mb-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full mr-4"></div>
                  <p className="text-sm font-semibold text-gray-500 whitespace-nowrap uppercase tracking-wider">
                    Developed by
                  </p>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-full ml-4"></div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-purple-200 transition-all">
                  <div className="flex flex-col sm:items-center">
                    <p className="font-bold text-md text-gray-800">
                      Mr. Zahran Liyasdeen
                    </p>
                    <p className="text-sm text-gray-600">2020/ICT/119</p>
                    <div className="flex items-center gap-x-4 mt-1">
                      <a
                        href="mailto:zahranliyasdeen@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <BiLogoGmail size={22} />
                      </a>
                      <a
                        href="https://github.com/jallu-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaGithub size={20} />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/zahran-liyasdeen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaLinkedin size={20} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Team members grid */}
                <div className="text-xs text-gray-500 mt-6 bg-gray-50 p-4 rounded-md border border-gray-100">
                  <p className="mb-1 font-medium text-gray-600">
                    <em>
                      Other Members who worked on Exam Entry System v1.0
                      (initial group project):
                    </em>
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Chamith Jeewantha (2020/ICT/18)</li>
                    <li>Awishka Piyumal (2020/ICT/24)</li>
                    <li>Ilma Ismail (2020/ICT/48)</li>
                    <li>Chamathka Hettiaracchi (2020/ICT/57)</li>
                    <li>Ilma Ilmy (2020/ICT/64)</li>
                    <li>Achira Wijesuriya (2020/ICT/101)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
