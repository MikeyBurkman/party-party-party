import { assert, mapImage } from '../utils';
import { Coord, Transform } from '../types';

export const rotate: Transform<{ sign: number }> = {
  name: 'rotate',
  validateParams: (args) => {
    assert(
      args.length === 0 || args.length === 1,
      'rotate requires either no or one argument'
    );
    if (args.length === 0) {
      return { sign: 1 };
    }
    const sign = parseInt(args[0]);
    assert(sign === 1 || sign === -1, 'rotate argument must be either 1 or -1');
    return { sign };
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
      const centerX = dimensions[0] / 2;
      const centerY = dimensions[1] / 2;
      const [x, y] = coord;
      const xRelCenter = x - centerX;
      const yRelCenter = y - centerY;

      const amount = (frameIndex / frameCount) * parameters.sign;
      const cos = Math.cos(2 * Math.PI * amount);
      const sin = Math.sin(2 * Math.PI * amount);

      const newCoord: Coord = [
        Math.round(centerX + xRelCenter * cos - yRelCenter * sin),
        Math.round(centerY + yRelCenter * cos + xRelCenter * sin),
      ];

      return getSrcPixel(newCoord);
    }
  ),
};
