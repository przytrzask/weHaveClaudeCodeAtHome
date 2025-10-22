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

const FormSchema = Schema.Struct({
  title: Schema.String.pipe(Schema.minLength(2), Schema.maxLength(100)),
});

const decode = Schema.decodeSync(FormSchema);
const encode = Schema.encodeSync(FormSchema);

const decoded = decode({ title: "Aaa" });
console.log(decoded);

const encoded = encode(decoded);
console.log(encoded);
