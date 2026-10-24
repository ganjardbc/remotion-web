import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Backdrop } from "../../Backdrop";
import { useTheme } from "../../themes";
import { CodeCard, Hl, NoteCard, Step, StepChip, Title, Typed } from "./parts";
import { Center, Content, makeScene } from "./scene";

const ParamInner: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [90, 105], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      <Backdrop variant="ground" label="05 / 06" />
      <Content gap={32}>
        <Center>
          <StepChip label="3/3" />
        </Center>
        <Title delay={8}>
          <Hl>400:</Hl> parameter ditolak
        </Title>
        <CodeCard name="Error code" delay={30} y={50} style={{ fontSize: 36 }}>
          <Typed
            start={36}
            parts={[
              { text: "invalid request body: json: unknown field " },
              { text: '"' },
              {
                text: "thinking",
                color: t.colors.accent,
                underline: sweep,
              },
              { text: '"' },
            ]}
          />
        </CodeCard>
        <NoteCard name="Penjelasan" delay={120} icon="ban" y={120}>
          Model tertentu menolak parameter yang dikirim agent.
        </NoteCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Step delay={170} icon="search">
            Buka log 9Router, cari model yang kena 400
          </Step>
          <Step delay={195} icon="arrowDown">
            Pindahkan ke bawah atau keluarkan dari combo
          </Step>
          <Step delay={220} icon="refreshCw">
            Update 9Router dan OpenCode
          </Step>
        </div>
      </Content>
    </>
  );
};

export const ParamScene = makeScene("OpenCodeParamScene", ParamInner);
