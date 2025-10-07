import { Effect, pipe } from "effect";
import type { UnknownException } from "effect/Cause";

const fetchRequest: Effect.Effect<Response, UnknownException> = Effect.promise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/")
);

const jsonResponse = (response: Response) =>
  Effect.promise(() => response.json());

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() =>
    fetch("/api/pokemon", { body: JSON.stringify(pokemon) })
  )

const main = pipe(
  fetchRequest,
  Effect.flatMap(jsonResponse),
  Effect.flatMap(savePokemon),
  Effect.catchTag("UnknownException", () =>
    Effect.succeed("There was an error")
  )
)

Effect.runPromise(main);
