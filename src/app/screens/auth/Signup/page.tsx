"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/context/AuthContext";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup.string().optional(),
});

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const success = await signup(data);
    setLoading(false);

    if (success) {
      setModal({
        open: true,
        message: "Signup successful! Redirecting to dashboard...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      setModal({
        open: true,
        message: "Signup failed. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0b1130] text-white px-6">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#14213d]/90 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              {...register("firstName")}
              placeholder="First Name"
              className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="mt-3">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="mt-3">
          <input
            {...register("username")}
            placeholder="Username"
            className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="relative mt-3">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Password"
            className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-xs text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative mt-3">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-xs text-blue-600"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mt-3">
          <input
            {...register("phone")}
            placeholder="Phone (optional)"
            className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-500 hover:bg-green-600 py-3 rounded mt-5 font-semibold transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm mt-6 text-center text-gray-300">
          Already have an account?{" "}
          <a
            href="/screens/auth/Signin"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Login
          </a>
        </p>
      </motion.form>

      {/* ✅ Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`bg-[#14213d] text-white rounded-2xl shadow-2xl p-6 w-80 text-center border-2 ${
                modal.type === "success" ? "border-green-500" : "border-red-500"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-3 ${
                  modal.type === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {modal.type === "success" ? "Success" : "Error"}
              </h2>
              <p className="text-slate-300 mb-5">{modal.message}</p>
              <button
                onClick={() => setModal((prev) => ({ ...prev, open: false }))}
                className={`px-4 py-2 rounded font-semibold ${
                  modal.type === "success"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
