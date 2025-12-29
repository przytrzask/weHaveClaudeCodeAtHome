import { FileSystem } from "@effect/platform";
import { Effect, Layer } from "effect";

import {
  NodeContext,
  NodeRuntime,
  NodeHttpClient,
} from "@effect/platform-node";

const readFile = Effect.fn(function* (url: string) {
  const fs = yield* FileSystem.FileSystem;
  const file = yield* fs.readFileString(url);
  const lines = file.trim().split("\n");
  return lines;
});

const INITIAL_VALUE = 50;

const rotateDial = (currentPosition: number, instruction: string): number => {
  const direction = instruction[0]; // 'L' or 'R'
  const amount = parseInt(instruction.slice(1)); // number after L/R

  if (direction === "L") {
    return (currentPosition - amount + 100) % 100;
  } else if (direction === "R") {
    return (currentPosition + amount) % 100;
  }

  return currentPosition;
};

const program = Effect.gen(function* () {
  const instructions = yield* readFile("./advent/instructions1.txt");

  let position = INITIAL_VALUE;
  console.log(`Starting position: ${position}`);

  let res = 0;

  for (const instruction of instructions) {
    const newPosition = rotateDial(position, instruction);
    if (newPosition === 0) {
      res += 1;
    }
    console.log(`${instruction}: ${position} -> ${newPosition}`);
    position = newPosition;
  }

  console.log(`Final position: ${position}`);
  console.log({ res });
  return position;
});

program.pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
