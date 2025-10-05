import React from 'react';

interface CardProps {
  title: string;
  value: number | string;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
};

export const Card: React.FC<CardProps> = ({ title, value, color = 'blue' }) => (
  <div className={`rounded-xl shadow p-6 flex flex-col items-center justify-center ${colorMap[color]}`}>
    <div className="text-3xl font-bold mb-2">{value}</div>
    <div className="text-lg font-medium">{title}</div>
  </div>
);
