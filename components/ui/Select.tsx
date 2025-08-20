
import React from 'react';

interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, className }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        transition-colors duration-200
        ${className}
      `}
    >
      {options.map((option) => (
        <option key={option} value={option} className="bg-gray-700 text-white">
          {option}
        </option>
      ))}
    </select>
  );
};