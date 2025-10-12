import { timestamp } from "@effect/cluster/Snowflake";
import { Array, Effect } from "effect";
import { LengthSchemaId } from "effect/Schema";

const divide = (a: number, b: number) =>
  Effect.suspend(() => {
    if (b === 0) {
      return Effect.fail(new Error("Division by zero"));
    }
    return Effect.succeed(a / b);
  });

const program = Effect.sync(() => ({
  id: "report-123",
  timestamp: new Date().toISOString(),
  // values: [10, 20, 30, 40],
  values: Array.empty<number>(),
})).pipe(
  Effect.map(data => data.values),
  Effect.flatMap(values => {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return divide(sum, values.length);
  }),
  Effect.orElseSucceed(() => 0)

  // Effect.flatMap(data => divide(data.sum, data.length)),
  // Effect.filterOrFail(Array.isNonEmptyArray, () => new Error("Empty Array")),
);

Effect.runPromise(program).then(console.log);
