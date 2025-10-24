"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";
import image1 from "@/app/assets/feedback/man.png";
import image2 from "@/app/assets/feedback/woman.png";
import image3 from "@/app/assets/feedback/feed.png";
import { FaQuoteRight } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FeedbackProps {
  id: number;
  image: StaticImport;
  icon: React.ReactNode;
  title: string;
  desc: string;
  name: string;
}

const feedbackData: FeedbackProps[] = [
  {
    id: 1,
    image: image1,
    icon: <FaQuoteRight />,
    title: "The perfect platform",
    desc: "Since joining Trades Global FX, my portfolio has grown significantly. The expert advice and 24/7 support really set them apart. Highly recommended for anyone serious about crypto investing.",
    name: "John Carter",
  },
  {
    id: 2,
    image: image2,
    icon: <FaQuoteRight />,
    title: "Reliable and transparent",
    desc: "I was new to cryptocurrency, but Trades Global FX made everything so simple. Their customer support team was incredibly helpful, and now I'm seeing consistent returns on my investments.",
    name: "Sophie Moore",
  },
  {
    id: 3,
    image: image3,
    icon: <FaQuoteRight />,
    title: "They exceeded my expectations",
    desc: "I started with the Starter Plan just to test the waters, and I was blown away by the returns. The platform is super easy to use, and I love being able to withdraw my earnings anytime without any issues.",
    name: "Mett Cannon",
  },
];

function Feedback() {
  const router = useRouter();

  return (
    <section className="bg-[#0B0D17] text-white py-20 px-6 sm:px-10 md:px-16 lg:px-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-semibold text-center md:text-left">
          What our users say
        </h1>
        <button
          className="bg-white text-black rounded-full px-6 py-3 font-semibold transition hover:bg-gray-200"
          onClick={() => router.push("/screens/auth/Signup")}
        >
          Get Started
        </button>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {feedbackData.map((item) => (
          <div
            key={item.id}
            className="bg-[#0F1224] rounded-2xl p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <Image
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                src={item.image}
                alt={item.name}
              />
              <div className="text-5xl sm:text-6xl text-blue-400 opacity-70">
                {item.icon}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-xl sm:text-2xl font-semibold">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {item.desc}
              </p>
              <p className="text-blue-400 font-medium">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Feedback;
