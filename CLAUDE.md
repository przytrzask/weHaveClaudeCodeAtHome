# Claude Code Instructions

This is a Node.js project using Effect TypeScript for functional programming with sophisticated error handling, concurrency, and dependency management.

## Project Setup

- **Package Manager**: pnpm
- **TypeScript**: Configured with strict settings and Effect Language Service
- **Module System**: ESM with NodeNext module resolution

## Available Scripts

- `pnpm typecheck` - Run TypeScript compiler checks without emitting files
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm format:staged` - Format staged files
- `pnpm context` - Run context.ts file

## Effect Dependencies

This project has a comprehensive Effect setup:

- `effect` - Core Effect library for functional programming
- `@effect/cli` - CLI application framework
- `@effect/platform` & `@effect/platform-node` - Platform abstractions
- `@effect/sql` - SQL integration
- `@effect/ai-*` - AI integrations (Anthropic, OpenAI)
- `@effect/language-service` - TypeScript language service plugin for enhanced Effect support

## Development Guidelines

### Effect Patterns
- Use Effect's type-safe error handling instead of try/catch
- Prefer Effect.gen for readable async code composition
- Use Services for dependency injection
- Leverage Schema for runtime validation
- Use Layers for dependency management

### TypeScript Configuration
- Effect Language Service is enabled for enhanced compile-time diagnostics
- Strict mode with additional safety (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- Modern module resolution (NodeNext)

### Code Style
- ESM imports/exports
- Strict TypeScript settings enforced
- Prettier for formatting

## Effect Resources

When working with Effect code:
- Check the official Effect documentation for patterns
- Use Effect.gen for readable async composition
- Prefer typed errors over throwing exceptions
- Use Services and Layers for clean architecture
- Leverage Schema for data validation

<!-- effect-solutions:start -->
## Effect Solutions Usage

The Effect Solutions CLI provides curated best practices and patterns for Effect TypeScript. Before working on Effect code, check if there's a relevant topic that covers your use case.

- `effect-solutions list` - List all available topics
- `effect-solutions show <slug...>` - Read one or more topics
- `effect-solutions search <term>` - Search topics by keyword

**Local Effect Source:** The Effect repository is cloned to `~/.local/share/effect-solutions/effect` for reference. Use this to explore APIs, find usage examples, and understand implementation details when the documentation isn't enough.
<!-- effect-solutions:end -->