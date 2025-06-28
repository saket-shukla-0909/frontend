import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, uploadProfilePicture } from "../../redux/authThunks";

const Left = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
 

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate("/Login"))
      .catch((err) => console.error("Logout failed:", err));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(uploadProfilePicture(file))
      .unwrap()
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });
  };

  return (
    <>
      <div className="w-full md:w-[5%] bg-gray-100 text-black h-screen flex flex-col justify-between items-center py-4">
        <div />

        <div className="flex flex-col items-center gap-6 mb-4">
          {/* Logout Button */}
          <button title="Logout" onClick={handleLogout}>
            <FiLogOut className="text-3xl hover:text-red-300 transition-all" />
          </button>

          {/* Profile picture with edit functionality */}
          <div className="relative group">
            {user?.profile_picture ? (
              <>
                <img
                  src={`${process.env.REACT_APP_BASE_URL}${user.profile_picture.replace(/^.*\/uploads/, "/uploads").replace(/\\/g, "/")}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300 cursor-pointer"
                  onClick={() => setShowModal(true)}
                />

                <FaEdit
                  className="absolute bottom-0 right-0 bg-white rounded-full text-gray-600 text-xs p-[2px] border border-gray-300 cursor-pointer group-hover:opacity-100 opacity-0 transition-opacity"
                  onClick={() => setShowModal(true)}
                />
              </>
            ) : (
              <button onClick={() => setShowModal(true)} title="Upload Photo">
                <FaUserCircle className="text-3xl text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Upload */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white w-[250px] h-[250px] rounded-xl shadow-lg flex flex-col items-center justify-center gap-4 p-4 relative">
              <button
                className="absolute top-2 right-3 text-gray-600 text-xl"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
        
              {/* ✅ Show uploaded image or default icon */}
              {user?.profile_picture ? (
                <img
                  src={`${process.env.REACT_APP_BASE_URL}${user.profile_picture.replace(/^.*\/uploads/, "/uploads").replace(/\\/g, "/")}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <FaUserCircle className="text-[80px] text-gray-500" />
              )}

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
