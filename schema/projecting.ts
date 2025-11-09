import type { select } from "@effect/cli/Prompt";
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
}).pipe(self =>
  Schema.transform(
    Schema.typeSchema(
      Schema.Struct({
        title: Schema.String,
        completed: Schema.Boolean,
        createdAt: Schema.String,
      })
    ),
    {
      strict: true,
      decode: self => ({
        ...self,
        createdAt: self.created_at.toString(),
      }),
      encode: input => ({ ...input, created_at: new Date(input.createdAt) }),
    }
  )
);
