import { Effect, Array, Data, Fiber, Console } from "effect";

const repeat = Console.log("hello").pipe(
  Effect.delay("200  millis"),
  Effect.repeat({ times: 20 })
);

class CustomError extends Data.TaggedError("CustomError") {}

const helo = Effect.gen(function* () {
  yield* Effect.fork(repeat);
  yield* Effect.sleep("2  seconds");
  return yield* Effect.interrupt;
  // return yield* new CustomError();
});

Effect.runPromise(helo);
