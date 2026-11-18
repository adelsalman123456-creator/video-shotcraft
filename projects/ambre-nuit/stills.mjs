import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'AmbreNuit' });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: `out/qa/f${frame}.png`, scale: 1 });
  console.log('ok', frame);
}
