import type React from "react";
import { Character, type CharacterProps } from "./Character";
import type { RobotExpression } from "./palette";
import { Robot } from "./Robot";

type DuoProps = Pick<CharacterProps, "expression" | "view" | "animated" | "talking" | "hair"> & {
  readonly robotExpression?: RobotExpression;
  // Lebar karakter; robot otomatis proporsional.
  readonly width?: number;
};

// Karakter berdiri dengan robot di sampingnya, seperti hero di character sheet.
export const Duo: React.FC<DuoProps> = ({
  robotExpression = "normal",
  width = 360,
  ...character
}) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: width * 0.04 }}>
    <Character width={width} {...character} />
    <Robot
      width={width * 0.5}
      expression={robotExpression}
      view="threeQuarter"
      animated={character.animated}
      style={{ marginBottom: width * 0.02 }}
    />
  </div>
);
