import { Context, Effect, Layer, Schema } from "effect";
import { FetchError, JsonError } from "./errors.js";
import { Pokemon } from "./schemas.js";
import { PokemonCollection } from "./PokemonCollection.js";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl.js";

const make = {
  getPokemon: Effect.gen(function* () {
    const pokemonCollection = yield* PokemonCollection;
    const buildPokeApiUrl = yield* BuildPokeApiUrl;

    const requestUrl = buildPokeApiUrl({
      name: pokemonCollection[0],
    });

    const response = yield* Effect.tryPromise({
      try: () => fetch(requestUrl),
      catch: () => new FetchError(),
    });

    if (!response.ok) {
      return yield* new FetchError();
    }

    const json = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new JsonError(),
    });

    return yield* Schema.decodeUnknown(Pokemon)(json);
  }),
};

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, typeof make>() {
  static readonly Live = Layer.succeed(this, make);

  static readonly Test = PokeApi.of({
    getPokemon: Schema.decodeUnknown(Pokemon)({
      id: 1,
      height: 10,
      weight: 10,
      order: 1,
      name: "myname",
    }),
  });
}
