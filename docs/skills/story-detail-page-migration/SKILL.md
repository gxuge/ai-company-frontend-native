---
name: story-detail-page-migration
description: Migrate a Figma-exported Story Detail page into ai-company-frontend-native while preserving original UI layout/styles and source encoding. Use when copying `App.tsx` into `src/app/pages/<page>/index.tsx`, moving page assets into `src/assets/images/<page>/`, and only updating import/reference links.
---

# Story Detail Page Migration Skill

## Goal
- Copy page code from a Figma export into `src/app/pages/story-detail/index.tsx`.
- Keep UI layout and styles unchanged.
- Keep source file encoding, BOM, and line endings unchanged.
- Move static assets to `src/assets/images/story-detail` and only change reference links.

## Inputs
- Source app entry: `.../story-detail/src/app/App.tsx`
- Source component(s): `.../story-detail/src/app/components/...`
- Source assets: `.../story-detail/src/imports/*` or image/svg files
- Target project root: `D:/project_demo/ai-company-frontend-native`

## Workflow
1. Inspect dependency chain from source `App.tsx`.
2. Create target directories:
- `src/app/pages/story-detail`
- `src/app/pages/story-detail/components`
- `src/assets/images/story-detail`
3. Copy files by bytes (copy/move), not by decode+rewrite.
4. Rename page entry from `App.tsx` to `index.tsx`.
5. Place static assets in `src/assets/images/story-detail`.
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
- `index.tsx` exists under `src/app/pages/story-detail`.
- Referenced component files exist and compile.
- Assets are under `src/assets/images/story-detail`.
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