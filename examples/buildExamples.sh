# Default party
echo "Building party-smile.gif"
../bin/ppp --src=smile.png --dest=party-smile.gif --frame-count=10 --party

# Resize
echo "Building big-smile.gif"
../bin/ppp --src=smile.png --dest=big-smile.gif --resize=320,320

# Resize Background
echo "Building big-background-smile.gif"
../bin/ppp --src=smile.png --dest=big-background-smile.gif --resize-background=320,320

# Background party
echo "Building backgound-party-smile.gif"
../bin/ppp --src=smile.png --dest=background-party-smile.gif --frame-count=10 --background-party

# Rotate
echo "Building rotate-smile.gif"
../bin/ppp --src=smile.png --dest=rotate-smile.gif --frame-count=10 --rotate

# Bounce
echo "Building bounce-smile.gif"
../bin/ppp --src=smile.png --dest=bounce-smile.gif --frame-count=10 --bounce=8

# Shake
echo "Building shake-smile.gif"
../bin/ppp --src=smile.png --dest=shake-smile.gif --frame-count=10 --shake=8

# Circle
echo "Building circle-smile.gif"
../bin/ppp --src=smile.png --dest=circle-smile.gif --frame-count=10 --circle=6

# Static
echo "Building static-smile.gif"
../bin/ppp --src=smile.png --dest=static-smile.gif --frame-count=10 --static=1.5

# Lightning
echo "Building lightning-smile.gif"
../bin/ppp --src=smile.png --dest=lightning-smile.gif --frame-count=10 --lightning

# Ripple
echo "Building ripple-smile.gif"
../bin/ppp --src=smile.png --dest=ripple-smile.gif --frame-count=10 --ripple=10,4

# Expand
echo "Building expand-smile.gif"
../bin/ppp --src=smile.png --dest=expand-smile.gif --frame-count=20 --expand=14

# Solid Background
echo "Building solid-background-smile.gif"
../bin/ppp --src=smile.png --dest=solid-background-smile.gif --solid-background=0x0000FF

# Roxbury
echo "Building roxbury-smile.gif"
../bin/ppp --src=smile.png --dest=roxbury-smile.gif --frame-count=9 --roxbury

#### Combo examples ####

# Bouncing Party
echo "Building bounce-party-smile.gif"
../bin/ppp --src=smile.png --dest=bounce-party-smile.gif --frame-count=10 --resize=120,120 --bounce=6 --party

# Rotating Bouncing Circle Party
echo "Building everything-smile.gif"
../bin/ppp --src=smile.png --dest=everything-smile.gif --resize=240,240 --resize-background=320,320 --frame-count=20 --rotate=-1 --circle=50 --background-party
