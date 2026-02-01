import React from "react";

// Definimos tipos para las props
interface ClockFillProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export const ClockFill: React.FC<ClockFillProps> = ({
  size = 30,
  color = "#fb7e51",
  viewBox="0 0 24 24",
  className = "",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      {...props}
    >
      <path
        fill={color}
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"
      />
    </svg>
  );
};
