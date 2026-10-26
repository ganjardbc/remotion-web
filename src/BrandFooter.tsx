import {
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { Icon } from "./icons";
import { themed, themeSchema, useTheme } from "./themes";

// Required on every video: a transparent footer pinned to the very bottom for the
// full duration. Logo on the left; TikTok, Instagram and the handle on the
// right. Render it once at the video root, outside the scene transitions.
const BrandFooterInner: React.FC<{ readonly handle: string }> = ({
  handle,
}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const unit = width / 1080;
  const portrait = height > width;

  const barHeight = (portrait ? 128 : 96) * unit;
  const logoSize = (portrait ? 64 : 52) * unit;
  const opacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });

  return (
    <Interactive.Div
      name="Brand footer"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 46 * unit,
        height: barHeight,
        padding: `0 ${46 * unit}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        translate: "0px 46px"
      }}
    >
      <CanvasImage
        name="Logo"
        src={staticFile(t.logo.src)}
        premountFor={fps}
        style={{
          width: logoSize * (t.logo.width / t.logo.height),
          height: logoSize,
          borderRadius: t.logo.round ? 999 : 0,
          opacity,
        }}
      />
      {/* Transparent bar: white + difference blend reads white on dark
          scenes and near-black on light ones. Opacity sits on the blended
          element itself so the blend still sees the scene behind it. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14 * unit,
          color: "#FFFFFF",
          mixBlendMode: "difference",
          opacity,
          fontFamily: t.fonts.body,
          fontWeight: 400,
          fontSize: 26 * unit,
        }}
      >
        <Icon name="tiktok" size={30 * unit} color="currentColor" />
        <Icon name="instagram" size={30 * unit} color="currentColor" />
        <span style={{ marginLeft: 4 * unit }}>{handle}</span>
      </div>
    </Interactive.Div>
  );
};

const footerSchema = {
  ...themeSchema,
  handle: {
    type: "string",
    default: "@ganjar_hadiatna",
    description: "Social handle",
  },
} as const satisfies InteractivitySchema;

export const BrandFooter = Interactive.withSchema({
  Component: themed(BrandFooterInner),
  componentName: "BrandFooter",
  schema: footerSchema,
  wrapInSequence: true,
  layout: "absolute-fill",
});
