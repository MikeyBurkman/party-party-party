import seedrandom from 'seedrandom';

import { Color, Transform } from '../types';
import {
  mapFrames,
  mapCoords,
  getPixelFromSource,
  isTransparent,
} from '../utils';

const lightningIntensities: Color[] = [
  [0, 15, 40, 255], // dark color
  [150, 150, 175, 255],
  [180, 180, 205, 255],
  [210, 210, 235, 255],
];

export const lightning: Transform<{ random: seedrandom.prng }> = {
  name: 'lightning',
  validateParams: (args) => {
    const seed = args[0] ?? 'lightning';
    return { random: seedrandom(seed) };
  },
  fn: ({ image, parameters }) =>
    mapFrames(image, (data) => {
      const i = parameters.random();
      const flashIntensity = i < 0.9 ? 0 : i < 0.95 ? 1 : i < 0.98 ? 2 : 3;

      return mapCoords(image.dimensions, (coord) => {
        const src = getPixelFromSource(image.dimensions, data, coord);

        if (isTransparent(src)) {
          return lightningIntensities[flashIntensity];
        }

        if (flashIntensity > 0) {
          // We're flashing, so brighten up the image a little
          const icf = 1.02 * flashIntensity;
          return [src[0] * icf, src[1] * icf, src[2] * icf, src[3]];
        }

        // No lightning
        return src;
      });
    }),
};
