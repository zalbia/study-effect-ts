import { Effect, Layer } from "effect";
import { PokeApi } from "./PokeApi.js";

const MainLayer = Layer.mergeAll(PokeApi.Live)

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon  
});

const main = program.pipe(
  Effect.provide(MainLayer),
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
  }),
);

Effect.runPromise(main).then(console.log);
