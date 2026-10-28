// Garis tangan: sedikit bergelombang, deterministik (tanpa Math.random), jadi sama di setiap frame.
export const wobblyLine = (x1: number, y1: number, x2: number, y2: number, seed = 0, amp = 2.4, step = 36): string => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(1, Math.round(len / step));
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const off = i === 0 || i === n ? 0 : Math.sin(i * 1.9 + seed * 2.3) * amp;
    return `${(x1 + (x2 - x1) * t + nx * off).toFixed(1)} ${(y1 + (y2 - y1) * t + ny * off).toFixed(1)}`;
  });
  return `M${pts[0]} ${pts
    .slice(1)
    .map((p) => `L${p}`)
    .join(" ")}`;
};

// Persegi panjang dari empat garis bergelombang yang menyambung.
export const wobblyRect = (x: number, y: number, w: number, h: number, seed = 0): string =>
  [
    wobblyLine(x, y, x + w, y, seed),
    wobblyLine(x + w, y, x + w, y + h, seed + 1),
    wobblyLine(x + w, y + h, x, y + h, seed + 2),
    wobblyLine(x, y + h, x, y, seed + 3),
  ].join(" ");
