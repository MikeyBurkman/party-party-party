# party-party-party

Turn a source image into an animated party emoji!

This smiling emoji is pretty cool:

![Smiling Emoji](./examples/smile.png 'Smiling Emoji')

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

Note: If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less) and is max 128kb. Slack is pretty limited.

# Usage

- All arguments start with `--`:
  - `--src=FILENAME` This is the name of source file that you wish to transform
  - `--dest=FILENAME` This is the name of the gif that will be created
  - `--frame-count=NUMBER` This is an optional argument to specify how many frames the final gif will have. This often determines the speed of the animations. Defaults to 12 if not provided.
  - All other arguments are transforms
    - Some transforms may take one or more arguments. See the examples below.
    - These transforms are processed in the order they are read.

## Available transformations

#### Basic Party

The `party` transformation will turn all foreground (non-transparent) pixels multiple colors. This does not take any parameters.

```sh
../bin/ppp --src=smile.png --dest=party-smile.gif --party
```

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

---

#### Background Party

The `background-party` transformation will turn all background (transparent) pixels multiple colors. This does not take any parameters.

```sh
../bin/ppp --src=smile.png --dest=background-party-smile.gif --background-party
```

![Background Party Smiling Emoji](./examples/background-party-smile.gif 'Background Party Smiling Emoji')

---

#### Rotate

The `rotate` transformation will cause your image to spin. This does not take any parameters.

```sh
../bin/ppp --src=smile.png --dest=rotate-smile.gif --rotate
```

![Rotate Smile Emoji](./examples/rotate-smile.gif 'Rotate Smile Emoji')

---

#### Bounce

The `bounce` transformation will cause your image to move up and down. This takes in one parameter, which is the max height from the center it will bounce.

```sh
../bin/ppp --src=smile.png --dest=bounce-smile.gif --bounce=8
```

![Bounce Smile Emoji](./examples/bounce-smile.gif 'Bounce Smile Emoji')

---

#### Shake

The `shake` transformation will cause your image to move left and right. This takes in one parameter, which is the max width from the center it will shake.

```sh
../bin/ppp --src=smile.png --dest=shake-smile.gif --shake=8
```

![Shake Smile Emoji](./examples/shake-smile.gif 'Shake Smile Emoji')

---

#### Circle

The `circle` transformation will cause your image to move in a circle. It requires one parameter, which is the radius of the circle.
Note that this may make the image clip with the boundaries.

```sh
../bin/ppp --src=smile.png --dest=circle-smile.gif --circle=6
```

![Circle Party Smile Emoji](./examples/circle-smile.gif 'Circle Smile Emoji')

---

#### Static

The `static` transformation will cause some pixels of your gif be inverse colors, causing a staticy/interference effect.
This takes in one number parameter, where the higher it is, the more static
A value of 1 means no static. Fractional values are allowed

```sh
../bin/ppp --src=smile.png --dest=static-smile.gif --static=1.5
```

![Static Smile Emoji](./examples/static-smile.gif 'Static Smile Emoji')

---

#### Lightning

The `lightning` transformation will cause cause it to look like your gif is in a lightning storm. This takes no parameters.

```sh
../bin/ppp --src=smile.png --dest=lightning-smile.gif --lightning
```

![Lightning Smile Emoji](./examples/lightning-smile.gif 'Lightning Smile Emoji')

---

## Combining transformations

Multiple transformations may be combined by simply adding more to the arguments list.
Be aware that the ordering of transformations may affect how things look. If things look off, try reordering the transformations.

```sh
../bin/ppp --src=smile.png --dest=bounce-party-smile.gif --bounce=8 --party
```

![Bounce Party Smile Emoji](./examples/bounce-party-smile.gif 'Bounce Party Smile Emoji')

---

And if you really just want to go overboard...

```sh
../bin/ppp --src=smile.png --dest=everything-smile.gif --static=1.5 --rotate --bounce=8 --radius=5 --background-party
```

![Everything Smile Emoji](./examples/everything-smile.gif 'Everything Smile Emoji')

## Slowing things down with more frames

Some transformations are based on the frame of the gif. (This is needed to keep the animation smooth when played in a loop.)
Adding extra frames can slow down the animation, but beware that this will also increase the file size.

```sh
../bin/ppp --src=smile.png --dest=slow-rotate-smile.gif --rotate --frame-count=24
```

![Slow Rotate Smile Emoji](./examples/slow-rotate-smile.gif 'Slow Rotate Smile Emoji')
