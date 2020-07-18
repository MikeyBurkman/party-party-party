import { Transform, TransformInput } from '../types';

import { backgroundParty } from './background-party';
import { bounce } from './bounce';
import { circle } from './circle';
import { frameCount } from './frame-count';
import { grayscale } from './grayscale';
import { lightning } from './lightning';
import { party } from './party';
import { resize } from './resize';
import { resizeBackground } from './resize-background';
import { ripple } from './ripple';
import { rotate } from './rotate';
import { shake } from './shake';
import { staticc } from './static';

/**
 * Just a helper function for type safety, if needing to call a hard-coded transform programatically
 */
export const tranformInput = <T>(
  transform: Transform<T>,
  params: T
): TransformInput<T> => ({
  transform,
  params,
});

export const transformsList = [
  frameCount,
  resize,
  resizeBackground,
  party,
  backgroundParty,
  rotate,
  bounce,
  shake,
  circle,
  staticc,
  lightning,
  ripple,
  grayscale,
];
