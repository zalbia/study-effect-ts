import { Schema } from "effect";

const Pokemon = Schema.Struct({
    id: Schema.Number,
    order: Schema.Number,
    name: Schema.String,
    height: Schema.Number,
    weight: Schema.Number,
});

export const decodePokemon = Schema.decodeUnknown(Pokemon);
