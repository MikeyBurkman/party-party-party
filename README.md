# party-party-party

Turn a source image into an animated party emoji!

This smiling emoji is pretty cool:

![Smiling Emoji](./examples/smile.png 'Smiling Emoji')

However, it might be jealous of all those parrots and their parties. Let's help out our emoji friend.

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

Note: If you'd like to create emojis for Slack, make sure your input image is 128x128 (or less) and is max 128kb. Slack is pretty limited.

# Usage

- The first two arguments are always the source image filename, and the file name of the the gif you're creating.
- After that, you can provide an ordered list of transformations. Some transformations take in 1 or more parameters. See the following examples.

## Available transformations

#### Basic Party

The `party` transformation will turn all foreground (non-transparent) pixels multiple colors. This does not take any parameters.

```sh
./bin/ppp smile.png party-smile.gif party
```

![Party Smiling Emoji](./examples/party-smile.gif 'Party Smiling Emoji')

---

#### Background Party

The `background-party` transformation will turn all background (transparent) pixels multiple colors. This does not take any parameters.

```sh
./bin/ppp smile.png background-party-smile.gif background-party
```

![Background Party Smiling Emoji](./examples/background-party-smile.gif 'Background Party Smiling Emoji')

---

#### Rotate

The `rotate` transformation will cause your image to spin. This does not take any parameters.

```sh
./bin/ppp smile.png rotate-smile.gif rotate
```

![Rotate Party Smile Emoji](./examples/rotate-smile.gif 'Rotate Smile Emoji')

---

#### Bounce

The `bounce` transformation will cause your image to move up and down. This takes in one parameter, which is the max height from the center it will bounce.

```sh
./bin/ppp smile.png bounce-smile.gif bounce:8
```

![Bounce Smile Emoji](./examples/bounce-smile.gif 'Bounce Smile Emoji')

---

#### Shake

The `shake` transformation will cause your image to move left and right. This takes in one parameter, which is the max width from the center it will shake.

```sh
./bin/ppp smile.png shake-smile.gif bounce:8
```

![Shake Smile Emoji](./examples/shake-smile.gif 'Shake Smile Emoji')

---

#### Radius

The `radius` transformation will cause your image to move in a circle. It requires one parameter, which is the radius of the circle.
Note that this may make the image clip with the boundaries.

```sh
./bin/ppp smile.png radius-smile.gif radius:5
```

![Radius Party Smile Emoji](./examples/radius-smile.gif 'Radius Smile Emoji')

---

#### Static

The `static` transformation will cause some pixels of your gif be inverse colors, causing a staticy/interference effect.
This takes in one number parameter, where the higher it is, the more static
A value of 1 means no static. Fractional values are allowed

```sh
./bin/ppp smile.png static-smile.gif static:1.5
```

![Static Smile Emoji](./examples/static-smile.gif 'Static Smile Emoji')

---

#### Lightning

The `lightning` transformation will cause cause it to look like your gif is in a lightning storm. This takes no parameters.

```sh
./bin/ppp smile.png lightning-smile.gif lightning
```

![Lightning Smile Emoji](./examples/lightning-smile.gif 'Lightning Smile Emoji')

---

## Combining transformations

Multiple transformations may be combined by simply adding more to the arguments list.
Be aware that the ordering of transformations may affect how things look. If things look off, try reordering the transformations.

```sh
./bin/ppp smile.png bounce-party-smile.gif bounce:8 party
```

![Bounce Party Smile Emoji](./examples/bounce-party-smile.gif 'Bounce Party Smile Emoji')

---

And if you really just want to go overboard...

```sh
./bin/ppp smile.png everything-smile.gif static:1.5 rotate bounce:8 radius:5 background-party
```

![Everything Smile Emoji](./examples/everything-smile.gif 'Everything Smile Emoji')
