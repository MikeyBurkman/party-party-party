import {
  Transform,
  Color,
  Dimensions,
  Coord,
  Image,
  TransformInput,
} from './types';
import { assert, isTransparent, getAveragePixelValue } from './utils';

const clampColor = ([r, g, b, a]: Color): Color => {
  const clamp = (n: number) => Math.max(Math.min(n, 255), 0);

  return [clamp(r), clamp(g), clamp(b), clamp(a)];
};

const mapCoords = (
  [width, height]: Dimensions,
  cb: (coord: Coord) => Color
): Image => {
  const transformedImage: Image = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      transformedImage.push(...clampColor(cb([x, y])));
    }
  }
  return transformedImage;
};

const PARTY_COLORS: Color[] = [
  [255, 141, 139, 255],
  [254, 214, 137, 255],
  [136, 255, 137, 255],
  [135, 255, 255, 255],
  [139, 181, 254, 255],
  [215, 140, 255, 255],
  [255, 140, 255, 255],
  [255, 104, 247, 255],
  [254, 108, 183, 255],
  [255, 105, 104, 255],
];

export const party: Transform = {
  name: 'party',
  fn: ({ getSourcePixel, dimensions, frameIndex, totalFrameCount }) =>
    mapCoords(dimensions, (coord) => {
      const srcPixel = getSourcePixel(coord);

      if (isTransparent(srcPixel)) {
        return [0, 0, 0, 0];
      }

      const partyColorIdx = Math.floor(
        (frameIndex / totalFrameCount) * PARTY_COLORS.length
      );
      const partyColor = PARTY_COLORS[partyColorIdx];

      const gray = getAveragePixelValue(srcPixel);

      return [
        (gray * partyColor[0]) / 255,
        (gray * partyColor[1]) / 255,
        (gray * partyColor[2]) / 255,
        255,
      ];
    }),
};

export const backgroundParty: Transform = {
  name: 'background-party',
  fn: ({ getSourcePixel, dimensions, frameIndex, totalFrameCount }) =>
    mapCoords(dimensions, (coord) => {
      const srcPixel = getSourcePixel(coord);

      // Make the transparent parts colorful
      if (isTransparent(srcPixel)) {
        const partyColorIdx = Math.floor(
          (frameIndex / totalFrameCount) * PARTY_COLORS.length
        );
        return PARTY_COLORS[partyColorIdx];
      }

      return srcPixel;
    }),
};

export const bounce: Transform<number> = {
  name: 'bounce',
  validateParams: (args) => {
    assert(args.length === 1, 'bounce requires one argument');
    const x = parseFloat(args[0]);
    assert(x, 'bounce requires a non-zero number for an argument');
    return x;
  },
  fn: ({
    getSourcePixel,
    dimensions,
    frameIndex,
    totalFrameCount,
    parameters: bounceSpeed,
  }) => {
    return mapCoords(dimensions, ([x, y]) => {
      const yOffset =
        y +
        Math.round(
          bounceSpeed * Math.sin((frameIndex / totalFrameCount) * 2 * Math.PI)
        );

      return getSourcePixel([x, yOffset]);
    });
  },
};

export const shake: Transform<number> = {
  name: 'shake',
  validateParams: (args) => {
    assert(args.length === 1, 'shake requires one argument');
    const x = parseFloat(args[0]);
    assert(x, 'shake requires a non-zero number for an argument');
    return x;
  },
  fn: ({
    getSourcePixel,
    dimensions,
    frameIndex,
    totalFrameCount,
    parameters: shakeSpeed,
  }) => {
    return mapCoords(dimensions, ([x, y]) => {
      const xOffset =
        x +
        Math.round(
          shakeSpeed * Math.cos((frameIndex / totalFrameCount) * 2 * Math.PI)
        );

      return getSourcePixel([xOffset, y]);
    });
  },
};

export const rotate: Transform = {
  name: 'rotate',
  fn: ({ getSourcePixel, frameIndex, totalFrameCount, dimensions }) => {
    const centerX = dimensions[0] / 2;
    const centerY = dimensions[1] / 2;

    return mapCoords(dimensions, ([x, y]) => {
      const xRelCenter = x - centerX;
      const yRelCenter = y - centerY;

      const amount = frameIndex / totalFrameCount;
      const cos = Math.cos(2 * Math.PI * amount);
      const sin = Math.sin(2 * Math.PI * amount);

      const newCoord: Coord = [
        Math.round(centerX + xRelCenter * cos - yRelCenter * sin),
        Math.round(centerY + yRelCenter * cos + xRelCenter * sin),
      ];

      return getSourcePixel(newCoord);
    });
  },
};

export const circle: Transform<number> = {
  name: 'circle',
  validateParams: (args) => {
    assert(args.length === 1, 'circle requires one argument');
    const x = parseInt(args[0], 10);
    assert(x > 0, 'circle requires a positive non-zero number for an argument');
    return x;
  },
  fn: ({
    getSourcePixel,
    dimensions,
    frameIndex,
    totalFrameCount,
    parameters: partyRadius,
  }) => {
    const xOffset = Math.round(
      partyRadius * Math.sin(-2 * Math.PI * (frameIndex / totalFrameCount))
    );
    const yOffset = Math.round(
      partyRadius * Math.cos(-2 * Math.PI * (frameIndex / totalFrameCount))
    );

    return mapCoords(dimensions, ([x, y]) =>
      getSourcePixel([x + xOffset, y + yOffset])
    );
  },
};

export const staticc: Transform<number> = {
  name: 'static',
  validateParams: (args) => {
    assert(args.length === 1, 'static requires one argument');
    const x = parseFloat(args[0]);
    assert(x, 'static requires a non-zero number for an argument');
    return x;
  },
  fn: ({ dimensions, getSourcePixel, parameters: strength, random }) => {
    return mapCoords(dimensions, (coord) => {
      const src = getSourcePixel(coord);

      if (isTransparent(src)) {
        return [0, 0, 0, 0];
      }

      const inverse = Math.ceil(random() * strength) > 1;

      return inverse ? [255 - src[0], 255 - src[1], 255 - src[2], src[3]] : src;
    });
  },
};

const lightningIntensities: Color[] = [
  [0, 15, 40, 255], // dark color
  [150, 150, 175, 255],
  [180, 180, 205, 255],
  [210, 210, 235, 255],
];

export const lightning: Transform = {
  name: 'lightning',
  fn: ({ dimensions, getSourcePixel, random }) => {
    const i = random();
    const flashIntensity = i < 0.4 ? 0 : i < 0.7 ? 1 : i < 0.9 ? 2 : 3;

    return mapCoords(dimensions, (coord) => {
      const src = getSourcePixel(coord);

      if (isTransparent(src)) {
        return lightningIntensities[flashIntensity];
      }

      if (flashIntensity > 0) {
        // We're flashing, so brighten up the image a little
        const icf = 1.02 * flashIntensity;
        return [src[0] * icf, src[1] * icf, src[2] * icf, src[3]];
      }

      // Image is dark
      return src;
    });
  },
};

export const tranformInput = <T>(
  transform: Transform<T>,
  params: T
): TransformInput<T> => ({
  transform,
  params,
});

export const transformsList = [
  party,
  backgroundParty,
  rotate,
  bounce,
  shake,
  circle,
  staticc,
  lightning,
];
