
import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/authThunks";

const Left = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    // TODO: Upload to server logic here
  };

  return (
    <>
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
            <button onClick={() => setShowModal(true)} title="Upload Photo">
              <FaUserCircle className="text-3xl text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[250px] h-[250px] rounded-xl shadow-lg flex flex-col items-center justify-center gap-4 p-4 relative">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <FaUserCircle className="text-[80px] text-gray-500" />
            <label className="text-blue-600 cursor-pointer">
              Upload your image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <label className="text-blue-600 cursor-pointer">
              Take a photo
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default Left;
// import React from "react";
// import { FiLogOut } from "react-icons/fi"; // Logout icon
// import { FaUserCircle } from "react-icons/fa"; // Default user icon
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../../redux/authThunks";

// const Left = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get user from Redux store
//   const { user } = useSelector((state) => state.auth);

//   console.log(user, "this is user in left");
//   console.log(user.profile_picture, "this is user in left");
  
//   const handleLogout = () => {
//     dispatch(logoutUser())
//       .unwrap()
//       .then(() => {
//         navigate("/Login");
//       })
//       .catch((err) => {
//         console.error("Logout failed:", err);
//       });
//   };

//   return (
//     <div className="w-full md:w-[5%] bg-gray-100 text-black h-screen flex flex-col justify-between items-center py-4">
//       <div />

//       {/* Bottom icons */}
//       <div className="flex flex-col items-center gap-6 mb-4">
//         {/* Logout Button */}
//         <button title="Logout" onClick={handleLogout}>
//           <FiLogOut className="text-3xl hover:text-red-300 transition-all" />
//         </button>

//         {/* Conditional User Image or Icon */}
//         {user?.profile_picture ? (
//           <img
//             src={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture.replace(/\\/g, "/")}`}
//             alt="Profile"
//             className="w-10 h-10 rounded-full object-cover border border-gray-300"
//           />
//         ) : (
//           <FaUserCircle className="text-3xl text-gray-600" />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Left;
