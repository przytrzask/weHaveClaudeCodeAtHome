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
} from "effect";

const Todo = Schema.Struct({
  title: Schema.String,
  completed: Schema.Boolean,
  created_at: Schema.DateFromString,
});
