// @ts-ignore TODO
import getPixels from 'get-pixels';
// @ts-ignore TODO
import gifEncoder from 'gif-encoder';
import { WriteStream } from 'fs';
import seedrandom from 'seedrandom';

import { Color, TransformInput, Image, Dimensions, ImageData } from './types';
import {
  toHexColor,
  getPixelFromSource,
  randomColor,
  fromHexColor,
  isTransparent,
} from './utils';

interface RunArgs {
  inputFilename: string;
  outputStream: WriteStream;
  transformList: TransformInput<any>[];
}

export const run = async ({
  inputFilename,
  outputStream,
  transformList,
}: RunArgs) => {
  const random = seedrandom(inputFilename);

  const originalImage = await readImage(inputFilename);

  const newImage: Image = transformList.reduce(
    (image, transformInput) =>
      transformInput.transform.fn({
        image,
        parameters: transformInput.params,
        random,
      }),
    originalImage
  );

  const transparentColor = getTransparentColor(newImage, random);

  // Transform any of our transparent pixels to what our gif understands to be transparent
  const image = encodeTransparency(
    newImage.frames.map((f) => f.data),
    transparentColor
  );

  createGif(newImage.dimensions, image, transparentColor, outputStream);
};

/**
 * Each pixel in our image has an alpha channel, but gifs don't.
 * We transform each pixel that appears transparent to be a designated transparent color.
 */
const encodeTransparency = (
  frames: ImageData[],
  transparentColor: Color
): ImageData[] => {
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

  return image;
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
    getPixels(
      inputFilename,
      (err: Error, getPixelResults: { shape: Dimensions; data: ImageData }) => {
        if (err) {
          return rej(err);
        } else {
          return res({
            frames: [
              {
                data: getPixelResults.data,
              },
            ],
            dimensions: getPixelResults.shape,
          });
        }
      }
    )
  );

const getTransparentColor = (image: Image, random: seedrandom.prng): Color => {
  const seenPixels = new Set<string>();
  const [width, height] = image.dimensions;
  let attempt = toHexColor([0, 255, 0, 255]); // Just start with green for now, since it's a likely candidate
  image.frames.forEach((frame) => {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const px = getPixelFromSource(image.dimensions, frame.data, [x, y]);
        if (!isTransparent(px)) {
          const hex = toHexColor(px);
          seenPixels.add(hex);
          if (hex === attempt) {
            // Uh oh, can't use our current pick for transparent because it exists in the image already
            attempt = findRandomColorNotInSet(random, seenPixels);
          }
        }
      }
    }
  });
  return fromHexColor(attempt);
};

const findRandomColorNotInSet = (
  random: seedrandom.prng,
  set: Set<string>,
  attempts = 0
): string => {
  const col = toHexColor(randomColor(random));
  if (attempts > 2000) {
    // Just give up in order to prevent a stack overflow or something...
    return col;
  }
  return set.has(col)
    ? findRandomColorNotInSet(random, set, attempts + 1)
    : col;
};
