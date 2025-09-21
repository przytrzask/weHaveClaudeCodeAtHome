import { Effect, Console, pipe, Layer } from "effect";
import {
  NodeContext,
  NodeFileSystem,
  NodeRuntime,
} from "@effect/platform-node";

import { Command, Options, Args } from "@effect/cli";

// bash
// # Basic usage - output files to stdout
// context-cli "src/**/*.ts" "*.json"

// # Include a custom prompt (long option)
// context-cli --copy -prompt "Analyze this TypeScript codebase for potential improvements"

// # Copy to clipboard instead of printing (long option)
// context-cli —copy "src/**/*"
// # Output: Copied 42 files to clipboard

// # Combine multiple patterns with long options
// context-cli -prompt "Review test coverage" --copy "sIc/**/*.ts" "tests/**/*.test.ts"
//

// 1/ ## Optionsa

// - '-p, -prompt TEXT'
// - '-c, -copy"
// - '-h, -help' Include a custom prompt with the output
// Copy output to clipboard instead of printing to stdout
// Show help message "**/*.ts"

const prompt = Options.text("prompt").pipe(
  Options.withAlias("p"),
  Options.withDescription("Include a custom prompt with the output"),
);

const copy = Options.boolean("copy").pipe(
  Options.withAlias("c"),
  Options.withDescription(
    "Copy output to clipboard instead of printing to stdout"
  )
);

const globs = Args.text({ name: "globs" }).pipe(Args.withDescription("The globs to search for files"), Args.repeated);

const command = Command.make("context-cli", { prompt, copy, globs }).pipe(
  Command.withHandler(
    Effect.fn(function* ({ copy, prompt, globs }) {
      yield* Console.log(`Behbld my options: copy = ${copy} prompt = ${prompt} globs=${globs}`)
      yield* Console.log(`Globs: ${globs}`)
    })
  )
);

const cliapp = Command.run(command, { name: "context-cli", version: "0.1.0" });

const AppLayer = NodeContext.layer;

cliapp(process.argv).pipe(Effect.provide(AppLayer), NodeRuntime.runMain);
