import { Effect, Array, Data, Fiber, Console, Cause, Option } from "effect";
import { fail } from "effect/TDeferred";

class CustomError extends Data.TaggedError("CustomError")<{
  code: string;
  message: string;
}> {}

const program = Effect.gen(function* () {
  return yield* new CustomError({
    code: "ERR_001",
    message: "Something went wrong",
  });
});
// .pipe(Effect.catchTag("CustomError", err => Effect.log(err.message)));

const exit = await Effect.runPromiseExit(program);

if (exit._tag === "Failure") {
  const failureOption = Cause.failureOption(exit.cause);

  if (failureOption._tag === "Some") {
    const error = failureOption.value;
    console.log(`Error code: ${error.code}, message: ${error.message}`);
  }

  // exit.cause.pipe(Effect.logError, Effect.runPromise);
}
