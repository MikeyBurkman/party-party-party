# Default party
echo "Building default party-smile.gif"
../bin/ppp smile.png party-smile.gif party

# Background party
echo "Building backgound-party-smile.gif"
../bin/ppp smile.png background-party-smile.gif background-party

# Rotate
echo "Building rotate-smile.gif"
../bin/ppp smile.png rotate-smile.gif rotate

# Bounce
echo "Building bounce-smile.gif"
../bin/ppp smile.png bounce-smile.gif bounce:8

# Shake
echo "Building shake-smile.gif"
../bin/ppp smile.png shake-smile.gif shake:8

# Radius
echo "Building radius-smile.gif"
../bin/ppp smile.png radius-smile.gif radius:5

# Static
echo "Building static-smile.gif"
../bin/ppp smile.png static-smile.gif static:1.5

# Lightning
echo "Building lightning-smile.gif"
../bin/ppp smile.png lightning-smile.gif lightning

#### Combo examples ####

# Bouncing Party
echo "Building bounce-party-smile.gif"
../bin/ppp smile.png bounce-party-smile.gif bounce:8 party

# Rotating Bouncing Radius Party
echo "Building everything-smile.gif"
../bin/ppp smile.png everything-smile.gif static:1.5 rotate bounce:8 radius:5 background-party
