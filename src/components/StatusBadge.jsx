import React from "react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    interview: {
      label: "Suhbat",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
    },
    verification: {
      label: "Tekshiruv",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
    },
    accepted: {
      label: "Qabul qilindi",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
    },
    rejected: {
      label: "Rad etildi",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
    },
    pending: {
      label: "Kutilmoqda",
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
    },
    test: {
      label: "Test bosqichi",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full text-sm font-medium whitespace-nowrap`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
