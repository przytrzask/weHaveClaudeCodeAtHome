import { ParseResult, Schema, Effect } from "effect";
import { constNull, identity } from "effect/Function";

export const NullOrFromFallible = <A, I, R>(
  self: Schema.Schema<A, I, R>,
  options?: {
    readonly logPrefix: string;
  }
) =>
  Schema.NullOr(self).annotations({
    decodingFallback: issue =>
      Effect.logWarning(
        `[${options?.logPrefix}] [NullOrFromFallible] ${ParseResult.TreeFormatter.formatIssueSync(issue)}`
      ).pipe(Effect.map(constNull)),
  });

const User = Schema.Struct({
  name: Schema.String,
  age: NullOrFromFallible(Schema.Number),
});

const decode = Schema.decodeUnknown(User);

decode({ name: "Tomek", age: undefined }).pipe(Effect.runPromise);

export const ArrayFromFallible = <A, I, R>(schema: Schema.Schema<A, I, R>) =>
  Schema.Array(NullOrFromFallible(schema, { logPrefix: "Array" })).pipe(
    Schema.transform(Schema.typeSchema(Schema.Array(schema)), {
      decode: array => array.filter(el => el !== null),
      encode: identity,
      strict: true,
    })
  );

const Todos = ArrayFromFallible(Schema.String);

const decodeArray = Schema.decodeUnknown(Todos);

decodeArray(["Be nice", "go Home", 1, 2]).pipe(
  Effect.tap(console.log),
  Effect.runPromise
);
