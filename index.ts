import "dotenv/config";

import { FileSystem, Path } from "@effect/platform";
import { Effect, Console, Config, Layer, Schema, ExecutionPlan } from "effect";
import { Prompt } from "@effect/cli";
import {
  NodeContext,
  NodeRuntime,
  NodeHttpClient,
} from "@effect/platform-node";

import { AnthropicClient, AnthropicLanguageModel } from "@effect/ai-anthropic";

import { AiChat, AiTool, AiToolkit } from "@effect/ai";
import { catchTags } from "effect/Effect";

const ListToolInput = Schema.Struct({
  path: Schema.String.annotations({
    description: "The absolute path of the directory to list",
  }),
});

const ListToolOutput = Schema.Struct({
  files: Schema.Array(Schema.String),
  directories: Schema.Array(Schema.String),
});

const ListTool = AiTool.make("List", {
  description: "List the contents of a directory",
})
  .setParameters(ListToolInput)
  .setSuccess(ListToolOutput);

const ReadToolInput = Schema.Struct({
  path: Schema.String.annotations({
    description: "The absolute path of the file to read",
  }),
});

const ReadToolOutput = Schema.Struct({
  content: Schema.String,
});

const ReadTool = AiTool.make("Read", {
  description: "Read the contents of a file",
})
  .setParameters(ReadToolInput)
  .setSuccess(ReadToolOutput);

const Toolkit = AiToolkit.make(ListTool, ReadTool);

const StubToolkitLayer = Toolkit.toLayer({
  List: ({ path }) =>
    Effect.gen(function* () {
      yield* Console.log(`List(${path})`);
      return {
        files: ["enemies.txt", "CLAUDE.md", `${path}-directory.txt`],
        directories: ["secrets/", "passwords/"],
      };
    }),
  Read: ({ path }) =>
    Effect.gen(function* () {
      yield* Console.log(`Read(${path})`);
      return {
        content: "I am secretly afraid of lettuce.",
      };
    }),
});

const DangerousToolkitLayer = Toolkit.toLayer(
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const pathService = yield* Path.Path;

    return {
      List: ({ path }: { path: string }) =>
        Effect.gen(function* () {
          yield* Console.log(`List(${path})`);

          const entries = yield* fs.readDirectory(path);
          const files: Array<string> = [];
          const directories: Array<string> = [];

          for (const name of entries) {
            const fullPath = pathService.isAbsolute(name)
              ? name
              : pathService.join(path, name);
            const stat = yield* fs.stat(fullPath);
            if (stat.type === "File") {
              files.push(fullPath);
            } else if (stat.type === "Directory") {
              directories.push(fullPath);
            }
          }

          return { files: files.sort(), directories: directories.sort() };
        }).pipe(
          Effect.catchAll((_) =>
            Effect.succeed({ files: [], directories: [] }),
          ),
        ),
      Read: ({ path }) =>
        Effect.gen(function* () {
          yield* Console.log(`Read(${path})`);
          const content = yield* fs.readFileString(path);
          return { content };
        }).pipe(
          Effect.catchAll((error) =>
            Effect.succeed({ content: error.message }),
          ),
        ),
    };
  }),
).pipe(Layer.provide(NodeContext.layer));

const main = Effect.gen(function* () {
  const chat = yield* AiChat.fromPrompt({
    prompt: [],
    system: [
      "You are helpful assistant",
      `You live in my terminal at cwd ${process.cwd()}`,
    ].join("\n"),
  });

  while (true) {
    const input = yield* Prompt.text({ message: "What you want?" });
    let turn = 1;
    yield* Console.log(`TURN: ${turn}`);
    // text + tool calls
    let response = yield* chat.generateText({
      prompt: input,
      toolkit: Toolkit,
    });
    yield* Console.log(response.text);

    while (response.toolCalls.length > 0) {
      turn += 1;
      yield* Console.log(`TURN: ${turn}`);
      response = yield* chat.generateText({
        prompt: [],
        toolkit: Toolkit,
      });
      yield* Console.log(response.text);
    }
  }
});

const AnthropicLayer = AnthropicClient.layerConfig({
  apiKey: Config.redacted("ANTHROPIC_API_KEY"),
}).pipe(Layer.provide(NodeHttpClient.layerUndici));



const ClaudeSonnet = AnthropicLanguageModel.model("claude-sonnet-4-20250514") 
  .pipe(Layer.provide(AnthropicLayer));

  const ClaudeSonnet37 = AnthropicLanguageModel.model("claude-3-7-sonnet-latest") 
  .pipe(Layer.provide(AnthropicLayer));


  const Plan = ExecutionPlan.make({
    provide: ClaudeSonnet,
    attempts: 1
    
  }, {
    attempts: 2,
    provide: ClaudeSonnet37,
  })


  const program  = Effect.withExecutionPlan(main,Plan)


const AppLayer = Layer.mergeAll(
  NodeContext.layer,
  DangerousToolkitLayer,
);

program.pipe(Effect.provide(AppLayer), NodeRuntime.runMain);
