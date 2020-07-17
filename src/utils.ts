import { AssertionError } from 'assert';

import { Color, Coord, Dimensions, ImageData } from './types';

/**
 * Converts a Pixel into a hex string like '0x00FF00'
 */
export const toHexColor = ([r, g, b]: Color) => {
  const toHexValue = (c: number) => {
    const s = c.toString(16).toUpperCase();
    return s.length === 2 ? s : '0' + s;
  };

  return `0x${toHexValue(r)}${toHexValue(g)}${toHexValue(b)}`;
};

export const isTransparent = (pixel: Color) => pixel[3] < 64;

export const getAveragePixelValue = ([r, g, b]: Color) =>
  Math.round((r + g + b) / 3);

export const getPixelFromSource = (dimensions: Dimensions) => (
  image: ImageData,
  coord: Coord
): Color => {
  const [width, height] = dimensions;
  const [x, y] = coord;
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return [0, 0, 0, 0]; // Default to transparent if an invalid coordinate
  }

  const idx = x * 4 + y * 4 * width;
  return [image[idx], image[idx + 1], image[idx + 2], image[idx + 3]];
};

/**
 * Asserts that a given value is truthy. Uses TypeScript 3.7 assertion types.
 *
 * @example
 * ```ts
 * const foo: string|undefined = getSomeData();
 * asert(foo, 'foo must be defined');
 * console.log(foo.length); // OK
 * ```
 */
export function assert(
  condition: unknown,
  message = 'Unexpected falsy value'
): asserts condition {
  if (!condition) {
    throw new AssertionError({ message, actual: condition });
  }
}
