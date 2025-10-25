
// This component is no longer used and can be deleted.
// It has been replaced by DynamicWaterDrop.tsx to fit the new "Flow" screen vision.
import React from 'react';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ progress, size = 200, strokeWidth = 15 }) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-zinc-700"
        fill="transparent"
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-blue-500"
        fill="transparent"
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
    </svg>
  );
};
