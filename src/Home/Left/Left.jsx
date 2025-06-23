import React from "react";
import { FiLogOut } from "react-icons/fi"; // Logout icon
import { FaUserCircle } from "react-icons/fa"; // Default user icon
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/authThunks";

const Left = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  console.log(user, "this is user in left");
  console.log(user.profile_picture, "this is user in left");
  
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/Login");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  return (
    <div className="w-full md:w-[5%] bg-gray-100 text-black h-screen flex flex-col justify-between items-center py-4">
      <div />

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-6 mb-4">
        {/* Logout Button */}
        <button title="Logout" onClick={handleLogout}>
          <FiLogOut className="text-3xl hover:text-red-300 transition-all" />
        </button>

        {/* Conditional User Image or Icon */}
        {user?.profile_picture ? (
          <img
            src={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture.replace(/\\/g, "/")}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <FaUserCircle className="text-3xl text-gray-600" />
        )}
      </div>
    </div>
  );
};

export default Left;
