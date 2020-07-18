import { Transform } from '../types';
import { assert, mapImage } from '../utils';

export const circle: Transform<{ partyRadius: number }> = {
  name: 'circle',
  validateParams: (args) => {
    assert(args.length === 1, 'circle requires one argument');
    const partyRadius = parseInt(args[0], 10);
    assert(
      partyRadius > 0,
      'circle requires a positive non-zero number for an argument'
    );
    return { partyRadius };
  },
  fn: mapImage(({ coord, frameCount, frameIndex, getSrcPixel, parameters }) => {
    const [x, y] = coord;
    const xOffset = Math.round(
      parameters.partyRadius *
        Math.sin(-2 * Math.PI * (frameIndex / frameCount))
    );
    const yOffset = Math.round(
      parameters.partyRadius *
        Math.cos(-2 * Math.PI * (frameIndex / frameCount))
    );
    return getSrcPixel([x + xOffset, y + yOffset]);
  }),
};
