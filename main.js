import {
  collidesWithDOM,
  getKey,
  hasFocus,
  initBounds,
  initDOMObjectsDimensions,
  listenerAdd
} from "./modules/browser_utilities.js";

import {
  gooseSpriteCoordinates,
  stationarySpriteIndexes,
  runningSpriteIndexes,
  ascendSpriteIndexes,
  descendSpriteIndexes
} from "./modules/goose_sprite_coordinates.js";

import {
  initialGooseXPosition,
  determineDirection,
  leftArrowTransform,
  rightArrowTransform,
  downArrowTransform,
  upArrowTransform,
  ascendGooseY,
  randomizeStationaryAnimation,
  nextStationarySpriteIndex,
  nextAscendSpriteIndex,
  nextDescendSpriteIndex,
  nextRunningSpriteIndex
} from "./modules/goose_movements.js";

import { styleGoose, draw } from "./modules/goose_sprite.js";

// TODO: Decompose this arrow function into a namespace, distinct functions rather than being a big
// bag of self execution on `window`.
(() => {
  "use strict";
  /* eslint-env browser */

  const UPDATE_INTERVAL = 30;
  const MOVEMENT_SPEED = 5;
  const JUMP_HEIGHT = 11;
  const LEFT_ARROW_KEY_CODE = 37;
  const UP_ARROW_KEY_CODE = 38;
  const RIGHT_ARROW_KEY_CODE = 39;
  const DOWN_ARROW_KEY_CODE = 40;

  let _goose = {
    x: 0,
    y: 0,
  };
  let _bounds = {
    height: 0,
    width: 0
  };
  let _keyHeld = [];
  let _DOMObjectsDimensions = [];

  // Global animation variables.
  let currentSpriteIndex = 0;
  let step = 0;
  let stationaryStep = 0;
  let ascend = {
    height: 0,
    active: function() {
      return this.height > -1;
    }
  };

  function gooseify() {
    if(!document.createRange)
      return; // :'(

    initEventListeners();
    _goose = styleGoose(_goose);

    resize();
    _goose.x = initialGooseXPosition(_bounds.width);
    _goose.y = 1;

    setInterval(resize, 200);
    setInterval(
      () => {  update(_bounds, _keyHeld, _DOMObjectsDimensions, _goose);  },
      UPDATE_INTERVAL
    );

    _goose = draw(_goose, gooseSpriteCoordinates[0]);
    document.body.appendChild(_goose);
  }

  function initEventListeners() {
    _keyHeld.fill(false);
    listenerAdd(document, "keydown", function(e) {
      if(!hasFocus(_goose)) { return; }

      let k = getKey(e);
      _keyHeld[k] = true;

      if(k >= LEFT_ARROW_KEY_CODE && k <= DOWN_ARROW_KEY_CODE) {
        e.preventDefault();
      }
    });

    listenerAdd(document, "keyup", function(e) {
      if(!hasFocus(_goose)) { return; }

      let k = getKey(e);
      _keyHeld[k] = false;

      if(k >= LEFT_ARROW_KEY_CODE && k <= DOWN_ARROW_KEY_CODE) {
        e.preventDefault();
      }
    });
  }

  function resize() {
    _DOMObjectsDimensions = initDOMObjectsDimensions();
    _bounds = initBounds();
  }

  function update(bounds, keyHeld, DOMObjectsDimensions, goose) {
    if(step > 1000000) {
      step = 0;
    }

    let oldX = goose.x;
    let oldY = goose.y;
    const [ ,, spriteFrameWidth, spriteFrameHeight ] = gooseSpriteCoordinates[currentSpriteIndex];

    const gooseAtBottom =  (goose.y + 2 > bounds.height);

    let sitting = gooseAtBottom || collidesWithDOM(
      {
        "top": goose.y - spriteFrameHeight,
        "left": goose.x,
        "width": spriteFrameWidth,
        "height": spriteFrameHeight
      },
      DOMObjectsDimensions,
      MOVEMENT_SPEED
    );

    if(keyHeld[LEFT_ARROW_KEY_CODE]) {
      goose.x = leftArrowTransform(goose.x, MOVEMENT_SPEED, spriteFrameWidth, bounds.width);
    } else if(keyHeld[RIGHT_ARROW_KEY_CODE]) {
      goose.x = rightArrowTransform(goose.x, MOVEMENT_SPEED, spriteFrameWidth, bounds.width);
    }

    if(keyHeld[UP_ARROW_KEY_CODE] && !ascend.active() && sitting) {
      ascend = upArrowTransform(ascend, JUMP_HEIGHT);
    } else if(keyHeld[DOWN_ARROW_KEY_CODE] || (!ascend.active() && !sitting && !gooseAtBottom)) {
      goose.y = downArrowTransform(goose.y, MOVEMENT_SPEED);
    }

    let direction = determineDirection(goose.x, oldX);
    let stationary = (goose.x == oldX && goose.y == oldY);
    let descending = !ascend.active() && !sitting;

    if(ascend.active()) {
      currentSpriteIndex = nextAscendSpriteIndex(ascendSpriteIndexes[direction], step);
      const spriteFrameHeight = gooseSpriteCoordinates[currentSpriteIndex][3];
      goose.y = ascendGooseY(goose, ascend.height, bounds.height, spriteFrameHeight);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);

      step++;
      ascend.height--;
      return;

    } else if(stationary) {
      currentSpriteIndex = nextStationarySpriteIndex(stationarySpriteIndexes, step);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);

      [ step, stationaryStep ] = randomizeStationaryAnimation(step, stationaryStep);
      return;

    } else if(descending) {
      currentSpriteIndex = nextDescendSpriteIndex(descendSpriteIndexes[direction], step);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);

      step++;
      return;

    } else {
      currentSpriteIndex = nextRunningSpriteIndex(runningSpriteIndexes[direction], step);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);

      step++;
      return;
    }
  }

  window.gooseify = gooseify;
})();
