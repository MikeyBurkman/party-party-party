import { Transform, ImageData } from '../types';
import { assert, getPixelFromSource } from '../utils';

export const resizeBackground: Transform<{ width: number; height: number }> = {
  name: 'resize-background',
  validateParams: (args) => {
    assert(args.length === 2, 'resize-background requires two arguments');
    const width = parseFloat(args[0]);
    const height = parseFloat(args[1]);
    assert(
      width > 0,
      'resize-background requires a non-zero number for the width'
    );
    assert(
      height > 0,
      'resize-background requires a non-zero number for the height'
    );
    return { width, height };
  },
  fn: ({ image, parameters }) => {
    const [width, height] = image.dimensions;
    const { width: newWidth, height: newHeight } = parameters;
    assert(
      newWidth >= width,
      'New width for resize-background needs to be greater than or equal to the original'
    );
    assert(
      newHeight >= height,
      'New height for resize-background needs to be greater than or equal to the original'
    );

    const xPadding = (newWidth - width) / 2;
    const yPadding = (newHeight - height) / 2;

    const newFrames = image.frames.map((frame) => {
      const transformedImageData: ImageData = [];
      for (let y = 0; y < newHeight; y += 1) {
        for (let x = 0; x < newWidth; x += 1) {
          const pixel =
            x > xPadding &&
            x < newWidth - xPadding &&
            y > yPadding &&
            y < newHeight - yPadding
              ? getPixelFromSource(image.dimensions, frame.data, [
                  x - xPadding,
                  y - yPadding,
                ])
              : [0, 0, 0, 0];
          transformedImageData.push(...pixel);
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
