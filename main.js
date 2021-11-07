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
  stationarySpriteCoordinates,
  runningSpriteCoordinates,
  ascendSpriteCoordinates,
  descendSpriteCoordinates
} from "./modules/goose_sprite_coordinates.js";

import {
  determine_direction,
  left_arrow_transform,
  right_arrow_transform,
  down_arrow_transform,
  up_arrow_transform,
  ascendGooseY,
  ascendSpriteIndex
} from "./modules/goose_movements.js";

import { style_goose, draw } from "./modules/goose_sprite.js";

(() => {
  "use strict";
  /* eslint-env browser */

  const MOVEMENT_SPEED = 3;
  const JUMP_HEIGHT = 11;
  const UPDATE_INTERVAL = 20;

  //  TODO: Continue to remove global state and make this more of a functional transform.
  //  Ideally this would become a functional core with an imperative shell.
  let _goose = {
    x: 0,
    y: 0,
  };
  let currentSpriteIndex = 0;
  let step = 0;
  let stationaryStep = 0;
  let ascend = {
    height: 0,
    spriteIndex: -1,
    active: function() {
      return this.height > -1;
    }
  };

  let _bounds = {
    height: 0,
    width: 0
  };
  let _keyHeld = [];
  let _DOMObjectsDimensions = [];

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
    if(ascend.active()) {
      goose = ascendingTransform(bounds, direction, goose, spriteFrameHeight);
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    let stationary = (goose.x == oldX && goose.y == oldY);
    if(stationary) {
      stationaryTransform();
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    step++;

    let descending = !ascend.active() && !sitting;
    if(descending) {
      currentSpriteIndex = descendSpriteCoordinates[direction][step%2];
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    currentSpriteIndex = runningTransform(runningSpriteCoordinates[direction], step);
    goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
  }

  function runningTransform(directionalRunningSpriteCoordinates, step) {
    // TODO: Why is -1 required for animation to come out right? Does this indicate an off by one
    // error in the coordinate mapping?
    const runningAnimationFrameLength = directionalRunningSpriteCoordinates.length - 1;
    return directionalRunningSpriteCoordinates[Math.floor(step / 2) % runningAnimationFrameLength];
  }

  function stationaryTransform() {
    const stationary_pause_length = 20;

    // Random jumps between the stationary goose frames. Uses stationaryStep as a timer.
    if(stationaryStep <= 0) {
      stationaryStep = Math.floor(Math.random() * stationary_pause_length) + stationary_pause_length;
      step = Math.floor(Math.random() * 100000);
    }
    stationaryStep--;

    currentSpriteIndex = step % stationarySpriteCoordinates.length;
  }

  function ascendingTransform(bounds, direction, goose) {
    ascend.spriteIndex++;
    currentSpriteIndex = ascendSpriteIndex(ascend.spriteIndex, ascendSpriteCoordinates[direction]);
    goose.y = ascendGooseY(goose, ascend.height, bounds.height, gooseSpriteCoordinates[currentSpriteIndex][3]);
    ascend.height--;
    return goose;
  }

  window.gooseify = gooseify;
})();
