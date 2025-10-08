import { Array, Context, Layer } from "effect";

export class PokemonCollection extends Context.Tag("PokemonCollection")<
  PokemonCollection,
  Array.NonEmptyArray<string>
>() {
  static readonly Live = Layer.succeed(this, [
    "psyduck",
    "cyndaquil",
    "reshiram",
  ]);
}
