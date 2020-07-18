import { Transform } from '../types';
import { assert, mapFrames, mapCoords, getPixelFromSource } from '../utils';

export const ripple: Transform<{ amplitude: number; period: number }> = {
  name: 'ripple',
  validateParams: (args) => {
    assert(args.length === 2, 'ripple requires two arguments');
    const amplitude = parseFloat(args[0]);
    const period = parseFloat(args[1]);
    assert(
      period > 0,
      'ripple requires a non-zero number for the period argument'
    );
    return { amplitude, period };
  },
  fn: ({ image, parameters }) =>
    mapFrames(image, (data, frameIndex, frameCount) => {
      const { amplitude, period } = parameters;

      const height = image.dimensions[1];
      const shift = (frameIndex / frameCount) * 2 * Math.PI;
      return mapCoords(image.dimensions, ([x, y]) => {
        const offset = Math.round(
          amplitude * Math.sin((y / height) * period * Math.PI + shift)
        );

        return getPixelFromSource(image.dimensions, data, [x + offset, y]);
      });
    }),
};
