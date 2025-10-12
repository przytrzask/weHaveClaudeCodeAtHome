import { Effect, Array } from "effect";

const divide = (a: number, b: number) =>
  Effect.suspend(() => {
    if (b === 0) {
      return Effect.fail(new Error("Division by zero"));
    }
    return Effect.succeed(a / b);
  });

const fetchMultiplier = (average: number) => Effect.succeed(2); // imagine this fetches from API

const persist = (id: string, average: number, adjusted: number) => Effect.void; // imagine this writes to DB

const gen = Effect.gen(function* () {
  const report = yield* Effect.sync(() => ({
    id: "123",
    timestamp: new Date().toISOString(),
    values: [10, 20, 30, 40],
  }));

  if (Array.isEmptyArray(report.values)) {
    return yield* Effect.fail(new Error("Empty array"));
  }

  const sum = report.values.reduce((a, b) => a + b, 0);
  const average = yield* divide(sum, report.values.length);

  yield* fetchMultiplier(average).pipe(
    Effect.tap(multiplier => persist("123", average, average * multiplier))
  );

  return average;
}).pipe(Effect.orElseSucceed(() => 0));

Effect.runPromise(gen).then(console.log);
