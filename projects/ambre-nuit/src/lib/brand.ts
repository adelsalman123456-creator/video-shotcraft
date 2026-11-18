// Ambre Nuit — design tokens (fictional fragrance house "Maison Élan").
// Palette: velvet night + amber liquid + champagne gold. One motion voice: "精致高端" preset
// (main ~48f, bezier(0.4,0,0.6,1), overshoot ≤1.02, no squash).
import { continueRender, delayRender } from 'remotion';
import { FONTS_CSS } from './fontsCss';
import { bezier } from './Polish';

export const C = {
  night0: '#170a0c',
  night1: '#0d0507',
  night2: '#060203',
  velvet: '#561a22',
  velvetDeep: '#210a0d',
  warm: '#ffe6c2', // tungsten white
  ink: '#f8efe2', // ivory
  ink2: '#cdb7a0',
  ink3: '#8f7a68',
  gold: '#e3bd7f',
  goldDeep: '#a77d40',
  amber: '#d9822b',
  amberDeep: '#7a3410',
};

export const SERIF = '"Cormorant Garamond", "Iowan Old Style", Palatino, Georgia, serif';
export const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';

export const LUX = bezier(0.4, 0, 0.6, 1);

const rgbOf = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};
export const alpha = (hex: string, a: number) => `rgba(${rgbOf(hex)},${a})`;

// Fonts: Cormorant Garamond embedded as data URIs (see fontsCss.ts); wait until the faces are decoded.
if (typeof document !== 'undefined' && !document.getElementById('an-fonts')) {
  const el = document.createElement('style');
  el.id = 'an-fonts';
  el.textContent = FONTS_CSS;
  document.head.appendChild(el);
  const handle = delayRender('fonts', { timeoutInMilliseconds: 60000 });
  Promise.all(
    ['400 40px', '500 40px', '600 40px', 'italic 400 40px', 'italic 500 40px'].map((spec) =>
      document.fonts.load(`${spec} "Cormorant Garamond"`),
    ),
  )
    .catch((err) => console.error('font load failed', err))
    .finally(() => continueRender(handle));
}

// Beat grid of the BGM (Cat Walk, 129.2 BPM, librosa fit): beat n at 0.7198s + n·0.4644s
export const FPS = 30;
export const beatF = (n: number) => Math.round((0.7198 + n * 0.4644) * FPS);
