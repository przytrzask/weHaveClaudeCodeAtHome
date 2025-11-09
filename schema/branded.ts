import { Effect, Schema } from "effect";

const PersonId = Schema.String.pipe(Schema.brand("PersonId"));

const UserSchema = Schema.Struct({
  id: PersonId,
  name: Schema.String,
});

type User = typeof UserSchema.Type;

const decode = Schema.decodeSync(UserSchema);

const parseUser = (user: User) => user.id;

parseUser({
  id: "asdf",
  name: "Tomek",
});

parseUser(
  decode({
    id: "nana",
    name: "Tomek",
  })
);
