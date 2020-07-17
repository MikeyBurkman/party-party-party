// @ts-ignore TODO
import getPixels from 'get-pixels';
// @ts-ignore TODO
import gifEncoder from 'gif-encoder';
import { WriteStream } from 'fs';
import seedrandom from 'seedrandom';

import { Color, TransformInput, Image, Dimensions, ImageData } from './types';
import { toHexColor, getPixelFromSource } from './utils';

interface RunArgs {
  inputFilename: string;
  outputStream: WriteStream;
  transformList: TransformInput<any>[];
  frameCount: number;
}

export const run = async ({
  inputFilename,
  outputStream,
  transformList,
  frameCount,
}: RunArgs) => {
  const random = seedrandom(inputFilename);

  const originalImage = await readImage(inputFilename);

  const frames: Image[] = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    // Apply each of the transforms in order, passing the image created from the previous transform to the next
    const frame = transformList.reduce(
      (image, transformInput) =>
        transformInput.transform.fn({
          image,
          frameIndex,
          getSourcePixel: getPixelFromSource(image),
          parameters: transformInput.params,
          totalFrameCount: frameCount,
          random,
        }),
      originalImage
    );
    frames.push(frame);
  }

  // Transform any of our transparent pixels to what our gif understands to be transparent
  const { image, transparentColor } = encodeTransparency(
    frames.map((f) => f.data)
  );

  createGif(frames[0].shape, image, transparentColor, outputStream);
};

/**
 * Each pixel in our image has an alpha channel, but gifs don't.
 * We transform each pixel that appears transparent to be a designated transparent color.
 */
const encodeTransparency = (
  frames: ImageData[]
): { image: ImageData[]; transparentColor: Color } => {
  // We need a transparent color, so we're going green screen. If you got green, it'll be transparent. Sorry.
  // TODO: Go through the pixels in each frame and find a color that isn't used, and make that our transparent color.
  const transparentColor: Color = [0, 255, 0, 255];

  const image = frames.map((frame) => {
    const img: ImageData = [];
    for (let i = 0; i < frame.length; i += 4) {
      if (frame[i + 3] < 128) {
        // Anything more than halfway transparent is considered transparent
        img.push(...transparentColor);
      } else {
        img.push(frame[i]);
        img.push(frame[i + 1]);
        img.push(frame[i + 2]);
        img.push(255); // Gifs don't do transparency, I dunno why they take in an alpha value...
      }
    }
    return img;
  });

  return { image, transparentColor };
};

const createGif = (
  dimensions: Dimensions,
  frames: ImageData[],
  transparentColor: Color,
  outputStream: WriteStream
) => {
  const [width, height] = dimensions;
  const gif = new gifEncoder(width, height);
  gif.pipe(outputStream);

  gif.setDelay(50);
  gif.setRepeat(0);
  gif.setTransparent(toHexColor(transparentColor));
  //gif.setQuality(500);
  gif.writeHeader();
  gif.on('readable', () => {
    gif.read();
  });

  frames.forEach((f) => gif.addFrame(f));

  gif.finish();
};

const readImage = (inputFilename: string): Promise<Image> =>
  new Promise<Image>((res, rej) =>
    getPixels(inputFilename, (err: Error, getPixelResults: Image) => {
      if (err) {
        return rej(err);
      } else {
        return res(getPixelResults);
      }
    })
  );
