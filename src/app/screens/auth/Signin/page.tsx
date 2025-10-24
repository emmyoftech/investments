"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    const success = await login(data.email.toLowerCase(), data.password);
    setIsSubmitting(false);

    if (!success) {
      setModalMsg("Invalid email or password. Please try again or sign up.");
      setShowModal(true);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0b1130] text-white px-6">
      {/* Signin Card */}
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#14213d]/90 backdrop-blur-sm p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>

        {/* Email */}
        <div className="mb-4">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition-all ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        {/* Signup link */}
        <p className="text-sm mt-6 text-center text-gray-300">
          Don’t have an account?{" "}
          <a
            href="/screens/auth/Signup"
            className="text-blue-400 underline hover:text-blue-300"
          >
            Sign up
          </a>
        </p>
      </motion.form>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-[#14213d] text-white rounded-2xl shadow-2xl p-6 w-80 text-center"
            >
              <h2 className="text-lg font-semibold mb-3">Sign In Failed</h2>
              <p className="text-slate-300 mb-5">{modalMsg}</p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded font-semibold"
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
