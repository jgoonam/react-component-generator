---
name: commit
description: Analyze Git changes and prepare convention-aligned Korean commits when the user asks to commit, save changes, or create a commit. Require explicit approval immediately before creating commits.
---

# Commit Changes

Analyze the current repository changes and create only the commits the user approves.

## Workflow

1. Inspect the repository state with `git status --short`, then inspect both unstaged and staged changes with `git diff` and `git diff --cached`. Review relevant file context when the diff alone is insufficient.
2. Classify the changes into logical, independently reviewable units. Keep unrelated changes separate. Do not include pre-existing or user-owned unrelated changes merely because they are present in the working tree.
3. For each proposed commit, report the included files and a concise Korean Conventional Commit message in this form:

   ```text
   feat: 요약
   fix: 요약
   refactor: 요약
   chore: 요약
   ```

   Choose the type that best describes the change. Use a short, concrete Korean summary.
4. Ask for the user's explicit approval of the proposed commit plan before staging files or running `git commit`. Do not treat general permission to work autonomously as approval for this irreversible repository-history change.
5. After approval, stage only the approved files or hunks, create the approved commits, and verify the result with `git status --short` and `git log -1 --oneline`.

## Boundaries

- Never amend, force-push, push, reset, or alter existing commits unless the user explicitly asks for that action.
- If there are no changes to commit, report that fact and do not request approval.
- If a change cannot be safely separated without altering it, explain the dependency and ask how to group it.
