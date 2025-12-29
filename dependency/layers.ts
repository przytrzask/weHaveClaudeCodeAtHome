import { Console, Context, Effect, Layer, Schema } from "effect";

class Database extends Context.Tag("Database")<
  Database,
  {
    readonly execute: (query: string) => Effect.Effect<unknown>;
  }
>() {
  static readonly Live = Layer.effect(
    Database,
    Effect.gen(function* () {
      yield* Console.log("DatabaseLive created");
      return {
        execute: (query: string) => Effect.succeed(null),
      };
    })
  );
}

class TodoRepository extends Context.Tag("TodoRepository")<
  TodoRepository,
  {
    readonly getTodo: (id: string) => Effect.Effect<unknown>;
  }
>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const database = yield* Database;
      return {
        getTodo: (id: string) => {
          return Effect.succeed(null);
        },
      };
    })
  ).pipe(Layer.provide(Database.Live));
}

const UserRepositoryLive = Effect.gen(function* () {
  const database = yield* Database;

  return {
    getUser(id: string) {
      return Effect.succeed({ id, name: "John Doe" });
    },
  };
});

class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  Effect.Effect.Success<typeof UserRepositoryLive>
>() {
  static readonly Live = Layer.effect(this, UserRepositoryLive).pipe(
    Layer.provide(Database.Live)
  );
}

const childProgram = Effect.gen(function* () {
  const userRepository = yield* UserRepository;
  const todoRepository = yield* TodoRepository;

  const user = yield* userRepository.getUser("123");
});

const layers = Layer.merge(UserRepository.Live, TodoRepository.Live);

const program = Effect.gen(function* () {
  yield* childProgram;
  const userRepository = yield* UserRepository;

  const user = yield* userRepository.getUser("1234");
  console.log(user);
});

program.pipe(Effect.provide(layers), Effect.runPromise);
