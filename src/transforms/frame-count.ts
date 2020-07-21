import { Transform, Frame } from '../types';
import { assert } from '../utils';

export const frameCount: Transform<{ count: number }> = {
  name: 'frame-count',
  validateParams: (args) => {
    assert(args.length === 1, 'frame-count requires one argument');
    const count = parseInt(args[0], 10);
    assert(count > 0, 'frame-count requires a non-zero number');
    return { count };
  },
  fn: ({ image, parameters }) => {
    assert(
      image.frames.length === 1,
      'The frame-count transform requires a static image with just one frame'
    );
    const frames: Frame[] = [];
    for (let i = 0; i < parameters.count; i += 1) {
      frames.push({
        data: image.frames[0].data,
      });
    }
    return {
      dimensions: image.dimensions,
      frames,
    };
  },
};
