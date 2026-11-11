import React from 'react';
import {Composition} from 'remotion';
import {edit} from './selected-film';
import {IllustratedFilm} from './IllustratedFilm';
import type {Edit} from './types';

const timeline = edit as Edit;
export const Root: React.FC = () => (
  <>
    <Composition
      id="GiraffeFilm"
      component={IllustratedFilm}
      durationInFrames={Math.ceil(timeline.durationSec * timeline.fps)}
      fps={timeline.fps}
      width={timeline.width}
      height={timeline.height}
    />
    <Composition
      id="GiraffePreview"
      component={IllustratedFilm}
      durationInFrames={Math.min(Math.ceil(timeline.durationSec * timeline.fps), timeline.fps * 30)}
      fps={timeline.fps}
      width={timeline.width}
      height={timeline.height}
    />
  </>
);
