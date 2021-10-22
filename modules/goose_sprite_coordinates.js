

  // [ w, h ]
	let restingSpriteSize = [ 28, 24 ]
	let runningSpriteSize = [ 32, 19 ]
	let preFlightSize = [ 26, 27 ]
	let flyingSize = [ 26, 27 ]

	// [x, y, w, h]
	const gooseSpriteCoordinates = [
		// Resting
		[ 0, 0 ].concat(restingSpriteSize),
		[ 28,   0 ].concat(restingSpriteSize),
		[ 56,   0 ].concat(restingSpriteSize),
		[ 84,   0 ].concat(restingSpriteSize),
		[ 112,  0 ].concat(restingSpriteSize),
		[ 140,  0 ].concat(restingSpriteSize),
		[ 168,  0 ].concat(restingSpriteSize),
		// Running
		[ 0, 24 ].concat(runningSpriteSize),
		[ 32, 24 ].concat(runningSpriteSize),
		[ 64, 24 ].concat(runningSpriteSize),
		[ 96, 24 ].concat(runningSpriteSize),
		[ 0, 43 ].concat(runningSpriteSize),
		[ 32,  43 ].concat(runningSpriteSize),
		[ 64,  43 ].concat(runningSpriteSize),
		[ 96, 43 ].concat(runningSpriteSize),
		// Pre-Flight
		[ 0, 62].concat(preFlightSize),
		[ 26, 62].concat(preFlightSize),
		// Flying
		[ 0,  89 ].concat(flyingSize),
		[ 26, 89 ].concat(flyingSize),
		[ 52, 89 ].concat(flyingSize),
		[ 78, 89 ].concat(flyingSize),
		[ 0, 116 ].concat(flyingSize),
		[ 26, 116 ].concat(flyingSize),
		[ 52, 116 ].concat(flyingSize),
		[ 78, 116 ].concat(flyingSize)
	];

  const runLeft = [ 7,  8,  9, 10 ];
	const runRight = [ 11, 12, 13, 14 ];
	const runningSpriteCoordinates = [ runLeft, runRight];

	const preFlight = [ 15, 16 ];
	const flyRight = [ 17, 18, 19, 20 ];
	const flyLeft = [ 21, 22, 23, 24 ];
	const ascendSpriteCoordinates = [ preFlight.concat(flyRight), preFlight.concat(flyLeft) ];
	const descendSpriteCoordinates = [ flyRight, flyLeft ];

export {
  gooseSpriteCoordinates,
  runningSpriteCoordinates,
  ascendSpriteCoordinates,
  descendSpriteCoordinates
};
