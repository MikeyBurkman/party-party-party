import { Transform } from '../types';
import { assert, mapImage, isTransparent } from '../utils';

export const staticc: Transform<{ strength: number }> = {
  name: 'static',
  validateParams: (args) => {
    assert(args.length === 1, 'static requires one argument');
    const strength = parseFloat(args[0]);
    assert(strength, 'static requires a non-zero number for an argument');
    return { strength };
  },
  fn: mapImage(({ coord, getSrcPixel, parameters, random }) => {
    const src = getSrcPixel(coord);

    if (isTransparent(src)) {
      return [0, 0, 0, 0];
    }

    const inverse = Math.ceil(random() * parameters.strength) > 1;

    return inverse ? [255 - src[0], 255 - src[1], 255 - src[2], src[3]] : src;
  }),
};
