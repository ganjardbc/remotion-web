export type ArmPose = {
  // derajat, positif = lengan terangkat ke arah luar
  readonly shoulder: number;
  // derajat, positif = lengan bawah menekuk ke arah luar/atas
  readonly elbow: number;
  // 0..1, panjang jari telunjuk (menunjuk)
  readonly point: number;
};

export type LegPose = {
  readonly hip: number;
  readonly knee: number;
  readonly lift: number;
};

export type GanjarPose = {
  readonly root: { readonly x: number; readonly y: number };
  readonly hipY: number;
  // 0 = berdiri, 1 = duduk (paha memendek karena menghadap penonton, badan turun).
  readonly sit: number;
  readonly torso: { readonly rot: number; readonly breathe: number };
  // turn: -1 menoleh ke kiri layar, +1 ke kanan layar. rot = miring kepala (derajat).
  readonly head: { readonly rot: number; readonly turn: number; readonly y: number };
  readonly armL: ArmPose;
  readonly armR: ArmPose;
  readonly legL: LegPose;
  readonly legR: LegPose;
};

const ARM0: ArmPose = { shoulder: 0, elbow: 0, point: 0 };
const LEG0: LegPose = { hip: 0, knee: 0, lift: 0 };

export const NEUTRAL_POSE: GanjarPose = {
  root: { x: 0, y: 0 },
  hipY: 0,
  sit: 0,
  torso: { rot: 0, breathe: 0 },
  head: { rot: 0, turn: 0, y: 0 },
  armL: ARM0,
  armR: ARM0,
  legL: LEG0,
  legR: LEG0,
};

export type PoseDelta = {
  readonly root?: Partial<GanjarPose["root"]>;
  readonly hipY?: number;
  readonly sit?: number;
  readonly torso?: Partial<GanjarPose["torso"]>;
  readonly head?: Partial<GanjarPose["head"]>;
  readonly armL?: Partial<ArmPose>;
  readonly armR?: Partial<ArmPose>;
  readonly legL?: Partial<LegPose>;
  readonly legR?: Partial<LegPose>;
};

const addArm = (a: ArmPose, d?: Partial<ArmPose>): ArmPose => ({
  shoulder: a.shoulder + (d?.shoulder ?? 0),
  elbow: a.elbow + (d?.elbow ?? 0),
  point: Math.max(0, Math.min(1, a.point + (d?.point ?? 0))),
});
const addLeg = (a: LegPose, d?: Partial<LegPose>): LegPose => ({
  hip: a.hip + (d?.hip ?? 0),
  knee: a.knee + (d?.knee ?? 0),
  lift: a.lift + (d?.lift ?? 0),
});

export const applyDelta = (p: GanjarPose, d: PoseDelta): GanjarPose => ({
  root: { x: p.root.x + (d.root?.x ?? 0), y: p.root.y + (d.root?.y ?? 0) },
  hipY: p.hipY + (d.hipY ?? 0),
  sit: p.sit + (d.sit ?? 0),
  torso: {
    rot: p.torso.rot + (d.torso?.rot ?? 0),
    breathe: p.torso.breathe + (d.torso?.breathe ?? 0),
  },
  head: {
    rot: p.head.rot + (d.head?.rot ?? 0),
    turn: p.head.turn + (d.head?.turn ?? 0),
    y: p.head.y + (d.head?.y ?? 0),
  },
  armL: addArm(p.armL, d.armL),
  armR: addArm(p.armR, d.armR),
  legL: addLeg(p.legL, d.legL),
  legR: addLeg(p.legR, d.legR),
});
