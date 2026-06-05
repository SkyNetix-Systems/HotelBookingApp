import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  borderColor: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  borderColor,
}) => {
  return (
    <div
      className={`border-l-4 ${borderColor} bg-white rounded-lg shadow-sm p-6 flex items-center justify-between`}
    >
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className="text-4xl text-gray-400">{icon}</div>
    </div>
  );
};

export default DashboardCard;
