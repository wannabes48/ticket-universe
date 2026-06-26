import React from 'react';
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function CustomSpinner({ className, ...props }: SpinnerProps) {
  const dots = [
    { cx: 82, cy: 50, r: 4.5, fill: "#ffffff" },
    { cx: 72.6, cy: 72.6, r: 6, fill: "#6dd1d0", shadow: "#3aa1b9" },
    { cx: 50, cy: 82, r: 7.5, fill: "#4bc4d0", shadow: "#2d85a1" },
    { cx: 27.4, cy: 72.6, r: 8.5, fill: "#25a4cf", shadow: "#1c6899" },
    { cx: 18, cy: 50, r: 9.5, fill: "#7a6cf8", shadow: "#473de0" },
    { cx: 27.4, cy: 27.4, r: 10.5, fill: "#a285ff", shadow: "#5d3dd1" },
    { cx: 50, cy: 18, r: 9.5, fill: "#b598ff", shadow: "#7d5bcc" },
    { cx: 72.6, cy: 27.4, r: 5, fill: "#ffffff" },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("animate-spin", className)}
      style={{ animationDuration: '1.2s' }}
      {...props}
    >
      <defs>
        {dots.map((dot, i) => dot.shadow && (
          <clipPath id={`clip-${i}`} key={i}>
            <circle cx={dot.cx} cy={dot.cy} r={dot.r - 2} />
          </clipPath>
        ))}
      </defs>
      
      {dots.map((dot, i) => (
        <g key={i}>
          {/* Base stroke/border circle */}
          <circle 
            cx={dot.cx} 
            cy={dot.cy} 
            r={dot.r} 
            fill={dot.shadow || dot.fill} 
            stroke="#102661" 
            strokeWidth="3.5" 
          />
          {/* Inner highlight crescent */}
          {dot.shadow && (
            <circle 
              cx={dot.cx - 1.5} 
              cy={dot.cy - 1.5} 
              r={dot.r} 
              fill={dot.fill} 
              clipPath={`url(#clip-${i})`} 
            />
          )}
        </g>
      ))}
    </svg>
  );
}
