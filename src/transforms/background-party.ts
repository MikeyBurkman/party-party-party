import { Transform, Color } from '../types';
import { mapImage, isTransparent } from '../utils';

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

export const backgroundParty: Transform = {
  name: 'background-party',
  fn: mapImage(({ coord, frameCount, frameIndex, getSrcPixel }) => {
    const srcPixel = getSrcPixel(coord);

    // Make the transparent parts colorful
    if (isTransparent(srcPixel)) {
      const partyColorIdx = Math.floor(
        (frameIndex / frameCount) * PARTY_COLORS.length
      );
      return PARTY_COLORS[partyColorIdx];
    }

    return srcPixel;
  }),
};
