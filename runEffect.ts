import { Effect, pipe, Console } from "effect";

const log = Effect.gen(function* () {
  yield* Console.log("ff");
});

const fetchUser = Effect.tryPromise({
  try: () => fetch("/api/user"),
  catch: error => new Error("Failed to fetch user"),
});

const program = log;

Effect.runSync(program);
Effect.runPromise(
  fetchUser.pipe(
    Effect.catchAll(e => Effect.succeed(null)),
    Effect.tap(Console.log)
  )
);
