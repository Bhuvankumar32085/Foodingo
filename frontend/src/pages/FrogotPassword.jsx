import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ImSpinner11 } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const FrogotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOpt] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");

  const { isLogging } = useSelector((store) => store.user);
  useEffect(() => {
    if (isLogging) {
      navigate("/");
    }
  }, [isLogging, navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    // backend API call here
    try {
      const res = await instance.post("/auth/send-Otp", { email });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (error) {
      console.error(error.response.data.message || "send-Otp error");
      toast.error(error.response.data.message || "send-Otp error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    // backend API call here
    try {
      const res = await instance.post("/auth/virify-Otp", { email, otp });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(3);
      }
    } catch (error) {
      console.error(error.response.data.message || "virify-Otp error");
      toast.error(error.response.data.message || "virify-Otp error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    // backend API call here

    if (newPassword != conformPassword) {
      toast.error("Password does not match");
    }

    try {
      const res = await instance.put("/auth/reset-password", {
        email,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error.response.data.message || "reset-password error");
      toast.error(error.response.data.message || "reset-password error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center w-full justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">
        <div className="flex items-center gap-4">
          <IoMdArrowRoundBack
            onClick={() => navigate("/login")}
            className="text-[#ff4d2d] cursor-pointer"
            size={30}
          />
          <h1 className="text-3xl font-bold text-center text-[#ff4d2d]">
            Forgot password
          </h1>
        </div>
        {step == 1 && (
          <form onSubmit={handleSendOtp} className="mt-3">
            <label
              className="text-sm text-gray-700 font-semibold"
              htmlFor="email"
            >
              Email :
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter Your Email"
              className="border w-full rounded-lg p-2 pl-3 mt-1 mb-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full p-2 rounded-lg text-white font-semibold cursor-pointer bg-[#ff4d2d]"
            >
              {loading ? (
                <ImSpinner11 className="mx-auto animate-spin" />
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {step == 2 && (
          <form onSubmit={handleVerifyOtp} className="mt-3">
            <label
              className="text-sm text-gray-700 font-semibold"
              htmlFor="OTP"
            >
              OTP :
            </label>
            <input
              id="OTP"
              type="text"
              name="otp"
              onChange={(e) => setOpt(e.target.value)}
              value={otp}
              placeholder="Enter Your OTP"
              className="border w-full rounded-lg p-2 pl-3 mt-1 mb-3"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full p-2 rounded-lg text-white font-semibold cursor-pointer bg-[#ff4d2d]"
            >
              {loading ? (
                <ImSpinner11 className="mx-auto animate-spin" />
              ) : (
                "Verify"
              )}
            </button>
          </form>
        )}

        {step == 3 && (
          <form onSubmit={handleResetPassword} className="mt-3">
            <div className="relative">
              <label
                className="text-sm text-gray-700 font-semibold"
                htmlFor="NewPassword"
              >
                New Password :
              </label>
              <input
                id="NewPassword"
                type={showPassword ? `text` : "password"}
                name="newPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder="Enter Your new Password"
                className="border w-full rounded-lg p-2 pl-3 mt-1 "
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-1 top-10 cursor-pointer"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="relative mt-3">
              <label
                className="text-sm text-gray-700 font-semibold"
                htmlFor="ConformPassword"
              >
                Conform Password :
              </label>
              <input
                id="ConformPassword"
                type={showPassword2 ? `text` : "password"}
                name="conformPassword"
                onChange={(e) => setConformPassword(e.target.value)}
                value={conformPassword}
                placeholder="Enter Your Old Password"
                className="border w-full rounded-lg p-2 pl-3 mt-1 "
              />

              <button
                type="button"
                onClick={() => setShowPassword2((prev) => !prev)}
                className="absolute right-1 top-10 cursor-pointer"
              >
                {showPassword2 ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full p-2 rounded-lg text-white font-semibold cursor-pointer bg-[#ff4d2d]"
            >
              {loading ? (
                <ImSpinner11 className="mx-auto animate-spin" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FrogotPassword;
