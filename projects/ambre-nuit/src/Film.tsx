import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { EASE, ramp } from './lib/Polish';
import './lib/brand';
import { S1Spotlight } from './shots/S1Spotlight';
import { S2Bottle } from './shots/S2Bottle';
import { S3Notes } from './shots/S3Notes';
import { S4Wordmark } from './shots/S4Wordmark';

// Cuts are anchored to the BGM beat grid (brand.ts beatF): 0 · b12 · b26 · b42 · end b54
export const SHOTS = [
  { id: 's1-spotlight', from: 0, dur: 189, C: S1Spotlight },
  { id: 's2-bottle', from: 189, dur: 195, C: S2Bottle },
  { id: 's3-notes', from: 384, dur: 223, C: S3Notes },
  { id: 's4-wordmark', from: 607, dur: 167, C: S4Wordmark },
];
export const FILM_DURATION = 774;
const XF = 8; // half crossfade

const Fade: React.FC<{ children: React.ReactNode; fadeIn: boolean }> = ({ children, fadeIn }) => {
  const f = useCurrentFrame();
  const o = fadeIn ? ramp(f, 0, XF * 2, EASE.smooth) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Film: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const frame = useCurrentFrame();
  const out = ramp(frame, FILM_DURATION - 22, 22, EASE.smooth);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {SHOTS.map((s, i) => {
        const start = i === 0 ? 0 : s.from - XF;
        const last = i === SHOTS.length - 1;
        const dur = s.dur + (i === 0 ? 0 : XF) + (last ? 0 : XF);
        return (
          <Sequence key={s.id} from={start} durationInFrames={dur} name={s.id}>
            <Fade fadeIn={i > 0}>
              {/* shot-local frame 0 = the cut point, so offset the inner clock by XF */}
              <Sequence from={i === 0 ? 0 : XF} layout="none">
                <s.C />
              </Sequence>
              {i > 0 && (
                <Sequence from={0} durationInFrames={XF} layout="none">
                  <Freeze frame={0}>
                    <s.C />
                  </Freeze>
                </Sequence>
              )}
            </Fade>
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ background: '#000', opacity: out }} />
      {bgm && (
        <Audio
          src={staticFile('audio/bgm.mp3')}
          volume={(f) => 0.6 * interpolate(f, [0, 6, FILM_DURATION - 36, FILM_DURATION], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      )}
    </AbsoluteFill>
  );
};
