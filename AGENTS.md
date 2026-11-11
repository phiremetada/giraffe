# Giraffe — Instructions for coding agents

Giraffe is Gamantra's standalone illustrated-film engine, built with TypeScript, React and Remotion. The project is intentionally small. It is **not** the older `gamantra-video` experiment.

## Product architecture

- **One film = one self-contained directory** under `films/<slug>/`. Its `film.json`, `edit.json`, images, video clips, narration, storyboard, and output belong together. Never split a film's assets between `films/` and a project-level `public/` directory.
- `src/` contains reusable film-engine code. `scripts/giraffe.mjs` selects the film, validates inputs, starts Studio, or renders it. Preserve the existing media-directory resolution mechanism.
- A scene may use a still (`image`) or a moving clip (`video`). Preserve video-over-image precedence, looping/muting behavior, camera motion and crossfades unless the task explicitly changes them.
- Remotion Studio is our preview/editor. Do not build a separate timeline editor, backend, database or new framework unless explicitly requested.

## Creative and editorial invariants

- **Never silently edit a film's creative data.** User-edited `films/*/edit.json`, shot order, start/end times, `crossfadeFrames`, media choices, camera movements, narration, soundtrack and approved illustration files are source-of-truth.
- Preserve 30 fps, 1080 × 1920 output and full audio duration for *The Empty Boat*, unless specifically directed otherwise.
- Preserve the abrupt cut into the `Bang!` scene and all softer before/after transitions. Do not change the final closing-card cut or its hold under narration.
- The approved ending credit is exactly `Living with Awareness @ Gamantra.com`.
- Work on the Giraffe repository only. Never modify the separate `gamantra-video` project.

## Engineering practices

- Read the relevant existing source and configuration before editing. Prefer a small, focused patch to architectural rewrites.
- Do not assume a Remotion component/API or Studio setting exists merely because it sounds plausible. Check the **installed** version, exported types, and official docs when relevant. Do not introduce `Track` or other components without verification.
- Preserve visual output when making Studio-only improvements. A nicer timeline must not change the rendered frames or soundtrack.
- Use descriptive `Sequence` names based on shot IDs and beats, but avoid unnecessary UI nesting or spurious tracks.
- Handle overlapping scenes correctly: outgoing shot extends under the incoming shot's fade. Avoid altering start/end calculations just to adjust Studio presentation.
- Avoid new runtime dependencies if built-in Remotion functionality suffices. Keep project tooling compatible with macOS and Node/npm.
- Validate inputs and test changes. Prefer targeted tests/checks, then `npm run validate -- the-empty-boat`, then a Remotion preview/render check when possible.
- Never overwrite or commit generated exports, dependency folders, local secrets or temporary files. Follow `.gitignore`.

## When completing a task

1. Briefly state the root cause or diagnosis, distinguishing evidence from assumptions.
2. List the files changed and why.
3. Report exactly which commands/tests were run and their results; explicitly say what could not be verified.
4. Explain how to confirm the fix in Remotion Studio.
5. Do not call a UI issue fixed solely because a CLI render succeeds: Studio timeline behavior must be checked independently.

## Current task

Start with `tasks/001-studio-timeline.md`. It is the first assigned Codex task. Do not expand its scope into unrelated refactoring.
