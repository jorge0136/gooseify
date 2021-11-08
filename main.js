import {
  collide,
  get_key,
  has_focus,
  init_bounds,
  initDOMObjectsDimensions,
  listener_add
} from "./modules/browser_utilities.js";

import {
  gooseSpriteCoordinates,
  stationarySpriteIndexes,
  runningSpriteIndexes,
  ascendSpriteIndexes,
  descendSpriteIndexes
} from "./modules/goose_sprite_coordinates.js";

import {
  determine_direction,
  left_arrow_transform,
  right_arrow_transform,
  down_arrow_transform,
  up_arrow_transform,
  ascendGooseY,
  randomizeStationaryAnimation,
  nextStationarySpriteIndex,
  nextAscendSpriteIndex,
  nextDescendSpriteIndex,
  nextRunningSpriteIndex
} from "./modules/goose_movements.js";

import { style_goose, draw } from "./modules/goose_sprite.js";

(() => {
  "use strict";
  /* eslint-env browser */

  const MOVEMENT_SPEED = 5;
  const JUMP_HEIGHT = 11;
  const UPDATE_INTERVAL = 30;

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

    init_event_listeners();
    _goose = style_goose(_goose);

    resize();
    _goose.x = Math.floor(_bounds.width * 0.3);
    _goose.y = 0;
    setInterval(resize, 200);

    setInterval(() => { update(_bounds, _keyHeld, _DOMObjectsDimensions, _goose); }, UPDATE_INTERVAL);

    _goose = draw(_goose, gooseSpriteCoordinates[0]);
    document.body.appendChild(_goose);
  }

  function init_event_listeners() {
    _keyHeld.fill(false);
    listener_add(document, "keydown", function(e) {
      if(!has_focus(_goose)) { return; }

      let k = get_key(e);
      _keyHeld[k] = true;

      if(k >= 37 && k <= 40) {
        e.preventDefault();
      }
    });

    listener_add(document, "keyup", function(e) {
      if(!has_focus(_goose)) { return; }

      let k = get_key(e);
      _keyHeld[k] = false;

      if(k >= 37 && k <= 40) {
        e.preventDefault();
      }
    });
  }

  function resize() {
    _DOMObjectsDimensions = initDOMObjectsDimensions();
    _bounds = init_bounds();
  }

  function update(bounds, keyHeld, DOMObjectsDimensions, goose) {
    if(step > 1000000)
      step = 0;

    let oldX = goose.x;
    let oldY = goose.y;
    let gooseSpriteFrameCoordinates = gooseSpriteCoordinates[currentSpriteIndex];
    const [ ,, spriteFrameWidth, spriteFrameHeight ] = gooseSpriteFrameCoordinates;

    const gooseAtBottom =  (goose.y + 2 > bounds.height);

    let sitting = gooseAtBottom || collide(
      {
        "top": goose.y - spriteFrameHeight,
        "left": goose.x,
        "width": spriteFrameWidth,
        "height": spriteFrameHeight
      },
      DOMObjectsDimensions,
      MOVEMENT_SPEED
    );

    if(keyHeld[37]) {
      goose.x = left_arrow_transform(goose.x, MOVEMENT_SPEED, spriteFrameWidth, bounds.width);
    } else if(keyHeld[39]) {
      goose.x = right_arrow_transform(goose.x, MOVEMENT_SPEED, spriteFrameWidth, bounds.width);
    }

    if(keyHeld[38] && !ascend.active() && sitting) {
      ascend = up_arrow_transform(ascend, JUMP_HEIGHT);
    } else if(keyHeld[40] || (!ascend.active() && !sitting && !gooseAtBottom)) {
      goose.y = down_arrow_transform(goose.y, MOVEMENT_SPEED);
    }

    let direction = determine_direction(goose.x, oldX);
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

    } else if (stationary) {
      currentSpriteIndex = nextStationarySpriteIndex(stationarySpriteIndexes, step);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);

      [ step, stationaryStep ] = randomizeStationaryAnimation(step, stationaryStep);
      return;

    } else if (descending) {
      currentSpriteIndex = nextDescendSpriteIndex(descendSpriteIndexes[direction], step);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);

      step++;
      return;
    } else {
      // By exclusion, if we have not returned we are running.
      currentSpriteIndex = nextRunningSpriteIndex(runningSpriteIndexes[direction], step);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);

      step++;
      return;
    }
  }

  window.gooseify = gooseify;
})();
