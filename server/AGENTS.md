# Server Module Guidelines

## Module Context

This Bun server exposes `/api/config` and `/api/generate`, invokes the selected AI provider, and returns preview-ready React code. `generator.ts` and `fallback.ts` deliberately remain pure so they can be unit tested without starting `Bun.serve`.

## Tech Stack & Constraints

- Use Bun's built-in server and `fetch`; this module has no SDK dependency layer.
- `POST /api/generate` accepts only `anthropic` and `google` providers, matching the `Provider` union in [index.ts](index.ts#L57-L65).
- Generated code is executed by react-live with `noInline`, so plain JavaScript and a final `render(...)` call are required.

## Implementation Patterns

- Place provider HTTP handling in `index.ts`; extract side-effect-free response transformations or retry behavior into a focused sibling module.
- For a provider response, reject non-OK responses before parsing successful payload data, as in [index.ts](index.ts#L84-L95) and [index.ts](index.ts#L111-L131).
- Return API errors as JSON with `CORS_HEADERS`; preserve the explicit 429 and 503 mappings in [index.ts](index.ts#L194-L210).

## Testing Strategy

- Run server and frontend tests with `bun run test`.
- Add Vitest unit tests beside pure modules as `server/*.test.ts`.
- Cover success, fallback/failure, and no-op boundary cases, following [fallback.test.ts](fallback.test.ts#L4-L43) and [generator.test.ts](generator.test.ts#L4-L30).

## Local Golden Rules

- Do not return environment API-key values. `/api/config` intentionally returns only `!!ENV_KEYS` booleans in [index.ts](index.ts#L147-L156).
- Do not bypass `stripCodeFences` and `ensureRenderCall` before returning generated code; both defenses are applied together in [index.ts](index.ts#L188-L190) and protect the react-live execution contract.
- Keep Google retries ordered and fail only after every configured model fails. `withModelFallback` preserves the first successful result and throws the last failure in [fallback.ts](fallback.ts#L11-L19).
