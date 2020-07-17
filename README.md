# party-party-party

Turn a source image into an animated party emoji!

This smiling emoji is pretty cool:

![Smiling Emoji](./examples/smile.png 'Smiling Emoji')

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

Note: If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less) and is max 128kb. Slack is pretty limited.

# Usage

- Images are altered using one or more transformations. These transforms do things such as add colors, rotate the image, etc.
- Transparency in the source image is used by some transformations to imply "background". (Non-transparent pixels are the "foreground".)
- Transforms are performed in the order given. Reordering some transforms may yield a different result.
- All arguments start with `--`:
  - `--src=FILENAME` This is the name of source file that you wish to transform
  - `--dest=FILENAME` This is the name of the gif that will be created
  - All other arguments are transforms
    - Given in the form `--<NAME>=<ARG1>,<ARG2>`. Some transforms have no arguments, and thus require just `--<NAME>`. See the examples below for specifics.
    - These transforms are processed in the same order that they appear.

## Available transformations

### Frame Count

The `frame-count` transformation is required for most of the following animation transforms. It will control how many frames are in the final image. It takes one parameter: the number of frames.

#### Basic Party

The `party` transformation will turn all foreground (non-transparent) pixels multiple colors. This does not take any parameters.

```sh
../bin/ppp --src=smile.png --dest=party-smile.gif --frame-count=10 --party
```

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

---

#### Resize

The `resize` transformation will change the size of the image to the given width,height (in pixels), scaling the image to fit the new dimensions. Note that this transformation does not require the `frame-count` transform.

```sh
../bin/ppp --src=smile.png --dest=big-smile.gif --resize=320,320
```

![Big Smiling Emoji](./examples/big-smile.gif 'Big Smiling Emoji')

---

#### Resize Background

Similar to `resize`, the `resize-background` transform will change the size of the image to the given width,height (in pixels). However, it will only enlarge the dimensions of the image, without scaling anything. All extra space will be transparent. The new dimensions MUST be larger than the orginal. Note that this transformation does not require the `frame-count` transform.

```sh
../bin/ppp --src=smile.png --dest=big-background-smile.gif --resize-background=320,320
```

![Big Background Smiling Emoji](./examples/big-background-smile.gif 'Big Background Smiling Emoji')

---

#### Background Party

The `background-party` transformation will turn all background (transparent) pixels multiple colors. This does not take any parameters.

```sh
../bin/ppp --src=smile.png --dest=background-party-smile.gif --frame-count=10 --background-party
```

![Background Party Smiling Emoji](./examples/background-party-smile.gif 'Background Party Smiling Emoji')

---

#### Rotate

The `rotate` transformation will cause your image to spin. This optionally takes one argument to indicate the direction of rotation. Can be `1` or `-1`, defaults to `1`.

```sh
../bin/ppp --src=smile.png --dest=rotate-smile.gif --frame-count=10 --rotate
```

![Rotate Smile Emoji](./examples/rotate-smile.gif 'Rotate Smile Emoji')

---

#### Bounce

The `bounce` transformation will cause your image to move up and down. This takes in one parameter, which is the max height from the center it will bounce.

```sh
../bin/ppp --src=smile.png --dest=bounce-smile.gif --frame-count=10 --bounce=8
```

![Bounce Smile Emoji](./examples/bounce-smile.gif 'Bounce Smile Emoji')

---

#### Shake

The `shake` transformation will cause your image to move left and right. This takes in one parameter, which is the max width from the center it will shake.

```sh
../bin/ppp --src=smile.png --dest=shake-smile.gif --frame-count=10 --shake=8
```

![Shake Smile Emoji](./examples/shake-smile.gif 'Shake Smile Emoji')

---

#### Circle

The `circle` transformation will cause your image to move in a circle. It requires one parameter, which is the radius of the circle.
Note that this may make the image clip with the boundaries.

```sh
../bin/ppp --src=smile.png --dest=circle-smile.gif --frame-count=10 --circle=6
```

![Circle Party Smile Emoji](./examples/circle-smile.gif 'Circle Smile Emoji')

---

#### Static

The `static` transformation will cause some pixels of your gif be inverse colors, causing a staticy/interference effect.
This takes in one number parameter, where the higher it is, the more static
A value of 1 means no static. Fractional values are allowed

```sh
../bin/ppp --src=smile.png --dest=static-smile.gif --frame-count=10 --static=1.5
```

![Static Smile Emoji](./examples/static-smile.gif 'Static Smile Emoji')

---

#### Lightning

The `lightning` transformation will cause cause it to look like your gif is in a lightning storm. This takes no parameters.

```sh
../bin/ppp --src=smile.png --dest=lightning-smile.gif --frame-count=10 --lightning
```

![Lightning Smile Emoji](./examples/lightning-smile.gif 'Lightning Smile Emoji')

---

## Combining transformations

Multiple transformations may be combined by simply adding more to the arguments list.
Be aware that the ordering of transformations may affect how things look. If things look off, try reordering the transformations.

```sh
../bin/ppp --src=smile.png --dest=bounce-party-smile.gif --frame-count=10 --resize=120,120 --bounce=6 --party
```

![Bounce Party Smile Emoji](./examples/bounce-party-smile.gif 'Bounce Party Smile Emoji')

---

And if you really just want to go overboard...

```sh
../bin/ppp --src=smile.png --dest=everything-smile.gif --frame-count=10 --static=1.5 --rotate --bounce=8 --circle=5 --background-party
```

![Everything Smile Emoji](./examples/everything-smile.gif 'Everything Smile Emoji')

## Slowing things down with more frames

Many transformations are based on the current frame index in the gif. This is needed to keep the animation smooth when played in a loop. For instance, for the `rotate` transform, the image will _always_ be completely upside down when halfway through the frame count.
Adding extra frames can slow down the animation, but beware that this will also increase the file size.

```sh
../bin/ppp --src=smile.png --dest=slow-rotate-smile.gif --frame-count=24 --rotate=-1
```

![Slow Rotate Smile Emoji](./examples/slow-rotate-smile.gif 'Slow Rotate Smile Emoji')
