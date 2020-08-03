import { Transform } from '../types';
import { assert, mapImage } from '../utils';

export const transpose: Transform<{ x: number; y: number }> = {
  name: 'transpose',
  validateParams: (args) => {
    assert(args.length === 2, 'transpose requires one argument');
    const x = parseInt(args[0], 10);
    const y = parseInt(args[1], 10);
    assert(!isNaN(x), 'shake requires anumber for the x argument');
    assert(!isNaN(y), 'shake requires a number for the x argument');
    return { x, y };
  },
  fn: mapImage(({ coord, frameCount, frameIndex, getSrcPixel, parameters }) => {
    const [x, y] = coord;

    return getSrcPixel([x + parameters.x, y + parameters.y]);
  }),
};
