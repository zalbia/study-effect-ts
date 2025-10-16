import { Schema } from "effect";

const Author = Schema.Struct({
  name: Schema.String,
  age: Schema.NumberFromString,
});

const authorDecoded = Schema.decodeSync(Author)({ age: "26", name: "Sandro" });
console.log(authorDecoded);

const authorEncoded = Schema.encodeSync(Author)(authorDecoded);
console.log(authorEncoded);
