// Pose = data murni. Semua gerak dihitung dari frame, tanpa state.
export type LegPose = {
  // px, positif = kaki terangkat
  readonly lift: number;
  // derajat, ayun dari pinggul
  readonly swing: number;
  // derajat, rotasi telapak di pergelangan
  readonly foot: number;
};

export type RobotPose = {
  readonly root: { readonly x: number; readonly y: number; readonly rot: number };
  // sx/sy = skala dari dasar badan (squash and stretch)
  readonly body: { readonly y: number; readonly rot: number; readonly sx: number; readonly sy: number };
  // derajat, positif = lengan terangkat ke arah luar
  readonly armL: number;
  readonly armR: number;
  readonly legL: LegPose;
  readonly legR: LegPose;
  // derajat, positif = ujung antena condong ke kanan layar
  readonly antL: number;
  readonly antR: number;
};

const LEG_NEUTRAL: LegPose = { lift: 0, swing: 0, foot: 0 };

export const NEUTRAL_POSE: RobotPose = {
  root: { x: 0, y: 0, rot: 0 },
  body: { y: 0, rot: 0, sx: 1, sy: 1 },
  armL: 0,
  armR: 0,
  legL: LEG_NEUTRAL,
  legR: LEG_NEUTRAL,
  antL: 0,
  antR: 0,
};

// Delta aditif. Skala (sx, sy) dikalikan, sisanya dijumlah.
export type PoseDelta = {
  readonly root?: Partial<RobotPose["root"]>;
  readonly body?: Partial<RobotPose["body"]>;
  readonly armL?: number;
  readonly armR?: number;
  readonly legL?: Partial<LegPose>;
  readonly legR?: Partial<LegPose>;
  readonly antL?: number;
  readonly antR?: number;
};

const addLeg = (a: LegPose, b: Partial<LegPose> | undefined): LegPose => ({
  lift: a.lift + (b?.lift ?? 0),
  swing: a.swing + (b?.swing ?? 0),
  foot: a.foot + (b?.foot ?? 0),
});

export const applyDelta = (pose: RobotPose, d: PoseDelta): RobotPose => ({
  root: {
    x: pose.root.x + (d.root?.x ?? 0),
    y: pose.root.y + (d.root?.y ?? 0),
    rot: pose.root.rot + (d.root?.rot ?? 0),
  },
  body: {
    y: pose.body.y + (d.body?.y ?? 0),
    rot: pose.body.rot + (d.body?.rot ?? 0),
    sx: pose.body.sx * (d.body?.sx ?? 1),
    sy: pose.body.sy * (d.body?.sy ?? 1),
  },
  armL: pose.armL + (d.armL ?? 0),
  armR: pose.armR + (d.armR ?? 0),
  legL: addLeg(pose.legL, d.legL),
  legR: addLeg(pose.legR, d.legR),
  antL: pose.antL + (d.antL ?? 0),
  antR: pose.antR + (d.antR ?? 0),
});
