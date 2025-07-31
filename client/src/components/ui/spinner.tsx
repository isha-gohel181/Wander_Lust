import React from "react";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`animate-spin rounded-full border-4 border-muted border-t-foreground ${sizes[size]} ${className}`}
    />
  );
};
