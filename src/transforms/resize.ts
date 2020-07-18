import { Transform, ImageData } from '../types';
import { assert, getPixelFromSource } from '../utils';

export const resize: Transform<{ width: number; height: number }> = {
  name: 'resize',
  validateParams: (args) => {
    assert(args.length === 2, 'resize requires two arguments');
    const width = parseFloat(args[0]);
    const height = parseFloat(args[1]);
    assert(width > 0, 'resize requires a non-zero number for the width');
    assert(height > 0, 'resize requires a non-zero number for the height');
    return { width, height };
  },
  fn: ({ image, parameters }) => {
    const [width, height] = image.dimensions;
    const { width: newWidth, height: newHeight } = parameters;
    const xRatio = width / newWidth;
    const yRatio = height / newHeight;

    const newFrames = image.frames.map((frame) => {
      const transformedImageData: ImageData = [];
      for (let y = 0; y < newHeight; y += 1) {
        for (let x = 0; x < newWidth; x += 1) {
          // Simple nearest-neighbor image scaling.
          // Arguably the worst of the scaling algorithms, but it's quick,
          //  and we're generally dealing with small images anyhow.
          const srcX = Math.floor(x * xRatio);
          const srcY = Math.floor(y * yRatio);
          transformedImageData.push(
            ...getPixelFromSource(image.dimensions, frame.data, [srcX, srcY])
          );
        }
      }
      return {
        data: transformedImageData,
      };
    });

    return {
      frames: newFrames,
      dimensions: [newWidth, newHeight],
    };
  },
};
