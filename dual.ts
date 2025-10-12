import { pipe, Effect } from "effect";
import { dual } from "effect/Function";

type User = { id: number; name: string };
type Computation<A> = () => A;

const map: {
  <A, B>(f: (a: A) => B): (self: Computation<A>) => Computation<B>;
  <A, B>(self: Computation<A>, f: (a: A) => B): Computation<B>;
} = dual(2, <A, B>(self: Computation<A>, f: (a: A) => B): Computation<B> => {
  return () => {
    const a = self();
    return f(a);
  };
});

const retry =
  <A>(retries: number) =>
  (self: Computation<A>): Computation<A> => {
    let lastError: unknown;

    return () => {
      for (let i = 0; i < retries; i++) {
        try {
          return self();
        } catch (error) {
          lastError = error;
          console.error(error);
        }
      }

      throw lastError;
    };
  };

const catchAll =
  <A, B>(fallback: (e: unknown) => B) =>
  (self: Computation<A>) => {
    return () => {
      try {
        return self();
      } catch (e) {
        return fallback(e);
      }
    };
  };

const fetchUser: Computation<User> = () => {
  if (Math.random() > 0.25) {
    return { id: 1, name: "Alice" };
  } else {
    throw new Error("Network request failed!");
  }
};

const dummyProgram = map(fetchUser, u => u.name);

const moreDummyProgram = map(u => u.name)(fetchUser);

const program = pipe(
  fetchUser,
  map(user => user.name),
  retry(3),
  catchAll(e => null)
);

console.log(program());
