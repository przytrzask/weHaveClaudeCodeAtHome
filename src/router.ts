import { Context, Effect, Layer } from "effect";

import type { RegisterEndpoint, AnySchema, AnyRegisteredEndpoint } from "./types.js";

const makeRouteKey = (method: string, path: string) => `${method} ${path}`;

export declare namespace Router {
  export type Type = {
    readonly register: <
      PayloadSchema extends AnySchema,
      SuccessSchema extends AnySchema,
      FailureSchema extends AnySchema,
    >(endpoint: RegisterEndpoint<
        PayloadSchema,
        SuccessSchema,
        FailureSchema
      >) => Effect.Effect<void>,
    readonly endpoints: Effect.Effect<ReadonlyArray<AnyRegisteredEndpoint>>,

  };
}

export class Router extends Context.Tag("Router")<Router, Router.Type>() {
  static readonly Live = Layer.sync(this, () => {
    const routes = new Map<string, AnyRegisteredEndpoint>()

    return this.of({
      endpoints: Effect.sync(() => Array.from(routes.values())),
      register: (endpoint) => Effect.suspend(() => {
        const key = makeRouteKey(endpoint.method, endpoint.path)

        if (routes.has(key)) {
         return Effect.dieMessage(`Endpoint already registered: ${key}`)
        }

        routes.set(key, endpoint)
        return Effect.void
      }),

      })

    })

}
