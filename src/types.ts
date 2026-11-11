export type Shot = {
  id: string;
  image?: string;
  video?: string;
  beat?: string;
  startSec: number;
  endSec: number;
  move?: 'locked' | 'hold' | 'push' | 'pull' | 'push-left' | 'push-right' | 'pan-left' | 'pan-right' | 'impact';
  zoomStart?: number;
  zoomEnd?: number;
  crossfadeFrames?: number;
};
export type Edit = {
  fps: number;
  width: number;
  height: number;
  durationSec: number;
  frames?: number;
  audio: string;
  scenes: Shot[];
};
export type Film = {
  title: string;
  slug: string;
  version: string;
  notes?: string;
};
