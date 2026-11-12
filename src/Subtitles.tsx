import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type SubtitleCue = {startMs: number; endMs: number; text: string};

export const Subtitles: React.FC<{cues: SubtitleCue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const at = (ms: number) => Math.round(ms * fps / 1000);
  const index = cues.findIndex((cue, i) => {
    const nextStart = i + 1 < cues.length ? at(cues[i + 1].startMs) : Infinity;
    const end = at(cue.endMs);
    const fade = Math.min(Math.round(fps * 0.18), Math.floor((end - at(cue.startMs)) / 2));
    const visibleEnd = nextStart - end <= 1 ? nextStart : Math.min(nextStart, end + fade);
    return frame >= at(cue.startMs) && frame < visibleEnd;
  });
  if (index < 0) return null;

  const cue = cues[index];
  const start = at(cue.startMs);
  const end = at(cue.endMs);
  const previousEnd = index > 0 ? at(cues[index - 1].endMs) : -Infinity;
  const nextStart = index + 1 < cues.length ? at(cues[index + 1].startMs) : Infinity;
  const fade = Math.min(Math.round(fps * 0.18), Math.floor((end - start) / 2));
  const fadeOutEnd = Math.min(nextStart, end + fade);
  const fadeIn = fade > 0 && start - previousEnd > 1 ? interpolate(frame, [start, start + fade], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  const fadeOut = fade > 0 && nextStart - end > 1 ? interpolate(frame, [end, fadeOutEnd], [1, 0], {extrapolateRight: 'clamp'}) : 1;

  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'column', paddingBottom: Math.round(height * 0.115), pointerEvents: 'none', opacity: Math.min(fadeIn, fadeOut)}}>
      <div style={{width: 'fit-content', maxWidth: Math.round(width * 0.84), padding: `${Math.round(width * 0.018)}px ${Math.round(width * 0.028)}px`, borderRadius: Math.round(width * 0.016), backgroundColor: 'rgba(25, 26, 27, 0.70)', color: '#f8f1e5', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: Math.round(width * 0.052), fontWeight: 500, lineHeight: 1.2, textAlign: 'center', whiteSpace: 'pre-line'}}>
        {cue.text}
      </div>
    </div>
  );
};
