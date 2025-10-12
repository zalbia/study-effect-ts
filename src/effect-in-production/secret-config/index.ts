import { Config, Effect, Console, Redacted } from "effect";

const doSomeDangerousStuff = (secret: string) =>
  Console.log(`DANGEROUSLY PRINTING SECRET: ${secret}`);

const program = Effect.gen(function* () {
  const secretKey = yield* Config.redacted("SECRET_KEY");
  yield* doSomeDangerousStuff(Redacted.value(secretKey));
  yield* Console.log(`Trying to print secret: ${secretKey}`);
});

Effect.runSync(program);
