import { atom } from "recoil";
import { Bullet, Position } from "../types/types";
import {
  playerHeight,
  playerWidth,
  worldHeight,
  worldWidth,
} from "../constents/worldContents";

export const playerAtom = atom<Position>({
  key: "playerAtom",
  default: {
    x: Math.random() * (worldWidth - playerWidth),
    y: Math.random() * (worldHeight - playerHeight),
  },
});

export const playerRotationAtom = atom<number>({
  key: "playerRotationAtom",
  default: 0,
});

export const bulletsAtom = atom<Bullet[]>({
  key: "bulletsAtom",
  default: [],
});
