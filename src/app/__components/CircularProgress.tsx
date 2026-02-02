import React from "react";

interface CircularProgressProps {
  progress: number; 
  size?: number;    
  strokeWidth?: number; 
  emoji?: string;   
  color?: string;   
}
const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 50,
  strokeWidth = 5,
  emoji = "🚀",
  color = "text-green-600",
}) => {
 
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-2xs relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        <circle
          className={`${color} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center">
        <span className="" role="img" aria-label="progress-emoji">
          {emoji}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;