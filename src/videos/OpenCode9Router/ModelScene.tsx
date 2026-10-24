import { Backdrop } from "../../Backdrop";
import { useTheme } from "../../themes";
import { CodeCard, Hl, NoteCard, Step, StepChip, Title, Typed } from "./parts";
import { Center, Content, makeScene } from "./scene";

const ModelInner: React.FC = () => {
  const t = useTheme();

  return (
    <>
      <Backdrop variant="ground" label="03 / 06" />
      <Content gap={32}>
        <Center>
          <StepChip label="1/3" />
        </Center>
        <Title delay={8}>
          Model <Hl>tidak dikenali</Hl>
        </Title>
        <CodeCard name="Error code" delay={30} y={50}>
          <div style={{ fontSize: 40, color: t.colors.accent }}>
            <Typed
              start={36}
              parts={[
                { text: "ProviderModelNotFoundError", color: t.colors.accent },
              ]}
            />
          </div>
        </CodeCard>
        <NoteCard name="Penjelasan" delay={90} icon="fileCog" y={120}>
          Model belum ditulis di opencode.json, atau namanya beda dengan di
          9Router.
        </NoteCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Step delay={150} icon="circleCheck">
            Tulis model di blok models
          </Step>
          <Step delay={175} icon="circleCheck">
            Samakan nama dengan hasil /v1/models
          </Step>
          <Step delay={200} icon="circleCheck">
            Restart OpenCode setelah ubah config
          </Step>
        </div>
      </Content>
    </>
  );
};

export const ModelScene = makeScene("OpenCodeModelScene", ModelInner);
