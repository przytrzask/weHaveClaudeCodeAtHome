import { Effect, Schema } from "effect";

const PersonId = Schema.String.pipe(Schema.brand("PersonId"));

const UserSchema = Schema.Struct({
  id: PersonId,
  name: Schema.String,
});

type User = typeof UserSchema.Type;

const decode = Schema.decodeSync(UserSchema);

const parseUser = (user: User) => user.id;

// parseUser({
//   // Type 'string' is not assignable to type 'string & Brand<"PersonId">'.
//   // Type 'string' is not assignable to type 'Brand<"PersonId">'. (ts 2322)
//   id: "asdf",
//   name: "Tomek",
// });

parseUser(
  decode({
    id: "nana",
    name: "Tomek",
  })
);
