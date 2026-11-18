import React from 'react';
import { Composition } from 'remotion';
import { Film, FILM_DURATION } from './Film';

export const Root: React.FC = () => (
  <Composition id="AmbreNuit" component={Film} durationInFrames={FILM_DURATION} fps={30} width={1920} height={1080} defaultProps={{ bgm: true }} />
);
