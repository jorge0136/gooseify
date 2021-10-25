import {
  all_text_nodes,
  collide,
  document_size,
  get_key,
  has_focus,
  listener_add,
  window_scroll,
  window_size
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
  handle_x_out_of_bounds,
  handle_y_out_of_bounds,
  left_arrow_transform,
  right_arrow_transform,
  down_arrow_transform,
  up_arrow_transform
} from "./modules/goose_movements.js";

import { gooseSpriteBase64 } from "./modules/goose_sprite.js";

(() => {
  "use strict";
  /* eslint-env browser */

  /**
	 * CSS Filter to be applied to the loaded goose atlas
	 *
	 * Red  (#FF0000): invert(16%) sepia(99%) saturate(7451%) hue-rotate(8deg) brightness(103%) contrast(117%)
	 * Green(#00FF00): invert(52%) sepia(47%) saturate(1999%) hue-rotate(79deg) brightness(115%) contrast(126%)
	 * Blue (#0000FF): invert(8%) sepia(99%) saturate(7376%) hue-rotate(247deg) brightness(99%) contrast(144%)
	 * To generate other filters using HEX @link https://codepen.io/sosuke/pen/Pjoqqp
	 * To generate other filters using rgb() @link https://stackoverflow.com/a/43960991
	 **/
  const CSS_FILTER = "";
  const CSS_TRANSFORM = "scale(1.0)"; // To double the size of the rendered image use 'scale(2.0)'
  const MOVEMENT_SPEED = 3;
  const JUMP_HEIGHT = 11;

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

    init();

    _goose = draw(_goose, gooseSpriteCoordinates[0]);
    document.body.appendChild(_goose);
  }

  function init() {
    _goose = style_goose(_goose);
    setInterval(resize, 200);
    resize();
    setInterval(() => { update(_bounds, _keyHeld, _DOMObjectsDimensions, _goose); }, 25);

    _goose.x = Math.floor(_bounds.width * 0.3);
    _goose.y = 0;

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

    _DOMObjectsDimensions = [];
    all_text_nodes(document.body, function(e) {
      let range = document.createRange();
      range.selectNodeContents(e);
      let rects = range.getClientRects();

      for (const rect of rects) {
        _DOMObjectsDimensions.push({
          top: rect.top + window_scroll()[1],
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    });

    _bounds = init_bounds();
  }

  function init_bounds() {
    let bounds = document_size();
    let window_height = window_size()[1];
    if(bounds[1] < window_height) {
      bounds[1] = window_height;
    }
    return {
      width: bounds[0],
      height: bounds[1]
    };
  }

  function style_goose(goose) {
    goose = document.createElement("div");
    goose.style.position = "absolute";
    goose.style.backgroundImage = "url(\"data:image/png;base64," + gooseSpriteBase64 +"\")";
    goose.style.backgroundRepeat = "no-repeat";
    goose.style.filter = CSS_FILTER;
    goose.style.transform = CSS_TRANSFORM;
    goose.className = "gooseify";
    return goose;
  }

  // Drawing is manipulated by adjusting the following CSS properties of the base64 encoded PNG:
  // left, top, width, height, background-position
  function draw(goose, spriteFrameCoordinates) {
    const [ spriteFrameX, spriteFrameY, spriteFrameWidth, spriteFrameHeight ] = spriteFrameCoordinates;
    goose.style.top = (goose.y - spriteFrameHeight) + "px";
    goose.style.left = goose.x + "px";
    goose.style.width = spriteFrameWidth + "px";
    goose.style.height = spriteFrameHeight + "px";
    goose.style.backgroundPosition = (-spriteFrameX) + "px " + (-spriteFrameY) + "px";
    return goose;
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
      goose.x = left_arrow_transform(goose.x, MOVEMENT_SPEED);
    } else if(keyHeld[39]) {
      goose.x = right_arrow_transform(goose.x, MOVEMENT_SPEED);
    }
    goose.x = handle_x_out_of_bounds(goose.x, spriteFrameWidth, bounds.width);

    if(keyHeld[38] && !ascend.active() && sitting) {
      ascend = up_arrow_transform(ascend, JUMP_HEIGHT);
    } else if(keyHeld[40] || (!ascend.active() && !sitting && !gooseAtBottom)) {
      goose.y = down_arrow_transform(goose.y, MOVEMENT_SPEED);
    }

    let direction = determine_direction(goose.x, oldX);
    if(ascend.active()) {
      goose = ascending_transform(bounds, direction, goose, spriteFrameHeight);
    }

    let stationary = (goose.x == oldX && goose.y == oldY);
    if(stationary) {
      stationary_transform();
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    step++;

    if(ascend.active()) {
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    let descending = !ascend.active() && !sitting;
    if(descending) {
      currentSpriteIndex = descendSpriteCoordinates[direction][step%2];
      goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    currentSpriteIndex = runningSpriteCoordinates[direction][Math.floor(step / 2) % 4];

    _goose = draw(goose, gooseSpriteCoordinates[currentSpriteIndex]);
  }

  function stationary_transform() {
    const stationary_pause_length = 20;

    // Random jumps between the stationary goose frames. Uses stationaryStep as a timer.
    if(stationaryStep <= 0) {
      stationaryStep = Math.floor(Math.random() * stationary_pause_length) + stationary_pause_length;
      step = Math.floor(Math.random() * 100000);
    }
    stationaryStep--;

    currentSpriteIndex = step % stationarySpriteCoordinates.length;
  }

  function ascending_transform(bounds, direction, goose) {
    ascend.spriteIndex++;
    if(ascend.spriteIndex < ascendSpriteCoordinates[direction].length) {
      currentSpriteIndex = ascendSpriteCoordinates[direction][ascend.spriteIndex];
    }
    else {
      currentSpriteIndex = ascendSpriteCoordinates[direction][ascendSpriteCoordinates[direction].length - 1];
    }

    goose.y = goose.y - ascend.height;
    goose.y = handle_y_out_of_bounds(goose.y, bounds.height, gooseSpriteCoordinates[currentSpriteIndex][3]);

    ascend.height--;
    return goose;
  }

  window.gooseify = gooseify;
})();
