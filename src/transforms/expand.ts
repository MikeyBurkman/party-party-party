import { Transform } from '../types';
import { assert, mapImage } from '../utils';

export const expand: Transform<{ radius: number }> = {
  name: 'expand',
  validateParams: (args) => {
    assert(args.length === 1, 'blow-up requires one argument');
    const radius = parseFloat(args[0]);
    return { radius };
  },
  fn: mapImage(
    ({
      dimensions,
      coord,
      frameCount,
      frameIndex,
      getSrcPixel,
      parameters,
    }) => {
      const idx = frameIndex / frameCount;
      const dist = Math.cos(idx * 2 * Math.PI) * parameters.radius;

      // Kind of follows the same algorithm as resize, except the amount is dynamic
      const [width, height] = dimensions;
      const centerX = width / 2;
      const centerY = height / 2;

      const [x, y] = coord;
      const xRatio = (x - centerX) / width;
      const yRatio = (y - centerY) / height;

      const xOffset = Math.floor(dist * xRatio);
      const yOffset = Math.round(dist * yRatio);
      return getSrcPixel([x - xOffset, y - yOffset]);
    }
  ),
};
