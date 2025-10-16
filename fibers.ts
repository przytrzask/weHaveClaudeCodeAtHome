import { Effect, Array, Data } from "effect";

// const hello = Effect.gen(function* () {
//   yield* Effect.log("before sleep");
//   yield* Effect.fork(Effect.log("after sleep"));
//   return "hello";
// });

const hello = Effect.gen(function* () {
  yield* Effect.log("beforeSleep").pipe(Effect.fork);
  yield* Effect.log("parent finishing");
  return "hello";
});

await Effect.runPromise(hello);
