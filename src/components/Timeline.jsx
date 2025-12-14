// components/Timeline.jsx
import React from "react";
import { CheckCircle } from "lucide-react";

const Timeline = ({ stage }) => {
  const stages = [
    "Ariza yuborildi",
    "Suhbat belgilandi",
    "Test topshirildi",
    "Qaror qabul qilindi",
  ];

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Jarayon holati:
      </h4>

      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full" />

        <div
          className="absolute top-1/2 left-0 h-1 bg-linear-to-r from-green-400 to-green-500 -translate-y-1/2 transition-all duration-500 rounded-full shadow-md"
          style={{ width: `${(stage / (stages.length - 1)) * 93}%` }}
        />

        {stages.map((stageName, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center top-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                idx < stage
                  ? "bg-green-500 text-white scale-100"
                  : idx === stage
                  ? "bg-blue-500 text-white scale-110 animate-pulse"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {idx < stage ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-bold">{idx + 1}</span>
              )}
            </div>
            <span
              className={`text-xs mt-2 text-center max-w-20 font-medium ${
                idx <= stage ? "text-gray-800" : "text-gray-500"
              }`}
            >
              {stageName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
