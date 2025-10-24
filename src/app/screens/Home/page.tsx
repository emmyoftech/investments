"use client"
import Navbar from "@/components/Navbar";
import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import Image from "next/image";
import image3 from "@/app/assets/home/card/cardmg.png";
import image1 from "@/app/assets/home/laptop.png";
import image2 from "@/app/assets/home/phone.png";
import HomeCard from "@/components/HomeCard";
import Plans from "@/components/Plans";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Accordion from "@/components/Accordion";
import Feedback from "@/components/Feedback";

function Home()
{
  const router = useRouter()
    const sample = [
      {
        id: "one",
        title: "Create your account",
        content: (
          <p>
        Sign up in minutes by providing basic details.<br/> Our platform is user-friendly, and setting up your<br/> account is quick and secure
          </p>
        ),
      },
      {
        id: "two",
        title: "Fund your wallet",
        content: (
          <p>Deposit funds using your preferred<br/> currency like Bitcoin, Ethereum, or others.<br/> Our payment options are fast, secure, and flexible<br/> to meet your needs.</p>
        ),
      },
      {
        id: "three",
        title: "Start Investing",
        content: (
          <p>Choose an investment plan, adn watch your assets<br/> grow. You can track your investment in real-time<br/> and withdraw your earnings anytime, hassle-free</p>
        ),
      },
    ];
  return (
    <div className="bg-[#0F1014] overflow-hidden">
      <div className="  bg-gradient-to-tr from-[#0F1014] via-[#0F1014] to-[#0F1014] overflow-hidden ">
        <section className="relative overflow-hidden bg-[#0F1014]">
          {/* Background Glows */}
          <div className="absolute top-10 left-10 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-purple-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 sm:right-16 md:right-20 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-blue-500 rounded-full mix-blend-screen blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 bg-pink-500 rounded-full mix-blend-screen blur-2xl opacity-40 animate-ping"></div>

          {/* Foreground Content */}
          <div className="relative z-30">
            {/* Navbar */}
            <div className="px-4 sm:px-6 md:px-12">
              <Navbar />
            </div>

            {/* Hero Text Section */}
            <div className="text-center space-y-7 px-4 md:px-0">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-normal text-white">
                Trades Global FX
              </h1>

              <p className="text-white text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
                Unlock the potential of your brand new future with Trades Global
                FX.
                <br className="hidden sm:block" /> Take control of your
                financial destiny and embark on a journey towards prosperity and
                success.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/screens/auth/Signin">
                  <button className="flex items-center  bg-white text-black px-4 py-2 rounded-full cursor-pointer w-full sm:w-auto">
                    Login <FaLongArrowAltRight />
                  </button>
                </Link>
                <button
                  onClick={() => router.push("/screens/auth/Signup")}
                  className="border border-white rounded-full text-white px-4 py-2 w-full sm:w-auto hover:bg-white hover:text-black transition"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Hero Images */}
            <div className="flex justify-center lg:flex items-center mt-10 md:hidden sm:mt-16 md:mt-24 overflow-x-hidden">
              <div className="relative flex justify-center items-center">
                <div className="flex justify-start items-center z-10">
                  <Image
                    src={image1}
                    className="lg:w-[90%] w-[80%] h-auto"
                    alt="Laptop"
                    priority
                  />
                </div>

                <div className="flex justify-start items-center  z-20 -ml-40 sm:-ml-32 md:-ml-48 lg:-ml-60">
                  <Image
                    src={image2}
                    className="w-[70%] h-auto"
                    alt="Phone"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="z-10 relative bg-[#0F1014] py-50 ">
          <HomeCard />
        </section>
      </div>
      <section className="space-y-16 sm:space-y-20 px-4 sm:px-8 md:px-12 lg:px-20">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight">
            We are empowering traders
            <br className="hidden sm:block" /> globally
          </h1>
        </div>

        {/* Content Block */}
        <div className="bg-[#14182b] rounded-2xl flex flex-col md:flex-row items-center gap-10 md:gap-16 p-6 sm:p-10 md:p-14 lg:p-20">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src={image3}
              alt="Traders illustration"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto rounded-xl object-contain"
            />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 text-white text-sm sm:text-base leading-relaxed">
            <p>
              Trades Global FX Funding was established in 2021 with the goal of
              revolutionizing the trader payout model. It was founded out of
              dissatisfaction with existing funding companies and a desire to
              adopt a more customer-centric approach.
            </p>

            <p className="mt-4">
              As a premier trader funding company, Trades Global FX Funding
              outperforms other futures funding evaluation firms in terms of
              payouts. With a vast global community spanning over 150 countries
              and tens of thousands of members, Trades Global FX Funding,
              headquartered in Austin, Texas, specializes in funding evaluations
              for futures markets.
            </p>
          </div>
        </div>
      </section>

      <section className="">
        <Plans />
      </section>
      <section className="py-20 bg-[#0B0D17] text-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="border rounded-3xl bg-[#0D1036]/80 border-[#0D1036] p-8 sm:p-12 md:p-16 text-center backdrop-blur-sm">
            <div className="space-y-8">
              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                Expertise in Crypto
                <br className="hidden sm:block" />
                Excellence
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Experience secure, stress-free investing where risk is mitigated
                and profit maximization is a reality.
              </p>

              {/* Button */}
              <button
                className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-transparent hover:text-white border border-white transition-all duration-300"
                onClick={() => router.push("/screens/auth/Signup")}
              >
                Invest Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0B0D17] text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 py-20">
          {/* Section Header */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
              How it Works
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Getting started with{" "}
              <span className="text-white font-medium">Trades Global FX</span>
              is simple and straightforward. Follow these easy steps to begin
              your investment journey.
            </p>
          </div>

          {/* Accordion Section */}
          <div className="py-10">
            <Accordion items={sample} multiple={false} />
          </div>
        </div>
      </section>

      <section>
        <Feedback/>
      </section>
    </div>
  );
}

export default Home;
