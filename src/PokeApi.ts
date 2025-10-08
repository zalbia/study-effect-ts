import { Config, Context, Effect, Schema, type ParseResult } from "effect";
import type { ConfigError } from "effect/ConfigError";
import { FetchError, JsonError } from "./errors.js";
import { Pokemon } from "./schemas.js";

export interface PokeApi {
  readonly getPokemon: Effect.Effect<
    Pokemon,
    FetchError | JsonError | ParseResult.ParseError | ConfigError
  >;
}

export const PokeApi = Context.GenericTag<PokeApi>("PokeApi");

const fetchRequest = (baseUrl: string) =>
  Effect.tryPromise({
    try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
    catch: () => new FetchError(),
  });

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

const config = Config.string("BASE_URL");

export const PokeApiLive = PokeApi.of({
  getPokemon: Effect.gen(function* () {
    const baseUrl = yield* config;
    const response = yield* fetchRequest(baseUrl);
    if (!response.ok) {
      return yield* new FetchError();
    }

    const json = yield* jsonResponse(response);

    return yield* Schema.decodeUnknown(Pokemon)(json);
  }),
});
