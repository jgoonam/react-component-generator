---
name: create-pr
description: Delegate creation of a GitHub pull request to a subagent, choosing a Korean or English template based on the repository's project context. Use when the user asks to create, open, or submit a PR.
---

# Create Pull Request

Delegate the complete pull-request workflow to a subagent. The parent agent must not create the PR itself.

## Delegation

Spawn one subagent with the current repository path, requested target branch, user-visible scope, and any required validation results. Its task is to inspect the branch and changes, compose the PR, and run `gh pr create` when authorized.

The subagent must:

1. Confirm the repository, current branch, base branch, working-tree status, and existing pull requests for the branch.
2. Review the commits and diff against the intended base branch. Do not include unrelated user-owned changes.
3. Run the relevant tests or report why they were not run.
4. Select and read exactly one template:
   - Read [English template](references/pull_request_en.md) for overseas open-source projects or repositories whose primary README, contribution rules, and issue/PR context are English.
   - Read [Korean template](references/pull_request_ko.md) for Korean projects or repositories whose primary README, contribution rules, and issue/PR context are Korean.
   - If the repository context does not establish a language, ask the user to choose Korean or English before drafting the PR.
5. Fill the selected template with only verified facts from the diff, commit history, and test results. Omit sections that do not apply rather than inventing content.
6. Immediately before `gh pr create`, confirm that the user explicitly requested PR creation in the current conversation. If that authorization is absent, return the proposed title, body, base branch, and compare branch to the parent agent for user approval.
7. Create one PR with `gh pr create`, then verify the returned URL and PR metadata with `gh pr view`.

## Boundaries

- Never create a PR from `main`, merge a PR, force-push, amend history, or change repository visibility unless the user explicitly asks.
- Reuse an existing open PR for the current branch instead of creating a duplicate; report its URL and any requested update separately.
- Do not mark unrun or failing tests as passing.
- Return the verified PR URL, selected template language, base branch, and validation result to the parent agent.
