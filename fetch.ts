import { Effectify } from "@effect/platform";
import {
  Effect,
  Array,
  Data,
  Fiber,
  Console,
  Cause,
  Option,
  Schedule,
} from "effect";

class RequestError extends Data.TaggedError("RequestError")<{
  cause: unknown;
}> {}

class ResponseError extends Data.TaggedError("ResponseError")<{
  status: number;
}> {}

// const fetchWrapper = (url: string) =>
//   Effect.tryPromise({
//     try: abortSignal => fetch(url, { signal: abortSignal }),
//     catch: err => {
//       return new RequestError({ cause: err });
//     },
//   }).pipe(
//     Effect.filterOrFail(
//       response => response.ok,
//       response => new ResponseError({ status: response.status })
//     )
//   );

const fetchWrapper = Effect.fn(function* (url: string) {
  const response = yield* Effect.tryPromise({
    try: () => fetch(url),
    catch: err => new RequestError({ cause: err }),
  });

  if (!response.ok) {
    return yield* new ResponseError({ status: response.status });
  }
  return response;
});

const main = Effect.gen(function* () {
  const response = yield* fetchWrapper(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  const json = yield* Effect.tryPromise({
    try: () => response.json(),
    catch: err => new RequestError({ cause: err }),
  });

  return json;
}).pipe(
  Effect.retry({
    times: 3,
    schedule: Schedule.exponential(100),
    while: err => err._tag === "RequestError" || err.status === 500,
  }),
  Effect.tap(Console.log)
);
Effect.runPromise(main);
