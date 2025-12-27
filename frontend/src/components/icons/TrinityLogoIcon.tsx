import React from "react";

export const TrinityLogoIcon: React.FC<{ className?: string }> = ({
  className = "w-10 h-10",
}) => <img src="../../../logo.png" alt="Trinity Logo" className={className} />;
