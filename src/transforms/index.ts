import { Transform, TransformInput } from '../types';

import { backgroundParty } from './background-party';
import { bounce } from './bounce';
import { circle } from './circle';
import { expand } from './expand';
import { fisheye } from './fisheye';
import { frameCount } from './frame-count';
import { grayscale } from './grayscale';
import { lightning } from './lightning';
import { party } from './party';
import { resize } from './resize';
import { resizeBackground } from './resize-background';
import { ripple } from './ripple';
import { rotate } from './rotate';
import { roxbury } from './roxbury';
import { shake } from './shake';
import { solidBackground } from './solid-background';
import { staticc } from './static';
import { transpose } from './transpose';

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
  backgroundParty,
  bounce,
  circle,
  expand,
  fisheye,
  frameCount,
  grayscale,
  lightning,
  party,
  resize,
  resizeBackground,
  ripple,
  rotate,
  roxbury,
  shake,
  solidBackground,
  staticc,
  transpose,
];
