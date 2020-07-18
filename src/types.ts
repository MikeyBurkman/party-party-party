/**
 * [R, G, B, A] in values 0 - 255 inclusive
 */
export type Color = [number, number, number, number];

/**
 * [x, y]
 */
export type Coord = [number, number];

/**
 * [width, height]
 */
export type Dimensions = [number, number];

/**
 * a one-dimensional array of pixels; looks like [r1,g1,b1,a1, r2,g2,b2,a2,...]
 */
export type ImageData = number[];

export type Frame = {
  data: ImageData;
};

/**
 * The results of get-pixels processImage()
 */
export interface Image {
  dimensions: Dimensions;
  frames: Frame[];
}

export type Random = seedrandom.prng;

export interface TransformFnOpts<Params> {
  /**
   * The image we're trying to transform
   */
  image: Image;

  /**
   * Use to generate "random" numbers. It's seeded, so that subsequent calls will yield the same value on the same image.
   */
  random: Random;

  /**
   * User-passed in parameters.
   * These need to be validated.
   * TODO We can probably add custom runtypes validation so this can all be typesafe.
   */
  parameters: Params;
}

export type TransformFn<Params> = (opts: TransformFnOpts<Params>) => Image;

export interface Transform<Params = unknown> {
  name: string;
  fn: TransformFn<Params>;
  validateParams?: (params: string[]) => Params;
}

export interface TransformInput<T> {
  transform: Transform<T>;
  params: T;
}
