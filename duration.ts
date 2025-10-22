import { NodeRuntime } from "@effect/platform-node";
import { Effect, Duration, Ref, Fiber, Console } from "effect";

import { type DurationInput } from "effect/Duration";

type DebounceOptions = {
  mode: "leading" | "trailing";
};

const debounce = <A extends any[], O>(
  fn: (...args: A) => Effect.Effect<O>,
  duration: DurationInput,
  options: DebounceOptions = { mode: "trailing" }
) => {
  const fiberRef = Ref.unsafeMake<Fiber.RuntimeFiber<O> | null>(null);
  const lastCallTime = Ref.unsafeMake<Duration.Duration>(Duration.zero);

  return (...args: A) => {
    return Effect.gen(function* () {
      const now = Duration.millis(Date.now());
      const prevCallTime = yield* Ref.get(lastCallTime);
      yield* Ref.set(lastCallTime, now);

      const timeSinceLastCall = Duration.subtract(now, prevCallTime);
      const shouldCallNow =
        options.mode === "leading" &&
        Duration.greaterThan(timeSinceLastCall, duration);

      const prevFiber = yield* Ref.get(fiberRef);
      if (prevFiber !== null) {
        yield* Fiber.interrupt(prevFiber);
      }

      if (shouldCallNow) {
        yield* fn(...args);
      } else {
        const newFiber = yield* Effect.fork(
          Effect.sleep(duration).pipe(
            Effect.andThen(() => fn(...args)),
            Effect.onInterrupt(() => Console.log("interrupted"))
          )
        );
        yield* Ref.set(fiberRef, newFiber);
        yield* Fiber.join(newFiber);
      }
    });
  };
};

const testFn = (a: number, b: number) => {
  return Effect.gen(function* () {
    yield* Console.log("testFn", a, b);
  });
};

const main = Effect.gen(function* () {
  yield* debounce(testFn, Duration.millis(1000), { mode: "leading" })(1, 2);

  yield* debounce(testFn, "1 second")(1, 2);
});

main.pipe(NodeRuntime.runMain);
