# Giraffe 🦒

**Gamantra's illustrated-film engine.** Standalone React + Remotion + TypeScript project. It does **not** modify `gamantra-video`.

## First run (Mac)

```bash
unzip Giraffe-starter.zip
cd Giraffe
npm install
npm run validate -- the-empty-boat
npm run dev -- the-empty-boat
```

Studio opens in your browser. Select **GiraffeFilm** (or **GiraffePreview** for a 30-second preview).

## Render a film

```bash
npm run render -- the-empty-boat
```

The MP4 is saved to `films/the-empty-boat/output/the-empty-boat.mp4`.

## One film = one folder

```
films/<slug>/
  film.json       # Title, slug, metadata
  edit.json       # Timeline, timing, camera, transitions
  images/         # Approved PNG/JPG artwork
  videos/         # Optional MP4 replacements
  audio/          # Narration and soundtrack
  subtitles/      # Optional SRT captions
  storyboard/     # Approved storyboard reference
  output/         # Rendered results (not tracked by Git)
```

The shared engine lives in `src/`. The wrapper `scripts/giraffe.mjs` chooses the film and tells Remotion to use that **same film folder** as its public media directory. No second media copy in `public/` is needed.

Note: switching films or changing the SRT requires stopping Studio and running `npm run dev -- <slug>` again. The script regenerates `src/selected-film.ts` with film import paths and parsed subtitle cues; it never edits film JSON/media.

## Subtitles

To burn in subtitles, set `"subtitles": "subtitles/en.srt"` in the film's `edit.json`. Remove that field to disable them. The SRT stays in the film folder and can also be distributed separately. Edit cue text or timestamps in the SRT, then restart Studio or render the film to reload it. Cue times use the narration clock, not scene boundaries; leave gaps for pauses. Each cue supports one or two text lines. Run `npm run validate -- <slug>` after editing.

## Replace a still with a video

Add `videos/scene-03.mp4` inside the film's `videos/` directory. In `edit.json`, change the shot to include `"video": "videos/scene-03.mp4"`. When `video` exists, it takes priority over `image`. Clips loop, are muted, and follow the same camera/transition directions. Prefer clips with a smooth loop seam; an abrupt looping clip will still jump.

## Create another film

1. Copy `films/the-empty-boat/` as a structural example, **but remove its existing images, audio and shots**.
2. Update `film.json`, `edit.json`, and add that film's own media.
3. Run `npm run validate -- your-film-slug` then `npm run dev -- your-film-slug`.

Use the visual storyboard as the approved contract. `docs/production-workflow.md` preserves the creative workflow.

## Project notes

- Included Empty Boat film is an **example imported from the most recently shared conversation assets**, not a byte-for-byte copy of any later edits made only on your Mac.
- Artwork and audio are kept intact. Final manual adjustments on your computer can be imported by replacing only `films/the-empty-boat/edit.json` and relevant assets.
- The engine is minimal, intentionally. No database, website, custom editor, or publishing integration.
- The only runtime dependency folder is `node_modules/`, created by `npm install`.
- Film edits are imported as JSON. Update transitions there, not in the engine.
