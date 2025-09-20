import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { ImSpinner11 } from "react-icons/im";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { useSelector } from "react-redux";

const Signup = () => {
  const navigate = useNavigate();
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setotp] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    role,
  });

  const { isLogging } = useSelector((store) => store.user);
  useEffect(() => {
    if (isLogging) {
      navigate("/");
    }
  }, [isLogging, navigate]);

  const enumArra = ["user", "owner", "deliveryBoy"];

  const enumHandler = (item) => {
    setFormData({ ...formData, role: item });
    setRole(item);
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // backend API call here
    try {
      const res = await instance.post("/auth/signup", formData);
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (error) {
      console.error(error.response.data.message || "signup error");
      toast.error(error.response.data.message || "signup error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForEnterOtp = async (e) => {
    //for virify
    e.preventDefault();
    setLoading(true);
    // backend API call here
    try {
      const res = await instance.post("/auth/virify-Otp-signup", {
        otp,
        email: formData?.email,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error.response.data.message || "virify-Otp error");
      toast.error(error.response.data.message || "virify-Otp error");
    } finally {
      setLoading(false);
    }
  };

  // /google-auth

  const handleGoogleAuth = async () => {
    if (formData.mobile == "") {
      toast.error("plese provide your mobile number");
      return;
    }
    setLoading2(true);
    try {
      const provider = new GoogleAuthProvider();
      const googleRes = await signInWithPopup(auth, provider);
      const res = await instance.post("/auth/google-auth", {
        fullName: googleRes.user.displayName,
        email: googleRes.user.email,
        mobile: formData.mobile,
        role: formData.role,
        type: "signup",
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error.response.data.message || "google-auth error");
      toast.error(error.response.data.message || "google-auth error");
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: bgColor }}
    >
      {step == 1 && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
          style={{ border: `1px solid ${borderColor}` }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            Foodingo
          </h1>
          <p className="text-gray-600 mb-8">
            Create your account to get started with delicious food deliveries
          </p>

          <label
            className="text-sm text-gray-700 font-semibold"
            htmlFor="fullName"
          >
            Name :
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            onChange={changeHandler}
            value={formData.fullName}
            placeholder="Enter Your Full Name"
            className="border w-full rounded-lg p-2 pl-3 mt-1 mb-3"
          />

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
            onChange={changeHandler}
            value={formData.email}
            placeholder="Enter Your Email"
            className="border w-full rounded-lg p-2 pl-3 mt-1 mb-3"
          />

          <label
            className="text-sm text-gray-700 font-semibold"
            htmlFor="password"
          >
            Password :
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? `text` : "password"}
              name="password"
              onChange={changeHandler}
              value={formData.password}
              placeholder="Enter Your Password"
              className="border w-full rounded-lg p-2 pl-3 mt-1 mb-3 "
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-1 top-4 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <label
            className="text-sm text-gray-700 font-semibold"
            htmlFor="mobile"
          >
            Mobile :
          </label>
          <input
            id="mobile"
            type="text"
            name="mobile"
            onChange={changeHandler}
            value={formData.mobile}
            placeholder="Enter Your Mobile Number"
            className="border w-full rounded-lg p-2 pl-3 mt-1 mb-3"
          />

          {/* Role Selector */}
          <div className="flex items-center justify-between mt-4">
            {enumArra.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => enumHandler(item)}
                className={`w-[100px] p-2 rounded-md border ml-1 transition-all cursor-pointer ${
                  role === item
                    ? "bg-[#ff4d2d] text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full p-2 rounded-lg text-white font-semibold cursor-pointer"
            style={{ background: primaryColor }}
          >
            {loading ? (
              <ImSpinner11 className="mx-auto animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>

          <button
            disabled={loading2}
            className={`flex items-center gap-2 justify-center mt-6 w-full p-2 rounded-lg cursor-pointer border-[1px] border-black hover:bg-gray-100 `}
            type="button"
            onClick={handleGoogleAuth}
          >
            {loading2 ? (
              <ImSpinner11 className="mx-auto animate-spin" />
            ) : (
              <>
                <FcGoogle />
                <span>Sign Up With Google</span>
              </>
            )}
          </button>

          <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
            Already have an account ?
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      )}

      {step == 2 && (
        <form
          onSubmit={handleSubmitForEnterOtp}
          className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
          style={{ border: `1px solid ${borderColor}` }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            Foodingo
          </h1>
          <p className="text-gray-600 mb-8">
            Create your account to get started with delicious food deliveries
          </p>
          <label className="text-sm text-gray-700 font-semibold" htmlFor="otp">
            Otp :
          </label>
          <input
            id="otp"
            type="text"
            name="otp"
            onChange={(e) => setotp(e.target.value)}
            value={otp}
            placeholder="Enter Your Otp"
            className="border w-full rounded-lg p-2 pl-3 mt-1 mb-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full p-2 rounded-lg text-white font-semibold cursor-pointer"
            style={{ background: primaryColor }}
          >
            {loading ? (
              <ImSpinner11 className="mx-auto animate-spin" />
            ) : (
              "Verify"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Signup;
