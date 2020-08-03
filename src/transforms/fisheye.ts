import { Transform } from '../types';
import { assert, mapImage } from '../utils';

// Probably still needs work -- the inner pixels get all funky still
export const fisheye: Transform<{ radius: number }> = {
  name: 'fisheye',
  validateParams: (args) => {
    assert(args.length === 1, 'expand requires one argument');
    const radius = parseFloat(args[0]);
    assert(
      radius > 0,
      'circle requires a positive non-zero number for an argument'
    );
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
      const expanding = idx < 0.5;
      const [width, height] = dimensions;
      const dist = (expanding ? idx : 1 - idx) * parameters.radius;
      const centerX = width / 2;
      const centerY = height / 2;

      const [x, y] = coord;
      const angle = Math.atan2(centerY - y, centerX - x);

      const xOffset = Math.round(dist * Math.cos(angle));
      const yOffset = Math.round(dist * Math.sin(angle));
      return getSrcPixel([x + xOffset, y + yOffset]);
    }
  ),
};
