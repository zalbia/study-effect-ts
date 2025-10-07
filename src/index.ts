import { Effect, Data } from "effect";
import { decodePokemon } from "./schema.js";

class FetchError extends Data.TaggedError("FetchError")<Readonly<{}>> {}

class JsonError extends Data.TaggedError("JsonError")<Readonly<{}>> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
  catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

const program = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) {
    return yield* new FetchError();
  }

  const json = yield* jsonResponse(response);

  return yield* decodePokemon(json);
});

const main = program.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
  })
);

Effect.runPromise(main).then(console.log);
