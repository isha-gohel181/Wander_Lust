import React from "react";

const sizes = {
  sm: {
    wrapper: "gap-0",
    logoText: "text-[1.35rem] sm:text-[1.5rem]",
    tagText: "text-[0.56rem]",
  },
  md: {
    wrapper: "gap-0",
    logoText: "text-[1.45rem] sm:text-[1.7rem]",
    tagText: "text-[0.62rem]",
  },
};

const BrandLogo = ({ size = "md", showTagline = false, className = "" }) => {
  const variant = sizes[size] ?? sizes.md;

  return (
    <div className={`flex items-center ${variant.wrapper} ${className}`}>
      <div className="flex flex-col leading-none">
        <span
          className={`${variant.logoText} font-black not-italic tracking-[0.08em] text-[#f97316] drop-shadow-sm`}
        >
          Wanderlust
        </span>
        {showTagline && (
          <span
            className={`${variant.tagText} mt-1 font-semibold uppercase tracking-[0.36em] text-gray-500`}
          >
            Travel bright
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;