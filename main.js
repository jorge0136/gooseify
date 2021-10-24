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
  down_arrow_transform
} from "./modules/goose_movements.js";

import { gooseSpriteBase64 } from "./modules/goose_sprite.js";

(function (){
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
  const css_filter = "";

  // To double the size of the rendered image use 'scale(2.0)'
  const css_transform = "scale(1.0)";

  // Global state
  let DOMObjectsDimensions = [];
  let keyHeld = []; // auto set to false when key lifted

  //  TODO: Continue to remove global state and make this more of a functional transform.
  //  Ideally this would become a functional core with an imperative shell.
  let goose;
  let x = 0;
  let y = 0;
  let astep = 0;
  let stillStep = 0;
  let currentSpriteIndex = 0;
  let ascending = false;
  let ascendHeight = 0;
  let ascendState = -1;
  let moveSpeed = 4;
  let direction = 0;
  let boundsWidth;
  let boundsHeight;

  let inited = false;

  function gooseify () {
    if(!document.createRange)
      return; // :'(

    if(!inited) {
      init();
    }

    x = Math.floor(boundsWidth * 0.3);
    y = 0;

    goose = draw(goose, x, y, gooseSpriteCoordinates[0]);
    document.body.appendChild(goose);
  }

  function init () {
    let i;

    initGooseCSS();
    setInterval(resize, 200);
    resize();

    for(i = 0; i < 255; i++) {
      keyHeld[i] = false;
    }

    listener_add(document, "keydown", function (e) {
      if(!has_focus(goose)) { return; }

      let k = get_key(e);
      keyHeld[k] = true;

      if(k >= 37 && k <= 40) {
        e.preventDefault();
      }
    });

    listener_add(document, "keyup", function (e) {
      if(!has_focus(goose)) { return; }

      let k = get_key(e);
      keyHeld[k] = false;

      if(k >= 37 && k <= 40) {
        e.preventDefault();
      }
    });

    setInterval(update, 12);
    inited = true;
  }

  function resize () {

    DOMObjectsDimensions = [];
    all_text_nodes(document.body, function (e) {
      let range = document.createRange();
      range.selectNodeContents(e);
      let rects = range.getClientRects();

      for (const rect of rects) {
        DOMObjectsDimensions.push({
          top: rect.top + window_scroll()[1],
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      }
    });

    let bounds = init_bounds();

    boundsWidth = bounds[0];
    boundsHeight = bounds[1];

  }

  function init_bounds() {
    let bounds = document_size();
    let window_height = window_size()[1];
    if(bounds[1] < window_height) {
      bounds[1] = window_height;
    }
    return bounds;
  }

  function initGooseCSS () {
    goose = document.createElement("div");
    goose.style.position = "absolute";
    goose.style.backgroundImage = "url(\"data:image/png;base64," + gooseSpriteBase64 +"\")";
    goose.style.backgroundRepeat = "no-repeat";
    goose.style.filter = css_filter;
    goose.style.transform = css_transform;
    goose.className = "gooseify";
  }

  // Drawing is manipulated by adjusting the following CSS properties of the base64 encoded PNG:
  // left, top, width, height, background-position
  function draw (goose, x, y, spriteFrameCoordinates) {
    const [ spriteFrameX, spriteFrameY, spriteFrameW, spriteFrameH ] = spriteFrameCoordinates;
    goose.style.top = (y - spriteFrameH) + "px";
    goose.style.left = x + "px";
    goose.style.width = spriteFrameW + "px";
    goose.style.height = spriteFrameH + "px";
    goose.style.backgroundPosition = (-spriteFrameX) + "px " + (-spriteFrameY) + "px";
    return goose;
  }

  function update () {
    if(astep > 1000000)
      astep = 0;

    let oldX = x;
    let oldY = y;
    let gooseSpriteFrameCoordinates = gooseSpriteCoordinates[currentSpriteIndex];
    const [ ,, spriteFrameW, spriteFrameH ] = gooseSpriteFrameCoordinates;

    const gooseAtBottom =  (y + 2 > boundsHeight);

    let sitting = gooseAtBottom || collide(
      {
        "top": y - spriteFrameH,
        "left": x,
        "width": spriteFrameW,
        "height": spriteFrameH
      },
      DOMObjectsDimensions,
      moveSpeed
    );

    if(keyHeld[37]) {
      x = left_arrow_transform(x, moveSpeed);
    } else if(keyHeld[39]) {
      x = right_arrow_transform(x, moveSpeed);
    }
    x = handle_x_out_of_bounds(x, spriteFrameW, boundsWidth);
    if(x != oldX) {
      direction = determine_direction(x, oldX);
    }

    if(keyHeld[38] && !ascending && sitting) {
      up_arrow_transform();
    } else if(keyHeld[40] || (!ascending && !sitting && !gooseAtBottom)) {
      y = down_arrow_transform(y, moveSpeed);
    }

    if(ascending) { ascending_transform(); }
    y = handle_y_out_of_bounds(y, boundsHeight, spriteFrameH);

    let stationary = (x == oldX && y == oldY);
    if(stationary) {
      stationary_transform();
      goose = draw(goose, x, y, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    astep++;

    if(ascending) {
      goose = draw(goose, x, y, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    let descending = !ascending && !sitting;
    if(descending) {
      currentSpriteIndex = descendSpriteCoordinates[direction][astep%2];
      goose = draw(goose, x, y, gooseSpriteCoordinates[currentSpriteIndex]);
      return;
    }

    currentSpriteIndex = runningSpriteCoordinates[direction][Math.floor(astep / 2) % 4];

    goose = draw(goose, x, y, gooseSpriteCoordinates[currentSpriteIndex]);
  }

  function up_arrow_transform() {
    ascending = true;
    ascendHeight = 10;
    ascendState = -1;
  }

  function stationary_transform() {
    if(stillStep <= 0) {
      stillStep = Math.floor(Math.random() * 20) + 20;
      astep = Math.floor(Math.random() * 100000);
    }
    stillStep--;

    currentSpriteIndex = astep % 7;
  }

  function ascending_transform() {
    ascendState++;
    if(ascendState < ascendSpriteCoordinates[direction].length)
      currentSpriteIndex = ascendSpriteCoordinates[direction][ascendState];
    else
      currentSpriteIndex = ascendSpriteCoordinates[direction][ascendSpriteCoordinates[direction].length-1];
    y = y - ascendHeight;

    if(y - gooseSpriteCoordinates[currentSpriteIndex][3] < 0)
      y = gooseSpriteCoordinates[currentSpriteIndex][3];

    ascendHeight--;
    if(ascendHeight == -1)
      ascending = false;
  }

  window.gooseify = gooseify;
})();
