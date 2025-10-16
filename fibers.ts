import { Effect, Array, Data, Fiber } from "effect";

// const hello = Effect.gen(function* () {
//   yield* Effect.log("before sleep");
//   yield* Effect.fork(Effect.log("after sleep"));
//   return "hello";
// });
//
class CustomError extends Data.TaggedError("CustomError") {}

const hello = Effect.gen(function* () {
  yield* Effect.log("beforeSleep").pipe(Effect.fork);
  yield* Effect.log("parent finishing");
  return "hello";
});

const slow = Effect.gen(function* () {
  yield* Effect.sleep("2 seconds");
  return yield* new CustomError();
});

const prog = Effect.gen(function* () {
  const fiber = yield* Effect.fork(slow);
  const exit = yield* Fiber.join(fiber);
  // exit is Exit<number, CustomError>

  if (exit._tag === "Success") {
    yield* Effect.log(`Got: ${exit.value}`);
  } else {
    yield* Effect.log("Failed, but no error propagated");
  }
});

Effect.runPromise(prog);
