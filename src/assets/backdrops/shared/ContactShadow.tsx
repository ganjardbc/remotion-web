import type React from "react";

// Bayangan lembut di lantai tepat di bawah karakter: `x` = sumbu tengah karakter, `y` = garis lantai (kaki).
// Menyatukan karakter dengan latar mana pun; `opacity` lebih kecil di malam.
export const ContactShadow: React.FC<{ readonly x: number; readonly y: number; readonly width: number; readonly opacity?: number }> = ({
  x,
  y,
  width,
  opacity = 0.28,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - width / 2,
      top: y - width * 0.09,
      width,
      height: width * 0.18,
      borderRadius: "50%",
      background: `radial-gradient(closest-side, rgba(0,0,0,${opacity}), rgba(0,0,0,0))`,
    }}
  />
);
