import { Transform } from '../types';
import { assert, mapImage, isTransparent, fromHexColor } from '../utils';

const hexRegex = /^0x[0-9A-F]{6}$/;

export const solidBackground: Transform<{ color: string }> = {
  name: 'solid-background',
  validateParams: (args) => {
    assert(args.length === 1, 'solid-background requires one argument');
    const color = args[0];
    assert(
      hexRegex.test(color),
      'solid-background requires a color in the format 0xRRGGBB'
    );
    return { color };
  },
  fn: mapImage(({ coord, frameCount, frameIndex, getSrcPixel, parameters }) => {
    const p = getSrcPixel(coord);
    return isTransparent(p) ? fromHexColor(parameters.color) : p;
  }),
};
