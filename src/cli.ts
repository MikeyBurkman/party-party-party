import { createWriteStream } from 'fs';
import { AssertionError } from 'assert';

import { transformsList } from './transforms';
import { run } from './run';
import { TransformInput } from './types';
import { assert } from './utils';

// See examples/buildExamples.sh for usage

const NAMED_ARG_REGEX = /^--([\w-]+)(=(.+))?$/;
const DEFAULT_FRAME_COUNT = 12;
const TRANSFORM_NAMES = transformsList.map((t) => t.name);

interface ParsedArg {
  name: string;
  param: string | undefined;
}

const parseNamedArg = (arg: string): ParsedArg => {
  const match = arg.match(NAMED_ARG_REGEX);
  assert(match, `Unexpected argument format: ${arg}`);
  return {
    name: match[1],
    param: match[3],
  };
};

const parseTransform = (transformArg: ParsedArg): TransformInput<any> => {
  const transform = transformsList.find((t) => t.name === transformArg.name);
  assert(transform, `Unknown transform: ${transformArg.name}`); // Should have already filtered these out

  const rawParams = transformArg.param ? transformArg.param.split(',') : [];
  assert(
    transform.validateParams || rawParams.length === 0,
    `Transform ${transformArg.name} does not take any arguments`
  );

  // Validate and convert the parameters if we need to.
  const params: any = transform.validateParams?.(rawParams) ?? undefined;

  return {
    transform,
    params,
  };
};

const getFrameCount = (frameCountArg: ParsedArg | undefined): number => {
  if (!frameCountArg) {
    return DEFAULT_FRAME_COUNT;
  }

  assert(frameCountArg.param, 'A value for --frame-count needs to be given');
  const frameCount = parseInt(frameCountArg.param, 10);
  assert(frameCount > 0, 'Value for --frame-count must be a positive integer');
  return frameCount;
};

const f = async () => {
  const args = process.argv.slice(2);

  const parsedArgs = args.map(parseNamedArg);

  let inputFnameArg = undefined;
  let outputFnameArg = undefined;
  let frameCountArg = undefined;
  const transformArgs: ParsedArg[] = [];

  for (const a of parsedArgs) {
    if (a.name === 'src') {
      inputFnameArg = a;
    } else if (a.name === 'dest') {
      outputFnameArg = a;
    } else if (a.name === 'frame-count') {
      frameCountArg = a;
    } else if (TRANSFORM_NAMES.includes(a.name)) {
      transformArgs.push(a);
    } else {
      assert(false, `Unknown transform: ${a.name}`);
    }
  }

  assert(inputFnameArg, 'Missing required argument: --src');
  assert(inputFnameArg.param, 'Missing value for argument: --src');

  assert(outputFnameArg, 'Missing required argument: --dest');
  assert(outputFnameArg.param, 'Missing value for argument: --dest');

  assert(transformArgs.length > 0, 'You must provide at least one transform');

  const transforms = transformArgs.map(parseTransform);

  // Ensure the output ends with .gif
  const output = outputFnameArg.param.endsWith('.gif')
    ? outputFnameArg.param
    : `${outputFnameArg.param}.gif`;

  await run({
    inputFilename: inputFnameArg.param,
    outputStream: createWriteStream(output),
    transformList: transforms,
    frameCount: getFrameCount(frameCountArg),
  });
};

f().catch((err) => {
  if (err instanceof AssertionError) {
    console.error(`Error: ${err.message}`);
  } else {
    console.error(err.stack);
  }
  process.exit(1);
});
