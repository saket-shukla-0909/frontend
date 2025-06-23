import React from "react";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { FaUserCircle } from "react-icons/fa"; // Optional user icon

const Logout = () => {
  return (
    <div className="w-full md:w-[5%] bg-blue-400 text-white h-screen flex flex-col justify-between items-center py-4">

      <div/>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-6 mb-4">
    
        {/* Logout Button */}
        <button title="Logout">
          <FiLogOut className="text-3xl hover:text-red-300 transition-all" />
        </button>

        {/* User Image/Icon */}
        <FaUserCircle className="text-3xl" />
      </div>
    </div>
  );
};

export default Logout;