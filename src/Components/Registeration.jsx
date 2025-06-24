import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../redux/authThunks";
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt , FaRegCalendarAlt, FaUserCircle } from "react-icons/fa";


const Registration = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/Login" || registered;
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    dob: "",
  });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};



 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData, "formData");

    if (!isLogin) {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        setRegistered(true); // ✅ Show login form now
        setFormData({
          username: "",
          email: "",
          password: "",
          full_name: "",
          phone_number: "",
          dob: "",
        });
        return;
      }
    }else {
      const loginData = {
        phone_number: formData.phone_number,
        password: formData.password,
      };
      console.log(loginData, "this is login data");

      const resultAction = await dispatch(loginUser(loginData));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/Home"); // ✅ Go to home after successful login
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-800 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/Images/ChatIn.png"
            alt="Logo"
            className="w-16 h-16 rounded-full"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Show all fields only if NOT login */}
          {!isLogin && (
            <>
              <div className="flex items-center border rounded px-2">
                <FaUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="input w-full border-none focus:outline-none"
                  onChange={handleChange}
                  value={formData.username}
                />
              </div>
              <div className="flex items-center border rounded px-2">
                <FaEnvelope className="text-gray-500 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input w-full border-none focus:outline-none"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="flex items-center border rounded px-2">
                <FaUserCircle className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Full Name"
                  className="input w-full border-none focus:outline-none"
                  onChange={handleChange}
                  value={formData.full_name}
                />
              </div>
            </>
          )}
                        {/* Common Fields */}
          <div className="flex items-center border rounded px-2">
            <FaPhoneAlt  className="text-gray-500 mr-2" />
            <input
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              className="input w-full border-none focus:outline-none"
              onChange={handleChange}
              value={formData.phone_number}
            />
          </div>
          <div className="flex items-center border rounded px-2">
            <FaLock className="text-gray-500 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input w-full border-none focus:outline-none"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

      {!isLogin && (
        <>
            <div className="flex items-center border rounded px-2">
              <FaRegCalendarAlt className="text-gray-500 mr-2" />
              <input
                type="date"
                name="dob"
                className="input w-full border-none focus:outline-none"
                onChange={handleChange}
                value={formData.dob}
              />
            </div>
      </>)}

          

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 cursor-pointer"
          >
            {isLogin ? "Login" : "Register"}
          </button>


        </form>

        {/* Toggle Links */}
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                to="/SignUp"
                className="text-black hover:underline font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                to="/Login"
                className="text-black hover:underline font-medium"
              >
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Registration;
