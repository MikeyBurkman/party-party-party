import { mapImage, assert } from '../utils';
import { Transform } from '../types';

export const bounce: Transform<{ bounceSpeed: number }> = {
  name: 'bounce',
  validateParams: (args) => {
    assert(args.length === 1, 'bounce requires one argument');
    const bounceSpeed = parseFloat(args[0]);
    assert(bounceSpeed, 'bounce requires a non-zero number for an argument');
    return { bounceSpeed };
  },
  fn: mapImage(({ coord, frameCount, frameIndex, getSrcPixel, parameters }) => {
    const [x, y] = coord;
    const yOffset =
      y +
      Math.round(
        parameters.bounceSpeed *
          Math.sin((frameIndex / frameCount) * 2 * Math.PI)
      );

    return getSrcPixel([x, yOffset]);
  }),
};
