// S3 — blur-slide (demos/typography/blur-slide/BlurSlide.tsx)
// Word-by-word reveal: y + blur + opacity bound to ONE progress p on ONE ease (EASE.out).
// Editorial layout re-skinned to the night palette: headline left, the three-act note pyramid right.
// Note rows land on BGM beats 30 / 32 / 34 (local f56 / f84 / f111).
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EASE, Grain, Vignette, ramp } from '../lib/Polish';
import { C, SANS, SERIF, alpha } from '../lib/brand';

export const S3_DURATION = 223;

type Word = { text: string; start: number; dur: number; style?: React.CSSProperties; track?: [number, number] };

const Words: React.FC<{ words: Word[]; dy: number; blur: number; gap: string; style: React.CSSProperties }> = ({ words, dy, blur, gap, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap, whiteSpace: 'nowrap', ...style }}>
      {words.map((w, i) => {
        const p = ramp(frame, w.start, w.dur, EASE.out);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${((1 - p) * dy).toFixed(2)}px)`,
              filter: p >= 0.999 ? undefined : `blur(${((1 - p) * blur).toFixed(2)}px)`,
              letterSpacing: w.track ? `${(w.track[0] + (w.track[1] - w.track[0]) * p).toFixed(4)}em` : undefined,
              ...w.style,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const LEFT = 168;
const RIGHT_X = 1060;

const H1_A: Word[] = ['Three', 'acts'].map((text, i) => ({ text, start: 10 + i * 4, dur: 22 }));
const H1_B: Word[] = [
  { text: 'of', start: 24, dur: 22 },
  { text: 'one', start: 28, dur: 22 },
  { text: 'night.', start: 32, dur: 30, track: [0.04, -0.01], style: { fontStyle: 'italic', color: C.gold } },
];

const NOTES = [
  { label: 'I · Top', names: 'Bergamot, Pink Pepper', at: 56 },
  { label: 'II · Heart', names: 'Damask Rose, Saffron', at: 84 },
  { label: 'III · Base', names: 'Amber, Oud, Vanilla', at: 111 },
];

export const S3Notes: React.FC = () => {
  const f = useCurrentFrame();
  const push = 1 + 0.03 * ramp(f, 0, S3_DURATION, EASE.smooth);
  const kick = ramp(f, 4, 18, EASE.out);
  const folio = ramp(f, 0, 60, EASE.out);
  const headline: React.CSSProperties = { fontFamily: SERIF, fontSize: 168, fontWeight: 500, lineHeight: 1, letterSpacing: '-0.02em', color: C.ink };

  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: `linear-gradient(160deg, #1d0b10 0%, #12060a 55%, #080304 100%)` }}>
      {/* warm side light from the right (the bottle's amber, carried over) */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 55% 75% at 100% 60%, ${alpha('#c76a2a', 0.16)} 0%, rgba(0,0,0,0) 70%)` }} />
      {/* background folio numeral — slow counter-drift for depth */}
      <div
        style={{
          position: 'absolute', left: 40, top: 40, fontFamily: SERIF, fontSize: 1000, fontWeight: 400, fontStyle: 'italic', lineHeight: 1,
          color: alpha(C.gold, 0.04 * folio), filter: folio >= 0.999 ? undefined : `blur(${((1 - folio) * 24).toFixed(2)}px)`,
          transform: `translateX(${(-30 * ramp(f, 0, S3_DURATION, EASE.smooth)).toFixed(2)}px)`,
        }}
      >
        III
      </div>

      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push.toFixed(5)})`, transformOrigin: `960px 540px` }}>
        {/* eyebrow */}
        <div
          style={{
            position: 'absolute', left: LEFT, top: 330, display: 'flex', alignItems: 'center', gap: 18,
            fontFamily: SANS, fontSize: 30, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.gold,
            opacity: kick, transform: `translateY(${((1 - kick) * 18).toFixed(2)}px)`, filter: kick >= 0.999 ? undefined : `blur(${((1 - kick) * 6).toFixed(2)}px)`,
          }}
        >
          <span style={{ width: 44, height: 1.5, background: C.gold, display: 'inline-block' }} />
          The composition
        </div>
        <Words words={H1_A} dy={64} blur={18} gap="0.24em" style={{ ...headline, position: 'absolute', left: LEFT - 6, top: 400 }} />
        <Words words={H1_B} dy={64} blur={18} gap="0.24em" style={{ ...headline, position: 'absolute', left: LEFT - 6, top: 570 }} />

        {/* vertical hairline divider */}
        <div
          style={{
            position: 'absolute', left: RIGHT_X - 80, top: 300, width: 1.5, height: 520, background: alpha(C.gold, 0.28),
            transform: `scaleY(${ramp(f, 40, 40, EASE.snappy).toFixed(4)})`, transformOrigin: '50% 0%',
          }}
        />

        {NOTES.map((n, i) => {
          const y = 300 + i * 180;
          const lab = ramp(f, n.at - 4, 18, EASE.out);
          const rule = ramp(f, n.at + 10, 26, EASE.snappy);
          const words: Word[] = n.names.split(' ').map((t, k) => ({ text: t, start: n.at + k * 4, dur: 24 }));
          return (
            <div key={i} style={{ position: 'absolute', left: RIGHT_X, top: y, width: 700 }}>
              <div
                style={{
                  fontFamily: SANS, fontSize: 30, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: C.gold,
                  opacity: lab, filter: lab >= 0.999 ? undefined : `blur(${((1 - lab) * 6).toFixed(2)}px)`,
                }}
              >
                {n.label}
              </div>
              <Words words={words} dy={34} blur={12} gap="0.26em" style={{ marginTop: 14, fontFamily: SERIF, fontSize: 72, fontWeight: 500, color: C.ink, lineHeight: 1.05 }} />
              <div style={{ marginTop: 26, width: 640, height: 1.5, background: alpha(C.ink, 0.16), transform: `scaleX(${rule.toFixed(4)})`, transformOrigin: '0 50%' }} />
            </div>
          );
        })}
      </div>

      <Vignette strength={0.5} inner={0.42} color="#050102" />
      <Grain opacity={0.08} blend="soft-light" />
    </AbsoluteFill>
  );
};
