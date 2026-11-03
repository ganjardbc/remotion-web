import { Composition, Folder } from "remotion";
import { COMPOSITIONS } from "./compositions";
import { RigDemoRoot } from "./videos/CharacterRigDemo/Root";

// Komposisi video dan carousel didaftarkan otomatis dari src/videos (lihat src/compositions.ts).
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {COMPOSITIONS.map((c) => (
        <Composition key={c.id} id={c.id} component={c.component} durationInFrames={c.durationInFrames} fps={c.fps} width={c.width} height={c.height} defaultProps={c.defaultProps} />
      ))}
      <Folder name="Characters">
        <RigDemoRoot />
      </Folder>
    </>
  );
};
