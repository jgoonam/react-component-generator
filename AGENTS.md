# Agent Guidelines

## Operational Commands

- Install dependencies: `bun install`
- Run the API server and Vite together: `bun run dev`
- Run only the Bun API server: `bun run server`
- Build the frontend: `bun run build`
- Lint TypeScript and TSX: `bun run lint`
- Run all tests once: `bun run test`
- Watch tests: `bun run test:watch`
- Use Bun for project commands. The scripts and lockfile are Bun-based.

## Golden Rules

- Keep generated preview code compatible with `react-live` `noInline`: it must be self-contained JavaScript with no imports and end in a `render(<Component />)` call. The generation contract is defined in [server/index.ts](server/index.ts#L7-L20), normalized in [server/generator.ts](server/generator.ts#L16-L23), and executed as `noInline` in [src/components/LivePreview.tsx](src/components/LivePreview.tsx#L14-L19).
- Preserve both layers of generation-code normalization. Do not remove fence stripping or automatic `render` injection without replacing their tested behavior; tests cover their boundary cases in [server/generator.test.ts](server/generator.test.ts#L4-L30).
- Preserve Google model ordering and sequential fallback. The ordered list in [server/index.ts](server/index.ts#L4-L5) is consumed by `withModelFallback`, which stops at the first success and rethrows the final failure in [server/fallback.ts](server/fallback.ts#L3-L19); those outcomes are tested in [server/fallback.test.ts](server/fallback.test.ts#L4-L43).
- Treat provider API keys as server-side secrets. Environment-key status may be exposed only as booleans through `/api/config`, as implemented in [server/index.ts](server/index.ts#L59-L65) and [server/index.ts](server/index.ts#L147-L156); never add a response that returns an environment key.
- Keep the Vite `/api` proxy target aligned with the Bun server port: [vite.config.ts](vite.config.ts#L8-L15) proxies to the server created on port 3002 in [server/index.ts](server/index.ts#L138-L140).

## TDD Rule

**이 규칙은 Rigid — 상황에 맞게 변형하지 마라.** 하위 디렉토리의 `AGENTS.md`에 별도 TDD 규칙이 있으면 그것을 우선 적용한다. 이 섹션은 전역 기본값(fallback)이다.

### 적용 기준

- **반드시 적용:** 비즈니스 로직, API, 유틸리티, 버그 수정.
- **불필요:** 타입 정의, 설정 파일, 순수 UI, SQL.

### RED-GREEN-REFACTOR

1. **RED:** 하나의 동작에는 하나의 테스트만 작성한다. 반드시 실행하여 실패를 확인하고, 실패 이유가 **기능 미구현**이어야 한다.
2. **GREEN:** 테스트를 통과시키는 최소 코드만 작성한다. **YAGNI**를 지키고, 신규 및 기존 테스트 전체가 통과하는지 확인한다.
3. **REFACTOR:** 중복 제거, 이름 개선, 헬퍼 추출만 수행한다. green 상태를 유지하며 새 동작을 추가하지 않는다.
4. **반복:** 다음 동작의 RED로 돌아간다.

### 삭제 강제 규칙

- 테스트 전에 프로덕션 코드를 먼저 작성했다면 **반드시 삭제**하고 RED부터 재시작한다.
- 나중을 위한 **참고용 코드로 남기는 것도 금지**한다.

### 변명 차단

| 변명 | 반론 |
| --- | --- |
| 너무 단순해서 테스트 불필요 | 단순한 동작도 요구사항과 회귀 방지를 검증해야 한다. |
| 나중에 추가하겠다 | 테스트 없이 작성한 코드는 삭제하고 지금 RED부터 다시 시작한다. |
| 시간이 없다 | 테스트 부채는 시간을 절약하지 않으며, 최소 단위 테스트부터 작성한다. |
| 삭제하면 낭비 | 검증되지 않은 선행 코드는 자산이 아니므로 삭제한다. |
| 프로토타입이다 | 적용 기준에 해당하면 프로토타입도 동일한 TDD 규칙을 따른다. |

## Project Context

This application generates React UI components from Korean-language prompts, then lets users preview and inspect the generated code. It supports Anthropic and Google providers through a Bun API proxy.

Stack: React 19, TypeScript, Vite, Bun, react-live, Vitest, Testing Library, ESLint.

## Standards & References

- Follow the existing TypeScript, React, and semicolon style in the file being edited. TypeScript is strict and unused locals/parameters are errors; see [tsconfig.app.json](tsconfig.app.json).
- Put pure server transformation or retry logic in focused modules and add Vitest coverage with the implementation, following the existing `server/*.test.ts` pattern.
- Use Korean Conventional Commit messages: `feat: 요약`, `fix: 요약`, `refactor: 요약`, or `chore: 요약`. Analyze and separate logical changes before requesting approval to commit.
- When code behavior or project commands diverge from these rules, propose updating this file with current code evidence.
