import type React from "react";

// Perangkat bersama karakter balok: kubus CSS 3D dengan sisi digambar vektor.
// Koordinat gambar sisi: 10 unit per U, jadi tidak bergantung ukuran piksel.

export type FaceKey = "front" | "back" | "left" | "right" | "top" | "bottom";
export type Paint = (w: number, h: number) => React.ReactNode;
export type Faces = Partial<Record<FaceKey, Paint>>;

export const flip: (p: Paint) => Paint = (p) => (w, h) => <g transform={`translate(${w} 0) scale(-1 1)`}>{p(w, h)}</g>;

export const stroke = (d: string, color: string, width: number, opacity = 1): React.ReactNode => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
);

export const SHADE = { front: 0.97, back: 0.72, left: 0.8, right: 0.86, top: 1, bottom: 0.55 } as const;

export type CubeProps = {
  readonly w: number;
  readonly h: number;
  readonly d: number;
  readonly u: number;
  readonly faces: Faces;
  readonly transform?: string;
};

export const Cube: React.FC<CubeProps> = ({ w, h, d, u, faces, transform }) => {
  const [W, H, D] = [w * u, h * u, d * u];
  const face = (key: FaceKey, fw: number, fh: number, tf: string): React.ReactNode => {
    const paint = faces[key];
    if (!paint) return null;
    return (
      <div
        key={key}
        style={{
          position: "absolute",
          left: -fw / 2,
          top: -fh / 2,
          width: fw,
          height: fh,
          transform: tf,
          backfaceVisibility: "hidden",
        }}
      >
        <FaceSvgScaled paint={paint} shade={SHADE[key]} width={fw} height={fh} unit={u} />
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d", transform }}>
      {face("front", W, H, `translateZ(${D / 2}px)`)}
      {face("back", W, H, `rotateY(180deg) translateZ(${D / 2}px)`)}
      {face("right", D, H, `rotateY(90deg) translateZ(${W / 2}px)`)}
      {face("left", D, H, `rotateY(-90deg) translateZ(${W / 2}px)`)}
      {face("top", W, D, `rotateX(90deg) translateZ(${H / 2}px)`)}
      {face("bottom", W, D, `rotateX(-90deg) translateZ(${H / 2}px)`)}
    </div>
  );
};

// viewBox tiap sisi: 10 unit per U, jadi koordinat gambar tidak bergantung ukuran piksel.
const FaceSvgScaled: React.FC<{
  readonly paint: Paint;
  readonly shade: number;
  readonly width: number;
  readonly height: number;
  readonly unit: number;
}> = ({ paint, shade, width, height, unit }) => {
  const vbW = (width / unit) * 10;
  const vbH = (height / unit) * 10;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${vbW} ${vbH}`} preserveAspectRatio="none" style={{ display: "block" }}>
      {paint(vbW, vbH)}
      <rect width={vbW} height={vbH} fill="#000" opacity={1 - shade} />
    </svg>
  );
};

export const Joint: React.FC<{ readonly transform: string; readonly children: React.ReactNode }> = ({ transform, children }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformStyle: "preserve-3d", transform }}>
    {children}
  </div>
);

