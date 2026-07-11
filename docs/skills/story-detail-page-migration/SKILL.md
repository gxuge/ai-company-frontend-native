---
name: story-detail-page-migration
description: Move a Figma-exported page into the frontend app while preserving layout, styling, encoding, and line endings. Use when copying `App.tsx` into `src/app/pages/<page>/index.tsx`, relocating page assets under `src/assets/images/<page>/`, and updating import paths only.
---

# Story Detail Page Migration Skill

## Goal

- Copy page code from a Figma export into `src/app/pages/<page-name>/index.tsx`
- Keep UI layout and styles unchanged
- Keep source file encoding, BOM, and line endings unchanged
- Move static assets to `src/assets/images/<page-name>` and update references only
- Default `<page-name>` to the source page name or the user-specified target name

## Inputs

- Source app entry: `.../<page-name>/src/app/App.tsx`
- Source component(s): `.../<page-name>/src/app/components/...`
- Source assets: `.../<page-name>/src/imports/*` or image/svg files
- Target project root: `D:/project_demo/ai-company-frontend-native`

## Workflow

1. Inspect dependency chain from source `App.tsx`
2. Create target directories:
   - `src/app/pages/<page-name>`
   - `src/app/pages/<page-name>/components`
   - `src/assets/images/<page-name>`
3. Copy files by bytes, not by decode and rewrite
4. Rename `App.tsx` to `index.tsx`
5. Place static assets in `src/assets/images/<page-name>`
6. Update import and reference links only
7. Validate that layout, styles, imports, encoding, and line endings stay intact

## Constraints

- Do not change class names, style blocks, inline style objects, spacing, or layout structure
- Do not rewrite text content unless required for path updates
- Do not normalize line endings or convert encoding unless the user explicitly asks

## Verification Checklist

- `index.tsx` exists under `src/app/pages/<page-name>`
- Referenced component files exist and compile
- Assets are under `src/assets/images/<page-name>`
- Import paths are valid and relative to the new file locations
- Encoding check passes: source and destination keep the same BOM and newline style

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