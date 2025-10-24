"use client";
import Image from "next/image";
import React, { useState } from "react";
import logo from "@/app/assets/navbar/Tradelogo.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="px-4 py-6 sm:p-10 md:p-14 relative">
      <div className="bg-[#14182b] max-w-[90%] sm:max-w-[85%] lg:w-[170vh] mx-auto text-white flex justify-between items-center rounded-full p-4 sm:p-5">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={logo}
            alt="Logo"
            className="w-28 sm:w-32 md:w-40 h-auto"
            priority
          />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex justify-evenly items-center space-x-10 lg:space-x-16 font-normal text-base">
          <Link href="/">
            <li className="cursor-pointer hover:text-gray-300 transition">
              Home
            </li>
          </Link>
          <Link href="/screens/About">
            <li className="cursor-pointer hover:text-gray-300 transition">
              About
            </li>
          </Link>
          <Link href="/screens/Contact">
            <li className="cursor-pointer hover:text-gray-300 transition">
              Contact
            </li>
          </Link>
        </ul>

        {/* Desktop Login Button */}
        <div className="hidden md:flex">
          <button
            onClick={() => router.push("/screens/auth/Signin")}
            className="bg-white text-black px-5 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition"
          >
            Login
          </button>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            {menuOpen ? (
              <FiX size={28} className="text-white" />
            ) : (
              <FiMenu size={28} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-24 left-0 w-full bg-[#14182b] text-white rounded-2xl shadow-lg z-50 md:hidden flex flex-col items-center space-y-6 py-8 text-lg font-normal transition-all duration-300">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <p className="hover:text-gray-300 cursor-pointer">Home</p>
          </Link>
          <Link href="/screens/About" onClick={() => setMenuOpen(false)}>
            <p className="hover:text-gray-300 cursor-pointer">About</p>
          </Link>
          <Link href="/screens/Contact">
            <li className="cursor-pointer hover:text-gray-300 transition">
              Contact
            </li>
          </Link>{" "}
          <button
            onClick={() => {
              setMenuOpen(false);
              router.push("/screens/auth/Signin");
            }}
            className="bg-white text-black px-6 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
