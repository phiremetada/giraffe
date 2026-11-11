# Task 001 — Make all film scenes visible in Remotion Studio's timeline

## Context and symptoms

Giraffe's `GiraffeFilm` plays correctly: images, transitions and narration appear at their intended times. But Remotion Studio's timeline shows essentially **one image/scene track near the start**, not the full succession of shots. At a playhead around **00:21**, the preview correctly shows a later painting while the timeline still shows the first scene thumbnail and blue bars only near time zero. The row labeled `shot-01 — Title: the river` and its nested `<AbsoluteFill>` / `<Img>` have `+11` indicators. Clicking `+11` did not reveal more individual scene rows.

Installed on the user's Mac:
- React / react-dom **19.3.1**
- Remotion and its packages **4.0.542**

Changing React versions did not solve the problem. An attempted `Config.setSequenceActivityLimit(Infinity)` in `remotion.config.ts` also did not solve it. The grouping explanation and suggested `<Track>` wrapper were **hypotheses, not verified fixes**. Do **not** blindly apply them.

## Goal

When opening `GiraffeFilm` in Remotion Studio, users can identify and navigate **every shot** in the timeline at its actual position/duration, with meaningful shot labels and, where supported, its media thumbnail. The film must render and sound **identically** before and after the fix.

## Scope

1. Inspect `src/IllustratedFilm.tsx`, `src/Root.tsx`, `src/selected-film.ts`, `src/types.ts`, `scripts/giraffe.mjs` and the selected film's `edit.json`.
2. Identify the *actual* reason Studio collapses/hides the scene visualization. Check relevant Remotion 4.0.542 behavior and supported APIs. In particular, assess whether `Sequence`, `layout`, `showInTimeline`, scene nesting, grouping, sequence discovery/activity, or Studio settings are responsible.
3. Implement the **smallest supported correction**. Use named `Sequence` nodes for each shot. Only use a dedicated track API if confirmed to exist and to serve this purpose in the installed version.
4. Keep film data and source media unchanged. Do not fix this by adding duplicated media, altering scene timings, or removing transitions.
5. If the behavior depends on a Studio user preference rather than engine code, document the exact reproducible setting and limit code changes accordingly.

## Important existing behavior to preserve

`src/IllustratedFilm.tsx` maps `film.scenes` to `<Sequence>` components. Each shot starts at `Math.round(startSec * fps)` and ends at `Math.round(endSec * fps)`. The outgoing shot is extended by the **next scene's fade**, while the incoming `MediaShot` fades in using its own `crossfadeFrames`. This overlap is intentional. There is a separate full-film audio element. Keep all of it.

One-film-one-folder architecture is non-negotiable. The film directory is served as Remotion's media/public directory by the wrapper script.

## Acceptance criteria

- Every shot from the chosen `edit.json` is individually findable in the Studio timeline at the proper time (not all grouped as just `shot-01`).
- Timeline labels identify each shot by ID and narrative beat.
- Seeking to any shot shows the correct image/video.
- Crossfades—including overlaps—and the hard cut into `Bang!` behave exactly as before.
- Narration begins and ends at the same frames as before.
- Running `npm run validate -- the-empty-boat` succeeds.
- Rendering the selected film works; ideally, compare short samples or frame hashes before/after at cuts, fades and the closing card. Note whether visual equivalence was actually tested.
- No changes to `films/the-empty-boat/edit.json`, its assets, `gamantra-video`, or unrelated application structure.

## Deliverable

A minimal code change plus a short explanation: root cause, why it affected Studio but not playback, evidence the new timeline works, and any remaining Remotion Studio limitations.
