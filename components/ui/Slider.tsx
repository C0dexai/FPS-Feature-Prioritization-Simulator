
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  unit?: string;
}

export const Slider: React.FC<SliderProps> = ({ label, value, min = 0, max = 100, step = 1, onChange, suffix, unit }) => {
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1">
        <label className="font-medium text-gray-300">{label}</label>
        <span className="text-indigo-300 font-semibold">
          {value}{suffix} {unit && <span className="text-gray-400 font-normal">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
};