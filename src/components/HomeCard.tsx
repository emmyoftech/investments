import React from "react";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import image1 from "@/app/assets/home/card/cardmg.png";
import image2 from "@/app/assets/home/card/cardimg2.png";

interface HomeCardProps {
  id: number;
  title: string;
  description: string;
  image: any;
  list: {
    label: string;
    desc?: string;
    icon?: React.ReactNode;
  }[];
  button?: {
    label: string;
    icon: React.ReactNode;
  };
}

const cardData: HomeCardProps[] = [
  {
    id: 1,
    title: "The Future of Finance",
    description:
      "User-friendly solutions to help investors of all levels achieve financial success.",
    image: image1,
    list: [
      { label: "Lowest fees in the market", icon: <FaCheck /> },
      { label: "Fast and secure transactions", icon: <FaCheck /> },
      { label: "256-bit secure encryption", icon: <FaCheck /> },
    ],
    button: { label: "Get Started", icon: <FaCheck /> },
  },
  {
    id: 2,
    title: "Expertise You Can Trust",
    description:
      "User-friendly solutions to help investors of all levels achieve financial success.",
    image: image2,
    list: [
      { label: "20+", desc: "Countries" },
      { label: "$4.75M", desc: "Transactions" },
      { label: "1500+", desc: "Active Users" },
      { label: "6+", desc: "Cryptos Supported" },
    ],
  },
];

function HomeCard() {
  return (
    <div className="space-y-24 py-16 px-6 md:px-16 lg:px-24 bg-[#0F1014]">
      {cardData.map((card, index) => (
        <div
          key={card.id}
          className={`grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16 ${
            index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Image Section */}
          <div className="bg-[#14182b] rounded-3xl flex justify-center py-12 px-4 shadow-lg">
            <Image
              src={card.image}
              alt={card.title}
              className="rounded-lg object-contain"
              width={400}
              height={300}
            />
          </div>

          {/* Text Section */}
          <div className="text-white space-y-6">
            <h2 className="text-3xl lg:text-5xl font-semibold">{card.title}</h2>
            <p className="text-gray-400 text-base lg:text-lg">
              {card.description}
            </p>

            {/* Conditional List Section */}
            {card.id === 2 ? (
              <div className="grid grid-cols-2 gap-6 border-t border-gray-700 pt-6">
                {card.list.map((item, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold">{item.label}</p>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-3">
                {card.list.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-200">
                    {item.icon && (
                      <span className="text-blue-500">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Button */}
            {card.button && (
              <button className="mt-6 inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                {card.button.icon}
                {card.button.label}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomeCard;
