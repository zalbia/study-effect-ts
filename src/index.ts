import { Effect } from "effect";
import { PokeApi } from "./PokeApi.js";

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon  
});

const main = program.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
  }),
  Effect.provideService(PokeApi, PokeApi.Live)
);

Effect.runPromise(main).then(console.log);
