# VRM Debug Asset Sources

The runtime files moved to `src/assets/vrm` so Metro can fingerprint and serve them in both development and exported builds.

- `src/assets/vrm/models/avatar-orion.vrm`
  - Source: `madjin/vrm-samples`
  - Used as a local development model for the standalone VRM debug page.
- `src/assets/vrm/animations/idle_loop.vrma`
  - Source: Project AIRI `packages/stage-ui-three`
  - Used as the local default idle animation.

The debug page resolves both files through `expo-asset`; it does not require a remote model URL.
