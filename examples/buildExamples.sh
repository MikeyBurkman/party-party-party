# Default party
echo "Building default party-smile.gif"
../bin/ppp --src=smile.png --dest=party-smile.gif --party

# Background party
echo "Building backgound-party-smile.gif"
../bin/ppp --src=smile.png --dest=background-party-smile.gif --background-party

# Rotate
echo "Building rotate-smile.gif"
../bin/ppp --src=smile.png --dest=rotate-smile.gif --rotate

# Bounce
echo "Building bounce-smile.gif"
../bin/ppp --src=smile.png --dest=bounce-smile.gif --bounce=8

# Shake
echo "Building shake-smile.gif"
../bin/ppp --src=smile.png --dest=shake-smile.gif --shake=8

# Circle
echo "Building circle-smile.gif"
../bin/ppp --src=smile.png --dest=circle-smile.gif --circle=6

# Static
echo "Building static-smile.gif"
../bin/ppp --src=smile.png --dest=static-smile.gif --static=1.5

# Lightning
echo "Building lightning-smile.gif"
../bin/ppp --src=smile.png --dest=lightning-smile.gif --lightning

#### Combo examples ####

# Bouncing Party
echo "Building bounce-party-smile.gif"
../bin/ppp --src=smile.png --dest=bounce-party-smile.gif --bounce=8 --party

# Rotating Bouncing Circle Party
echo "Building everything-smile.gif"
../bin/ppp --src=smile.png --dest=everything-smile.gif --static=1.5 --rotate --bounce=8 --circle=5 --background-party

# Slow Rotate
../bin/ppp --src=smile.png --dest=slow-rotate-smile.gif --rotate --frame-count=24
