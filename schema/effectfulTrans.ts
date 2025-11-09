import { Data, Effect, ParseResult, Schema } from "effect";

class ProductNotFoundError extends Data.TaggedError(
  "ProductNotFoundError"
)<{}> {}

const ProductId = Schema.Trimmed.pipe(Schema.minLength(1));

const Product = Schema.Struct({
  id: ProductId,
  name: Schema.String,
  price: Schema.Number,
});

const ProductRepository = {
  findById: (id: string) =>
    Effect.suspend(() =>
      id === "SKU-123"
        ? Effect.succeed({ id, name: "Widget", price: 499 })
        : new ProductNotFoundError()
    ),
};

const ProductFromId = Schema.transformOrFail(ProductId, Product, {
  strict: true,
  decode: (id, _options, ast, rawId) =>
    ProductRepository.findById(id).pipe(
      Effect.mapError(
        () =>
          new ParseResult.Transformation(
            ast,
            rawId,
            "Encoded",
            new ParseResult.Type(ast.to, rawId, "Product not found ")
          )
      )
    ),
  encode: prod => Effect.succeed(prod.id),
});

const decode = Schema.decodeUnknown(ProductFromId);

decode("SKU-123").pipe(Effect.tap(console.log), Effect.runPromise);
