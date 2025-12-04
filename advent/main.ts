import { FileSystem } from "@effect/platform";
import { Effect, Layer } from "effect";

import {
  NodeContext,
  NodeRuntime,
  NodeHttpClient,
} from "@effect/platform-node";

const readFile = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem;
  const file = yield* fs.readFileString("./advent/instructions1.txt");
});

const program = Effect.gen(function* () {});

readFile.pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain);
