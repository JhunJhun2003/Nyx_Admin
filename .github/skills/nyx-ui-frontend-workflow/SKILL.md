---
name: nyx-ui-frontend-workflow
description: "Use when working on React/Vite frontend changes in this Nyx app: inspect related components and APIs, make focused edits, and verify with lint/build checks."
---

# Nyx UI Frontend Workflow

Use this skill for UI changes, routing updates, styling fixes, API wiring, or build/lint troubleshooting in this repository.

## When to Use
- Editing pages under src/ such as POS, class management, account, or reporting views
- Fixing layout, styling, JSX, or component behavior issues
- Wiring new fields or actions into existing API helpers under src/Api_Call/ or src/ClassApi/
- Investigating build or lint failures in the Vite frontend

## Workflow

1. Identify the exact feature area and file(s) involved.
   - Start with the related page component, CSS file, and API helper if the task affects data flow.
   - Prefer small, scoped edits over broad refactors.

2. Inspect existing patterns before changing code.
   - Reuse naming, folder structure, and component conventions already used in this app.
   - Trace the relevant data path from UI to API call before editing.

3. Implement the smallest fix that matches the existing design.
   - Keep changes local to the feature area unless the user explicitly asks for a wider refactor.
   - Preserve current behavior unless the request specifically changes it.

4. Verify the result with the project checks.
   - Run npm run lint
   - Run npm run build
   - If a check fails, fix the root cause instead of masking the error.

## Decision Points
- If the issue is visual or layout-related, inspect the matching JSX/CSS pair first.
- If the issue involves data or API behavior, trace the related helper in src/Api_Call/ or src/ClassApi/ before editing.
- If the issue is build-related, confirm the failure with the existing project scripts and fix the root cause.

## Completion Criteria
The task is complete when:
- The requested change is implemented in the relevant feature area.
- The code follows the existing project structure and naming patterns.
- npm run lint succeeds.
- npm run build succeeds.

## Example Prompts
- Fix the broken layout on the POS overview page.
- Add a new field to the class booking form and wire it to the existing API helper.
- Trace why the Vite build is failing and fix the root cause.
- Refactor this component to match the existing style used in the other POS pages.
