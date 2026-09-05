
import { Effect, Console, pipe, Layer, Scope, Duration, Option, Clock } from "effect";
import { DurationFromMillis } from "effect/Schema";


const cacheSuccessSWR = <A, E, R>(effect: Effect.Effect<A, E, R>, duration: Duration.DurationInput) => {

  return Effect.gen(function* () {
    const cacheDuration = Duration.decode(duration);
    let cache = Option.none<[expiry: number, value: A]>();
    const sem = yield* Effect.makeSemaphore(1);

    const now = yield* Clock.currentTimeMillis

    if(Option.isSome(cache)) {
      const [ expiry, value ] = cache.value;
      if(now < expiry) {
        return value;
      } else {
        const newValue = yield* effect;
        const completedAt = yield* Clock.currentTimeMillis
        cache = Option.some([completedAt, newValue]);
        return newValue;
      }
    }



//On cache miss: blocks and waits for the effect to complete, then caches the result

    const result = yield* effect;
    const completedAt = yield* Clock.currentTimeMillis
    cache = Option.some([completedAt, result]);

    return result;
  });
};


const dummyEffect = Effect.succeed("nanna");
cacheSuccessSWR(dummyEffect, Duration.minutes(1))

// cacheSuccessSWR(effectToCache, "1 minute"): Effect.Effect<Effect.Effect<A, E, R›, never, Scope. Scope>
