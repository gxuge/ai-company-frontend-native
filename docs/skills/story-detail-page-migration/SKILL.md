---
name: story-detail-page-migration
description: Migrate a Figma-exported page into ai-company-frontend-native while preserving original UI layout/styles and source encoding. Use when copying `App.tsx` into `src/app/pages/<page>/index.tsx`, moving page assets into `src/assets/images/<page>/`, and only updating import/reference links.
---

# Story Detail Page Migration Skill

## Goal
- Copy page code from a Figma export into `src/app/pages/<page-name>/index.tsx`.
- Keep UI layout and styles unchanged.
- Keep source file encoding, BOM, and line endings unchanged.
- Move static assets to `src/assets/images/<page-name>` and only change reference links.
- Default `<page-name>` to the actual source page name or the user-specified target name.
- Example: a Figma export folder/page named `draft` should be migrated to `src/app/pages/draft` rather than `src/app/pages/story-detail`.

## Inputs
- Source app entry: `.../<page-name>/src/app/App.tsx`
- Source component(s): `.../<page-name>/src/app/components/...`
- Source assets: `.../<page-name>/src/imports/*` or image/svg files
- Target project root: `D:/project_demo/ai-company-frontend-native`

## Workflow
1. Inspect dependency chain from source `App.tsx`.
2. Create target directories:
- `src/app/pages/<page-name>`
- `src/app/pages/<page-name>/components`
- `src/assets/images/<page-name>`
3. Copy files by bytes (copy/move), not by decode+rewrite.
4. Rename page entry from `App.tsx` to `index.tsx`.
5. Place static assets in `src/assets/images/<page-name>`.
6. Update import/reference links only.
7. Validate:
- no UI/style edits
- imports resolve
- BOM/line endings preserved

## Constraints
- Do not change class names, style blocks, inline style objects, spacing, or layout structure.
- Do not rewrite text content unless required for path updates.
- Do not normalize line endings or convert encoding unless user explicitly asks.

## Verification Checklist
- `index.tsx` exists under `src/app/pages/<page-name>`.
- Referenced component files exist and compile.
- Assets are under `src/assets/images/<page-name>`.
- Import paths are valid and relative to new file locations.
- Encoding check passes: source and destination keep same BOM and newline style.

## Typical Commands
```powershell
Copy-Item -LiteralPath <source-file> -Destination <target-file> -Force
```

```powershell
rg -n "^import|require\(" <target-page-dir>
```

```powershell
# BOM + line-ending spot check
# (use byte header + CRLF/LF counts)
```
