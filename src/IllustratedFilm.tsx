import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, Track, useCurrentFrame} from 'remotion';
import {Audio, Video} from '@remotion/media';
import {edit, subtitles} from './selected-film';
import {Subtitles} from './Subtitles';
import type {Edit, Shot} from './types';

const film = edit as Edit;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const at = (seconds: number) => Math.round(seconds * film.fps);

const MediaShot: React.FC<{shot: Shot; fadeInFrames: number; lengthFrames: number; outgoingFadeFrames: number}> = ({shot, fadeInFrames, lengthFrames, outgoingFadeFrames}) => {
  const frame = useCurrentFrame(); // Relative to this shot's Sequence.
  const progress = interpolate(frame, [0, Math.max(1, lengthFrames)], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.ease),
  });
  const zoomStart = shot.zoomStart ?? 1;
  const zoomEnd = shot.zoomEnd ?? 1;
  const scale = zoomStart + (zoomEnd - zoomStart) * progress;
  const drift = Math.max(0, scale - 1) * 30;
  const x = shot.move === 'push-right' || shot.move === 'pan-right' ? drift * (progress - 0.5)
    : shot.move === 'push-left' || shot.move === 'pan-left' ? -drift * (progress - 0.5) : 0;
  const y = shot.move === 'pull' ? drift * (0.5 - progress) : 0;
  const opacity = fadeInFrames > 0 ? interpolate(frame, [0, fadeInFrames], [0, 1], clamp) : 1;
  const mediaStyle: React.CSSProperties = {
    position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
  };
  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: shot.focusX === undefined ? 'center' : `${shot.focusX * 100}% 50%`}}>
        {shot.video ? <>
          <Video
            src={staticFile(shot.video)}
            muted
            loop={shot.videoLoop ?? true}
            durationInFrames={shot.videoLoop === false ? lengthFrames : undefined}
            style={mediaStyle}
          />
          {/* Keep the outgoing frame decoded before the fade; changing freeze on a playing Video briefly clears its Studio canvas. */}
          {shot.videoLoop === false && outgoingFadeFrames > 0 ? <Video
            src={staticFile(shot.video)}
            muted
            from={lengthFrames}
            trimBefore={lengthFrames - 1}
            durationInFrames={outgoingFadeFrames}
            freeze={0}
            premountFor={lengthFrames}
            showInTimeline={false}
            style={mediaStyle}
          /> : null}
        </>
          : shot.image ? <Img src={staticFile(shot.image)} style={mediaStyle}/>
            : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const IllustratedFilm: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#eee8dc', overflow: 'hidden'}}>
    {film.scenes.map((shot, index) => {
      const start = at(shot.startSec);
      const end = at(shot.endSec);
      const fadeIn = index === 0 ? 0 : shot.crossfadeFrames ?? 0;
      // Extend the prior shot under the following shot's fade-in.
      const next = film.scenes[index + 1];
      const nextFade = next ? Math.min(next.crossfadeFrames ?? 0, Math.max(0, at(next.endSec) - at(next.startSec))) : 0;
      const label = `${shot.id} — ${shot.beat ?? 'Scene'} (${(shot.endSec - shot.startSec).toFixed(2)}s)`;
      return (
        <Track key={shot.id} name={label}>
          <Sequence
            name={label}
            from={start}
            durationInFrames={end - start + nextFade}
          >
            <MediaShot
              shot={shot}
              fadeInFrames={fadeIn}
              lengthFrames={end - start}
              outgoingFadeFrames={nextFade}
            />
          </Sequence>
        </Track>
      );
    })}
    <Audio src={staticFile(film.audio)}/>
    {subtitles.length > 0 ? <Subtitles cues={subtitles}/> : null}
  </AbsoluteFill>
);
