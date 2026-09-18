"use client";

import { GAME_COMPONENTS } from "./Games";

export function GameHost({ id }: { id: string }) {
  const G = GAME_COMPONENTS[id];
  return G ? <G /> : null;
}
