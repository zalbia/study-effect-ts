import { Effect, Schema } from "effect";
import type { ParseError } from "effect/ParseResult";

const HeightFormat = Schema.Number.pipe(
  Schema.transform(Schema.String, {
    decode: from => `${from * 10}cm`,
    encode: to => Number(to.substring(0, to.length - 2)) / 10,
  })
);

export class Pokemon extends Schema.Class<Pokemon>("Pokemon")({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: HeightFormat,
  weight: Schema.Number,
}) {}

type Encoded = typeof HeightFormat.Encoded;
type Decoded = typeof HeightFormat.Type;

// effectful codec
const heightFormat: Effect.Effect<string, ParseError> = Schema.decode(HeightFormat)(17.5);
const backToNumber: Effect.Effect<number, ParseError> = Schema.encode(HeightFormat)("175cm");
