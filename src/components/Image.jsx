// components/Image.js
import React from "react";

const Image = ({ src, alt, className, ...props }) => {
  // If src is a string (path), use it directly
  // If it's an imported image module, use the default property
  const imageSrc = typeof src === "string" ? src : src.default || src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        // Fallback for broken images
        e.target.src = "/images/placeholder.jpg";
      }}
      {...props}
    />
  );
};

export default Image;
