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
import { useDispatch, useSelector } from "react-redux";
import { setIsLogging } from "../redux/slices/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLogging } = useSelector((store) => store.user);
  useEffect(() => {
    if (isLogging) {
      navigate("/");
    }
  }, [isLogging, navigate]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // backend API call here
    try {
      const res = await instance.post("/auth/login", formData);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setIsLogging(true));
        navigate("/");
      }
    } catch (error) {
      console.error(error.response.data.message || "login error");
      toast.error(error.response.data.message || "login error");
      dispatch(setIsLogging(false));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading2(true);
    try {
      const provider = new GoogleAuthProvider();
      const googleRes = await signInWithPopup(auth, provider);

      const res = await instance.post("/auth/google-auth", {
        fullName: googleRes.user.displayName,
        email: googleRes.user.email,
        type: "login",
      });
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setIsLogging(true));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "google-auth login error");
      dispatch(setIsLogging(false));
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: bgColor }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Foodingo
        </h1>
        <p className="text-gray-600 mb-8">
          SingIn your account to get started with delicious food deliveries
        </p>

        <label className="text-sm text-gray-700 font-semibold" htmlFor="email">
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
            className="border w-full rounded-lg p-2 pl-3 mt-1 "
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-1 top-4 cursor-pointer"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <div
          type="button"
          className="text-sm text-right justify-end cursor-pointer hover:text-blue-500"
          onClick={() => navigate("/frogot-password")}
        >
          Forgot Password
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
            "Sign In"
          )}
        </button>

        <button
          disabled={loading2}
          onClick={handleGoogleAuth}
          className={`flex items-center gap-2 justify-center mt-6 w-full p-2 rounded-lg cursor-pointer border-[1px] border-black hover:bg-gray-100 `}
          type="button"
        >
          {loading2 ? (
            <ImSpinner11 className="mx-auto animate-spin" />
          ) : (
            <>
              <FcGoogle />
              <span>Sign In With Google</span>
            </>
          )}
        </button>

        <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
          Want to create a new account ?
          <Link to="/signup" className="text-blue-600">
            SignUp
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
