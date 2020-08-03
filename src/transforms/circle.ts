import { Transform } from '../types';
import { assert, mapImage } from '../utils';

export const circle: Transform<{ radius: number }> = {
  name: 'circle',
  validateParams: (args) => {
    assert(args.length === 1, 'circle requires one argument');
    const radius = parseFloat(args[0]);
    assert(
      radius > 0,
      'circle requires a positive non-zero number for an argument'
    );
    return { radius };
  },
  fn: mapImage(({ coord, frameCount, frameIndex, getSrcPixel, parameters }) => {
    const [x, y] = coord;
    const xOffset = Math.round(
      parameters.radius * Math.sin(-2 * Math.PI * (frameIndex / frameCount))
    );
    const yOffset = Math.round(
      parameters.radius * Math.cos(-2 * Math.PI * (frameIndex / frameCount))
    );
    return getSrcPixel([x + xOffset, y + yOffset]);
  }),
};
