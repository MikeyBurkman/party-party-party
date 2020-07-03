import seedrandom from 'seedrandom';

import { Transform, Color, Dimensions, Coord, Image } from './types';
import { isTransparent, getAveragePixelValue } from './utils';

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

const party: Transform = {
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

const backgroundParty: Transform = {
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

const bounce: Transform<[string]> = {
  name: 'bounce',
  fn: ({
    getSourcePixel,
    dimensions,
    frameIndex,
    totalFrameCount,
    parameters,
  }) => {
    const bounceSpeed = parseFloat(parameters[0]); // TODO Validation
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

const shake: Transform<[string]> = {
  name: 'shake',
  fn: ({
    getSourcePixel,
    dimensions,
    frameIndex,
    totalFrameCount,
    parameters,
  }) => {
    const shakeSpeed = parseFloat(parameters[0]); // TODO Validation
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

const rotate: Transform = {
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

const radius: Transform<[string]> = {
  name: 'radius',
  fn: ({
    getSourcePixel,
    dimensions,
    frameIndex,
    totalFrameCount,
    parameters,
  }) => {
    const partyRadius = parseFloat(parameters[0]); // TODO validation

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

const staticc: Transform<[string]> = {
  name: 'static',
  fn: ({ dimensions, getSourcePixel, parameters, frameIndex }) => {
    const strength = parseFloat(parameters[0]);
    const rnd = seedrandom(frameIndex.toString());

    return mapCoords(dimensions, (coord) => {
      const src = getSourcePixel(coord);

      if (isTransparent(src)) {
        return [0, 0, 0, 0];
      }

      const inverse = Math.ceil(rnd() * strength) > 1;

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

const lightning: Transform = {
  name: 'lightning',
  fn: ({ dimensions, getSourcePixel, frameIndex, totalFrameCount }) => {
    const rnd = seedrandom(frameIndex.toString());

    const i = rnd();
    const flashIntensity = i > 0.92 ? 3 : i > 0.85 ? 2 : i > 0.75 ? 1 : 0;

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

export const transformsList = [
  party,
  backgroundParty,
  rotate,
  bounce,
  shake,
  radius,
  staticc,
  lightning,
];
