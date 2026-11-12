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

## Feature restraint — protect the small engine

**The goal is to make films, not to accumulate features.** Giraffe should become more capable only when real production work demonstrates a need. "Reusable" is necessary for an engine feature, but is **not sufficient** reason to add one.

Before implementing a requested behavior, choose the smallest appropriate level:

1. **Existing configuration or assets:** Prefer a change to the individual film's `edit.json`, `film.json`, media, or a supported existing option. Do not change shared engine code for a film-specific creative choice.
2. **Small correction to existing behavior:** If the engine already promises the capability but is buggy, fix it narrowly and test for regressions. A bug fix is not a license to redesign the system.
3. **New shared capability, only when justified:** Add an engine feature only when a concrete film cannot be produced cleanly with existing primitives, and the proposed behavior is sufficiently general, simple and likely to be reused. One film's unusual request does not automatically qualify.

**Guardrails:**

- Do not build speculative abstractions, plugin systems, feature flags, configuration switches, modes, UI controls, helper libraries, or extension points "for future flexibility." No feature merely because a framework supports it.
- Do not convert a simple one-off into a universal feature. For genuinely film-specific needs, prefer a contained, explicit solution that does not complicate other films; seek approval before introducing a bespoke code path into the shared engine.
- Prefer composition of existing primitives to new concepts. Keep APIs and configuration schemas minimal; every new setting creates a maintenance burden.
- Avoid compatibility shims and duplicated pathways unless required by an actual existing film. Remove dead code only when safe and within task scope.
- Preserve old films as regression references. New features must be opt-in or backward compatible, and must not silently change a film's rendered output.
- If a task seems to require a new engine abstraction, **stop before implementing it** and briefly explain the concrete need, the simplest existing workaround, the proposed addition, and its ongoing maintenance cost. Ask for approval unless the task explicitly authorizes that specific new capability.
- Do not enlarge a task based on unrelated cleanup opportunities. Record separate ideas as suggestions, not code changes.

**Success measure:** Can we produce the intended film reliably with *less* complexity? Not: how many new features did we add?

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

## Task selection

Work only on the task explicitly assigned in the current Codex request. Historical tasks under `tasks/` are records, not standing instructions to re-run or expand them.
