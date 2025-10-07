import { Effect } from "effect";
import type { UnknownException } from "effect/Cause";

const fetchRequest: Effect.Effect<Response, UnknownException> = Effect.promise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);

const jsonResponse = (response: Response) =>
  Effect.promise(() => response.json());

const main = Effect.flatMap(fetchRequest, jsonResponse);

Effect.runPromise(main);
