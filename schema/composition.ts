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
  Struct,
} from "effect";

const UserInput = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
});

// This will generate output like
// name: Schema.NonEmptyString,

// const UserOutput = Schema.compose(
//   UserInput,
//   Schema.Struct({
//     name: Schema.NonEmptyString,
//   })
// );

// type UserInput = typeof UserInput.Type;
// type UserOutput = typeof UserOutput.Type;
//
//
// this will generate output like
// const UserOutput: Schema.Struct<{
//     readonly name: typeof Schema.NonEmptyString;
//     readonly age: typeof Schema.Number;
// }>

const UserOutput = Schema.Struct(
  Struct.evolve(UserInput.fields, { name: () => Schema.NonEmptyString })
);
