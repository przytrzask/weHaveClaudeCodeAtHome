import { Effect, Array, Data } from "effect";

class MyError extends Data.TaggedError("MyError") {}

class CustomError extends Data.TaggedError("CustomError") {}

class NetworkError extends Data.TaggedError("NetworkError") {}

class RequestError extends Data.TaggedError("RequestError") {}

const networkEffect = Effect.succeed(
  "Network effect succeeded"
) as Effect.Effect<string, NetworkError>;
const requestError = Effect.succeed(
  "Request effect succeeded"
) as Effect.Effect<string, RequestError>;
const customEffect = Effect.succeed("Custom effect succeeded") as Effect.Effect<
  string,
  CustomError
>;

const program = Effect.gen(function* () {
  const a = yield* networkEffect;
  const b = yield* requestError;
  const c = yield* customEffect;
});

const res = program.pipe(
  Effect.catchTags({
    CustomError: () => Effect.void,
    RequestError: () => Effect.void,
    NetworkError: error => Effect.fail(new Error("Generic network error")),
  })
);
