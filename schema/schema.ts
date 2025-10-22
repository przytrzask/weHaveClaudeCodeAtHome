import {
  Effect,
  Array,
  Data,
  Fiber,
  Console,
  Cause,
  Option,
  Schedule,
  Schema,
} from "effect";

const User = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
});

const decodeUser = Schema.decodeEither(User);

const main = Effect.gen(function* () {
  const either = decodeUser(5 as unknown);

  if (either._tag === "Left") {
    return yield* Effect.succeed("Left");
  }

  return yield* Effect.succeed("Right");
});

const result = await Effect.runPromise(main);

console.log(result);
