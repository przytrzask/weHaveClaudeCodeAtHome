type User = { id: number; name: string };
type Computation<A> = () => A;

const map = <A, B>(
  self: Computation<A>,
  fn: (valueOfSelf: A) => B
): Computation<B> => {
  return () => fn(self());
};

const retry = <A>(self: Computation<A>, retries: number): Computation<A> => {
  let lastError;

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

const catchAll = <A, B>(
  self: Computation<A>,
  fallback: Computation<B>
): Computation<A | B> => {
  return () => {
    try {
      return self();
    } catch {
      return fallback();
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

const fetchUserName = map(fetchUser, user => user.name);

const fetchUserNameWithRetry = retry(fetchUserName, 3);

const fetchNewUserWithRetryAndFallback = catchAll(
  fetchUserNameWithRetry,
  () => null
);
