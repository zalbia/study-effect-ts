import { Effect, Layer } from "effect";
import { PokeApi } from "./PokeApi.js";
import { PokemonCollection } from "./PokemonCollection.js";
import { BuildPokeApiUrl } from "./BuildPokeApiUrl.js";
import { PokeApiUrl } from "./PokeApiUrl.js";

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon  
});

const MainLayer = Layer.mergeAll(
  PokeApi.Live,
  PokemonCollection.Live,
  BuildPokeApiUrl.Live.pipe(Layer.provide(PokeApiUrl.Live)),
  PokeApiUrl.Live
)

const main = program.pipe(
  Effect.provide(MainLayer),
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
  }),
);

Effect.runPromise(main).then(console.log);
