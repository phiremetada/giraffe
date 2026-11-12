export type Shot = {
  id: string;
  image?: string;
  video?: string;
  videoLoop?: boolean;
  beat?: string;
  startSec: number;
  endSec: number;
  move?: 'locked' | 'hold' | 'push' | 'pull' | 'push-left' | 'push-right' | 'pan-left' | 'pan-right' | 'impact';
  zoomStart?: number;
  zoomEnd?: number;
  focusX?: number;
  crossfadeFrames?: number;
};
export type Edit = {
  fps: number;
  width: number;
  height: number;
  durationSec: number;
  frames?: number;
  audio: string;
  subtitles?: string;
  scenes: Shot[];
};
export type Film = {
  title: string;
  slug: string;
  version: string;
  notes?: string;
};
