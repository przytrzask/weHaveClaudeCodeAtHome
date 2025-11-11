import type { PiB } from "@effect/platform/FileSystem";
import { Effect, Console, Scope } from "effect";

// same as Effect.scoped
const scoped = <A, E, R>(
  self: Effect.Effect<A, E, R>
): Effect.Effect<A, E, Exclude<R, Scope.Scope>> =>
  Effect.gen(function* () {
    const scope = yield* Scope.make();
    const extended = Scope.extend(self, scope);

    return yield* extended.pipe(Effect.onExit(() => Console.log("Exiting...")));
  });

const program = Effect.gen(function* () {
  yield* Effect.addFinalizer(() => Console.log("Finalizing..."));
  // yield* Effect.dieMessage("ups");
  yield* Effect.addFinalizer(() => Console.log("another finalizer..."));
}).pipe(Effect.scoped, Effect.runPromise);
