import { Config, Context, Effect, Schema, type ParseResult } from "effect";
import type { ConfigError } from "effect/ConfigError";
import { FetchError, JsonError } from "./errors.js";
import { Pokemon } from "./schemas.js";

interface PokeApiImpl {
  readonly getPokemon: Effect.Effect<
    Pokemon,
    FetchError | JsonError | ParseResult.ParseError | ConfigError
  >;
}

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

export class PokeApi extends Context.Tag("PokeApi")<PokeApi, PokeApiImpl>() {
  static readonly Live = PokeApi.of({
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
