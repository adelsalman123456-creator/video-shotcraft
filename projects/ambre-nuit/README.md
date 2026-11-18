# Ambre Nuit — perfume promo (video-shotcraft)

A 26-second, 1920×1080 / 30fps promo for a **fictional** fragrance, *Ambre Nuit* by *Maison Élan*,
built with the video-shotcraft workflow (autonomous free-creation mode) and Remotion.

## Storyboard

| # | Frames | Shot card (demo source) | Content |
|---|---|---|---|
| S1 | 0–189 | `light-play-moves` · A spotlight-sweep | Velvet theatre; a pendulum follow-spot sweeps the dark title "Ambre Nuit", iris opens on beat 7 |
| S2 | 189–384 | `light-play-moves` · B sheen-sweep | Hand-built SVG flacon (thick glass, amber juice, black/gold cap) rises; one clipped sheen on beat 19; "Bottled twilight." |
| S3 | 384–607 | `blur-slide` | "Three acts of one night." + note pyramid: Top / Heart / Base land on beats 30 / 32 / 34 |
| S4 | 607–774 | `letterspace-materialize` | Wordmark "ambre nuit" crystallises over an amber-hour lake (completes on beat 46), tagline + house name |

Cuts sit on the BGM beat grid (`src/lib/brand.ts → beatF`), with 16-frame crossfades and a final fade to black.

- **Look**: velvet night `#170a0c`, ivory `#f8efe2`, champagne gold `#e3bd7f`, amber juice; Cormorant Garamond (OFL, embedded) + Inter.
- **Motion voice**: "refined luxury" preset — long, unhurried eases, no bounce; light effects limited to two (S1 spot, S2 sheen).
- **Audio**: BGM *Cat Walk* by Arulo (Mixkit Stock Music Free License, ~129 BPM). No SFX: Freesound was blocked by the build container's network.

## Render

```bash
npm ci
npm run render         # with music  → out/ambre-nuit.mp4
npm run render:nobgm   # silent      → out/ambre-nuit-no-bgm.mp4
npm run dev            # Remotion Studio
```
