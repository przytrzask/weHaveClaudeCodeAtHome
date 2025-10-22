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

const x = Schema.asSchema(Schema.Literal("yes", "no", 0, 1));

const BooleanFromString = Schema.transform(x, Schema.Boolean, {
  strict: true,
  encode: value => (value ? "yes" : "no"),
  decode: value => value === "yes" || value === 1,
});

type Decoded = typeof BooleanFromString.Type;
type Encoded = typeof BooleanFromString.Encoded;
