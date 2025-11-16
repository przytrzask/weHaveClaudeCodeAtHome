import { Context, Effect, Schema } from "effect";

const UserId = Schema.String.pipe(Schema.brand("UserId"));

type UserId = typeof UserId.Type;

class User extends Schema.Class<User>("User")({
  name: Schema.String,
  email: Schema.String,
}) {}

// class UserRepository extends Context.Tag("UserRepository")<
//   UserRepository,
//   {
//     readonly getUser: (id: UserId) => Effect.Effect<User>;
//   }
// >() {}
//

const UserRepositoryLive = Effect.gen(function* () {
  yield* Effect.sleep("1 second");
  console.log("Initializing UserRepository");
  return {
    getUser: (id: UserId) =>
      Effect.succeed(new User({ name: "John Doe", email: "john@example.com" })),
  };
});

class UserRepository extends Context.Tag("UserRepository")<
  UserRepository,
  Effect.Effect.Success<typeof UserRepositoryLive>
>() {
  static readonly Live = UserRepositoryLive;
}

const childProgram = Effect.gen(function* () {
  const userRepository = yield* UserRepository;

  const user = yield* userRepository.getUser(UserId.make("123"));
  console.log(user);
}).pipe(
  Effect.provideService(UserRepository, {
    getUser(id: UserId) {
      return Effect.succeed(new User({ email: "k@gmail.com", name: "Kasia" }));
    },
  })
);

const program = Effect.gen(function* () {
  yield* childProgram;
  const userRepository = yield* UserRepository;

  const user = yield* userRepository.getUser(UserId.make("13"));
  console.log(user);
}).pipe(Effect.provideServiceEffect(UserRepository, UserRepository.Live));

program.pipe(Effect.runPromise);
