import  { Schema , Effect} from "effect";

export type AnySchema = Schema.Schema.AnyNoContext | typeof Schema.Never

export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD"

export type EnpointHandler<PayloadSchema extends AnySchema,
  SuccessSchema extends AnySchema,
  ErrorSchema extends AnySchema> =
  (request: {
    readonly payload: Schema.Schema.Type<PayloadSchema>
  })  => Effect.Effect<SuccessSchema, ErrorSchema>


export type ProvideHandler<PayloadSchema extends AnySchema,
  SuccessSchema extends AnySchema,
  ErrorSchema extends AnySchema> = <Handler extends EnpointHandler<PayloadSchema, SuccessSchema, ErrorSchema>>(handler: Handler) => Handler



export type RegisterEndpoint<PayloadSchema extends AnySchema, SuccessSchema extends AnySchema, FailureSchema extends AnySchema> = {
  method: Methods
  path: string
  payloadSchema: PayloadSchema
  success: SuccessSchema
  failure: FailureSchema
  handler: EnpointHandler<PayloadSchema, SuccessSchema, FailureSchema>
};

export type AnyRegisteredEndpoint = RegisterEndpoint<AnySchema, AnySchema, AnySchema>
