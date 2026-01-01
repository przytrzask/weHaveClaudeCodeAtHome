import { Console, Context, Effect, Layer, Schema } from "effect";

class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser,
  {
    readonly id: string;
    readonly email: string;
  }
>() {}

class Database extends Effect.Service<Database>()("Database", {
  effect: Effect.gen(function* () {
    yield* Console.log("DatabaseLive created");
    return {
      execute: (query: string) => Effect.succeed(null),
    };
  }),
}) {}

class TodoRepository extends Effect.Service<TodoRepository>()(
  "TodoRepository",
  {
    dependencies: [Database.Default],
    effect: Effect.gen(function* () {
      const database = yield* Database;
      return {
        getTodo: (id: string) => {
          return Effect.succeed(null);
        },
      };
    }),
  }
) {}

class UserRepository extends Effect.Service<UserRepository>()(
  "User Repository",
  {
    dependencies: [Database.Default],
    effect: Effect.gen(function* () {
      const database = yield* Database;

      return {
        getUser() {
          return Effect.gen(function* () {
            const currentUser = yield* CurrentUser;
            return { id: currentUser, name: "John Doe" };
          });
        },
      };
    }),
  }
) {}

const childProgram = Effect.gen(function* () {
  const userRepository = yield* UserRepository;
  const todoRepository = yield* TodoRepository;

  const user = yield* userRepository.getUser();
});

const layers = Layer.merge(UserRepository.Default, TodoRepository.Default);

const program = Effect.gen(function* () {
  yield* childProgram;
  const userRepository = yield* UserRepository;

  const user = yield* userRepository.getUser();
  console.log(user);
});

program.pipe(
  Effect.provideService(CurrentUser, { id: "2", email: "trzasq@trzasq.me" }),
  Effect.provide(layers),
  Effect.runPromise
);
