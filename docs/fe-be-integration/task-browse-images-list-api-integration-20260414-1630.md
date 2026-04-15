# Task: Browse Images List FE-BE Integration Plan

- Task scope: `src/app/pages/browse-images-list/**`
- Created at: `2026-04-14 16:30`
- Status: `completed`
- Goal: Replace static mock data with backend data while keeping the existing UI layout unchanged.

## 1. Current Findings

1. `browse-images-list` currently uses static mock cards and placeholder image URLs.
2. Existing frontend APIs:
   - `tsStoryApi.getStoryList`
   - `tsRoleImageApi.getUserImageAssets`
   - `tsRoleImageApi.createRoleImageProfile`
3. Backend currently has:
   - `GET /sys/ts-stories` (owner-scoped list by `user_id`)
   - `GET /sys/ts-role-image-profiles` (visible list by ownership/public rule)
   - No dedicated public discover/square feed API for cross-user browsing categories like subscribe/like.

## 2. Implementation Plan

| Task | Status | Description | Expected output |
| --- | --- | --- | --- |
| T1: API wrapper completion | completed | Add role image profile list API in `src/lib/api/ts-role-image.ts` and add public browse APIs in both FE/BE | Reusable page-level API methods |
| T2: Page data state wiring | completed | Add tab/category/search/pagination states in `browse-images-list/index.tsx` without changing visual layout | Real data rendering with loading/error/empty states |
| T3: Component prop extension | completed | Extend `SearchBar`, `StoryGrid`, `ImageCard`, `CategoryTabs` with data-driven props (non-breaking defaults) | UI structure unchanged, dynamic data enabled |
| T4: Mapping and fallback | completed | Build field mapping and robust fallback for missing backend fields | Stable behavior under incomplete backend data |
| T5: Verification | completed | Run backend compile and targeted frontend lint checks | Evidence for pass/fail and residual risks |

## 3. Field Mapping Draft

### 3.1 Story tab (current feasible source)
- UI card image <- `TsStory.coverUrl`
- Search keyword <- `TsStoryQuery.keyword`
- Category strategy <- temporary front-end mapping to `storyMode` where possible; unsupported categories fallback to recommended mode
- View count <- `followerCount` (fallback `dialogueCount`, fallback `'--'`)

### 3.2 Character tab (current feasible source)
- Main image <- `TsRoleImageProfile.selectedImageUrl`
- Username/tag <- `profileName` (fallback `'@user'`)
- Author <- `ownerUserId` (temporary, fallback `'--'`)
- Views <- temporary `'--'` (unless ext field later confirmed)
- Search keyword <- `TsRoleImageProfileQueryDto.keyword`

## 4. Known Gaps / Consultation Items

1. Category semantics gap:
   - Frontend category pills do not have a one-to-one backend query semantic yet.
2. Public feed sort strategy is still basic:
   - current public APIs are ordered by `updated_at desc`.
3. Some cards may not have complete metrics:
   - role image profile public VO currently has no dedicated view count field.

## 5. Fallback Strategy

1. If API request fails: keep page layout, show non-intrusive error text, keep static fallback cards.
2. If backend returns partial fields: use placeholder strings and default local images.
3. If category not supported by backend: fallback to recommended list request.

## 6. Evidence Index

- Frontend files inspected:
  - `src/app/pages/browse-images-list/index.tsx`
  - `src/app/pages/browse-images-list/components/*`
  - `src/lib/api/ts-story.ts`
  - `src/lib/api/ts-role-image.ts`
- Backend files inspected:
  - `TsStoryController.java`, `TsStoryMapper.xml`
  - `TsRoleImageProfileController.java`, `TsRoleImageProfileMapper.xml`
  - `TsRolePublicController.java`
  - `TsUserImageAssetController.java`, `TsRoleImageGenerateRecordController.java`

## 7. Execution Result (2026-04-14)

### 7.1 Backend completed
- Added public browse controller:
  - `GET /sys/ts-stories/public`
  - `GET /sys/ts-role-image-profiles/public`
- Added new VO objects for public feeds:
  - `TsStoryPublicVo`
  - `TsRoleImageProfilePublicVo`
- Added mapper methods and SQL:
  - `TsStoryMapper.selectPublicStoryPage`
  - `TsRoleImageProfileMapper.selectPublicProfilePage`

### 7.2 Frontend completed
- Added API wrappers:
  - `tsStoryApi.getPublicStoryList`
  - `tsRoleImageApi.getRoleImageProfileList`
  - `tsRoleImageApi.getPublicRoleImageProfileList`
- Replaced static browse page data with API-driven rendering:
  - search input + category filtering + tab switching
  - paging with scroll-to-load-more
  - loading/error/empty fallback states

### 7.3 Verification
- Backend compile:
  - `mvn -pl jeecg-module-system/jeecg-system-biz -am -DskipTests compile` (passed)
- Frontend targeted lint:
  - `pnpm exec eslint src/app/pages/browse-images-list/index.tsx src/app/pages/browse-images-list/components/SearchBar.tsx src/app/pages/browse-images-list/components/StoryGrid.tsx src/app/pages/browse-images-list/components/ImageCard.tsx src/app/pages/browse-images-list/components/CategoryTabs.tsx src/lib/api/ts-story.ts src/lib/api/ts-role-image.ts --rule "unicode-bom: off" --rule "unicorn/filename-case: off" --rule "perfectionist/sort-imports: off" --rule "perfectionist/sort-named-imports: off" --rule "ts/consistent-type-definitions: off" --rule "ts/ban-ts-comment: off" --rule "react/prefer-namespace-import: off" --rule "max-lines-per-function: off" --rule "react-hooks/set-state-in-effect: off" --rule "react-hooks/exhaustive-deps: off" --rule "style/multiline-ternary: off" --rule "style/arrow-parens: off"` (passed)

