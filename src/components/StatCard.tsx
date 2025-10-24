import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  accentColor = "text-green-400",
}: StatCardProps) {
  return (
    <div className="bg-[#0f274f] hover:bg-[#123065] transition-colors p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[120px] w-full">
      <div className={`text-3xl mb-3 ${accentColor}`}>{icon}</div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}
