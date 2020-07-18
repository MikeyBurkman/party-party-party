import { Transform } from '../types';
import { assert, mapImage } from '../utils';

export const shake: Transform<{ shakeSpeed: number }> = {
  name: 'shake',
  validateParams: (args) => {
    assert(args.length === 1, 'shake requires one argument');
    const shakeSpeed = parseFloat(args[0]);
    assert(shakeSpeed, 'shake requires a non-zero number for an argument');
    return { shakeSpeed };
  },
  fn: mapImage(({ coord, frameCount, frameIndex, getSrcPixel, parameters }) => {
    const [x, y] = coord;
    const xOffset =
      x +
      Math.round(
        parameters.shakeSpeed *
          Math.cos((frameIndex / frameCount) * 2 * Math.PI)
      );

    return getSrcPixel([xOffset, y]);
  }),
};
