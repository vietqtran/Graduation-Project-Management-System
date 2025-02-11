import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={`rounded-full overflow-hidden ${className}`}>{children}</div>;
};

export const AvatarImage: React.FC<AvatarProps> = ({ src, alt, className }) => {
  return (
    <img
      src={src || "/default-avatar.png"}
      alt={alt || "Avatar"}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};