// Coordinates describing each keyframe of the animation within the sprite sheet

// [ w, h ]
let restingSpriteSize = [ 30, 28 ];
let runningSpriteSize = [ 32, 19 ];
let preFlightSize = [ 26, 27 ];
let flyingSize = [ 26, 27 ];

// [x, y, w, h]
const gooseSpriteCoordinates = [
  // Stationary
  [ 0, 0 ].concat(restingSpriteSize),
  [ 30, 0 ].concat(restingSpriteSize),
  [ 60, 0 ].concat(restingSpriteSize),
  [ 90, 0 ].concat(restingSpriteSize),
  [ 120, 0 ].concat(restingSpriteSize),
  [ 150, 0 ].concat(restingSpriteSize),
  // Running
  [ 0, 28 ].concat(runningSpriteSize),
  [ 32, 28 ].concat(runningSpriteSize),
  [ 64, 28 ].concat(runningSpriteSize),
  [ 96, 28 ].concat(runningSpriteSize),
  [ 0, 47 ].concat(runningSpriteSize),
  [ 32,  47 ].concat(runningSpriteSize),
  [ 64,  47 ].concat(runningSpriteSize),
  [ 96, 47 ].concat(runningSpriteSize),
  // Pre-Flight
  [ 0, 66].concat(preFlightSize),
  [ 26, 66].concat(preFlightSize),
  // Flying
  [ 0,  93 ].concat(flyingSize),
  [ 26, 93 ].concat(flyingSize),
  [ 52, 93 ].concat(flyingSize),
  [ 78, 93 ].concat(flyingSize),
  [ 0, 120 ].concat(flyingSize),
  [ 26, 120 ].concat(flyingSize),
  [ 52, 120 ].concat(flyingSize),
  [ 78, 120 ].concat(flyingSize)
];

const stationaryFrameCount = 6;
const stationarySpriteCoordinates = range(0, stationaryFrameCount - 1);

const runDirectionFrameCount = 4;
const runLeft = range(6, runDirectionFrameCount);
const runRight = range(10, runDirectionFrameCount);
const runningSpriteCoordinates = [ runLeft, runRight];

const preFlightFrameCount = 2;
const preFlight = range(14, preFlightFrameCount);

const flyDirectionFrameCount = 4;
const flyRight = range(16, flyDirectionFrameCount - 1);
//  TODO: Need to add sprites for preFlight left. Right now preflight is always right.
const flyLeft = range(20, flyDirectionFrameCount - 1);

const ascendSpriteCoordinates = [ preFlight.concat(flyRight), preFlight.concat(flyLeft) ];
const descendSpriteCoordinates = [ flyRight, flyLeft ];

// Provides an array of numbers ranging from a -> (a + b)
function range(a, b){
  if(b < a) {
    b = a + b;
  }
  return [...Array(b - a + 1).keys()].map(x => x + a);
}

export {
  gooseSpriteCoordinates,
  stationarySpriteCoordinates,
  runningSpriteCoordinates,
  ascendSpriteCoordinates,
  descendSpriteCoordinates
};
