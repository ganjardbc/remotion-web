import { Interactive, interpolate, Easing, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { Icon } from "../../icons";
import { useTheme } from "../../themes";
import {
  CodeCard,
  Hl,
  NoteCard,
  Pop,
  PURPLE,
  shakeX,
  StepChip,
  Title,
} from "./parts";
import { Center, Content, makeScene } from "./scene";

const ForbiddenInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...t.motion.enter),
  });

  return (
    <>
      <Backdrop variant="ground" label="04 / 06" />
      <Content gap={24}>
        <Center>
          <StepChip label="2/3" />
        </Center>
        <Title delay={4} size={88}>
          Tes sukses, agent <Hl>403</Hl>
        </Title>
        <NoteCard
          name="Test dashboard"
          delay={10}
          icon="circleCheck"
          x={-300}
          y={0}
          iconBg="transparent"
        >
          <Interactive.Div
            name="Test dashboard label"
            style={{ fontWeight: 700 }}
          >
            Test dashboard ✓
          </Interactive.Div>
        </NoteCard>
        <Center>
          <svg width={60} height={80} viewBox="0 0 60 80" fill="none">
            <path
              d="M30 4 V74 M12 56 L30 76 L48 56"
              pathLength={1}
              stroke={PURPLE}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
              opacity={draw > 0 ? 1 : 0}
            />
          </svg>
        </Center>
        <div style={{ transform: `translateX(${shakeX(frame, 82, 10)}px)` }}>
          <CodeCard
            name="Error code"
            delay={75}
            y={-200}
            damping={12}
            icon={
              <Pop delay={80}>
                <Icon name="triangleAlert" size={72} color={t.colors.accent} />
              </Pop>
            }
            style={{ fontSize: 34 }}
          >
            <span style={{ color: t.colors.accent }}>FreeTierError:</span>{" "}
            <span style={{ color: t.code.text }}>
              OpenCode's free tier can only be used from within OpenCode
            </span>
          </CodeCard>
        </div>
        <NoteCard name="Penjelasan" delay={150} icon="lock" y={80}>
          Model gratis OpenCode (oc/) menolak request yang bukan dari OpenCode
          sendiri.
        </NoteCard>
        <NoteCard
          name="Saran"
          delay={220}
          icon="layers"
          y={80}
          bg={t.colors.primary}
          color="#FFFFFF"
          iconBg="rgba(255,255,255,0.18)"
          iconColor="#FFFFFF"
        >
          Jangan jadikan model gratis satu-satunya cadangan. Tes lewat agent,
          bukan cuma tombol test.
        </NoteCard>
      </Content>
    </>
  );
};

export const ForbiddenScene = makeScene(
  "OpenCodeForbiddenScene",
  ForbiddenInner,
);
