"use client";

export default function LoadingSpinner({ size = "medium", light = false }) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${
          sizeClasses[size]
        } animate-spin rounded-full border-2 border-t-transparent ${
          light ? "border-white" : "border-[#834CFF]"
        }`}
      />
    </div>
  );
}
