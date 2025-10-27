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
  identity,
} from "effect";

const Todo = Schema.Struct({
  title: Schema.String,
  completed: Schema.Boolean,
  created_at: Schema.DateFromString,
});

const Todo1 = Schema.transform(
  Todo,
  Schema.Struct({
    title: Schema.String,
    completed: Schema.Boolean,
    createdAt: Schema.String,
  }),
  {
    decode: input => ({ ...input, createdAt: input.created_at.toString() }),
    encode: input => ({ ...input, created_at: new Date(input.createdAt) }),
    strict: true,
  }
);
