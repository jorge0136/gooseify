import {
  document_size,
  window_scroll,
  window_size,
  get_key,
  listener_add,
  has_focus
} from './modules/browser_utilities.js';

import {
  gooseSpriteCoordinates,
  runningSpriteCoordinates,
  ascendSpriteCoordinates,
  descendSpriteCoordinates
} from './modules/goose_sprite_coordinates.js';

import { gooseSpriteBase64 } from './modules/goose_sprite.js';

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
	let css_filter = '';

	// Global state
	let DOMObjects = [];
	let keyHeld = []; // auto set to false when key lifted

	let goose;
	let x = 100;
	let y = 100;
	let astep = 0;
	let stillStep = 0;
	let currentSpritePosition = 0;
	let ascending = false;
	let ascendHeight = 0;
	let ascendState = -1;
	let moveSpeed = 4;
	let direction = 0;
	let bounds;

	let inited = false;

	function gooseify () {
		if(!document.createRange)
			return; // :'(

		if(!inited) {
			init();
		}

		goose = document.createElement('div');
		goose.style.position = 'absolute';
		goose.style.backgroundImage = 'url("data:image/png;base64,' + gooseSpriteBase64 +'")';
		goose.style.backgroundRepeat = 'no-repeat';
		goose.style.filter = css_filter;
		goose.className = 'gooseify';

		x = Math.floor(bounds[0] * 0.3);
		y = 0;

		draw();
		document.body.appendChild(goose);

		if(!inited) {
			setInterval(update, 12);
			inited = true;
		}
	}

	function init () {
		let i;

		setInterval(resize, 200);
		resize();

		for(i = 0; i < 255; i++) {
			keyHeld[i] = false;
		}

		listener_add(document, 'keydown', function (e) {
			if(!has_focus(goose)) { return; }

			let k = get_key(e);
			keyHeld[k] = true;

			if(k >= 37 && k <= 40) {
				e.preventDefault();
			}
		});

		listener_add(document, 'keyup', function (e) {
			if(!has_focus(goose)) { return; }

			let k = get_key(e);
			keyHeld[k] = false;

			if(k >= 37 && k <= 40) {
				e.preventDefault();
			}
		});
	}

	function update () {
		if(astep > 1000000)
			astep = 0;

		let oldX = x;
		let oldY = y;

		let gooseRect = {
			'top': y - gooseSpriteCoordinates[currentSpritePosition][3],
			'left': x,
			'width':gooseSpriteCoordinates[currentSpritePosition][2],
			'height': gooseSpriteCoordinates[currentSpritePosition][3]
		};
		let sitting = collide(gooseRect, DOMObjects);
		let cantDescend = false;

		if(y + 2 > bounds[1]) {
			sitting = true;
			cantDescend = true;
		}

		if(keyHeld[37]) { x = x - moveSpeed; } // left arrow: 37
		if(keyHeld[39]) { x = x + moveSpeed; } // right arrow: 39
		if(x < 0) { x = 0; }

		if(x + gooseSpriteCoordinates[currentSpritePosition][2] > bounds[0])
			x = bounds[0] - gooseSpriteCoordinates[currentSpritePosition][2];

		// up arrow: 38
		if(keyHeld[38] && !ascending && sitting) {
			ascending = true;
			ascendHeight = 10;
			ascendState = -1;
		}

		// down arrow: 40
		if(keyHeld[40] || (!ascending && !sitting && !cantDescend)) { y = y + moveSpeed;}

		if(x != oldX) { direction = (x > oldX) ? 0 : 1; }

		if(ascending) {
			ascendState++;
			if(ascendState < ascendSpriteCoordinates[direction].length)
				currentSpritePosition = ascendSpriteCoordinates[direction][ascendState];
			else
				currentSpritePosition = ascendSpriteCoordinates[direction][ascendSpriteCoordinates[direction].length-1];
			y = y - ascendHeight;

			if(y - gooseSpriteCoordinates[currentSpritePosition][3] < 0)
				y = gooseSpriteCoordinates[currentSpritePosition][3];

			ascendHeight--;
			if(ascendHeight == -1)
				ascending = false;
		}

		if(y + 1 > bounds[1]) {
			y = bounds[1] - 1;
		}

		if(y - gooseSpriteCoordinates[currentSpritePosition][3] < 0) {
			y = gooseSpriteCoordinates[currentSpritePosition][3];
		}

		let stationary = x == oldX && y == oldY
		let descending = !ascending && !sitting

		if(stationary) {
			if(stillStep <= 0) {
				stillStep = Math.floor(Math.random() * 20) + 20;
				astep = Math.floor(Math.random() * 100000);
			}
			stillStep--;

			currentSpritePosition = astep % 7;
			draw();
			return;
		}

		astep++;

		if(ascending) {
			draw();
			return;
		}

		if(descending) {
			currentSpritePosition = descendSpriteCoordinates[direction][astep%2];
			draw();
			return;
		}

		currentSpritePosition = runningSpriteCoordinates[direction][Math.floor(astep / 2) % 4];

		draw();
	}

	// Drawing is manipulated by adjusting the following CSS properties of the base64 encoded PNG.
	// left, top, width, height, background-position
	function draw () {
		background(goose, gooseSpriteCoordinates[currentSpritePosition]);
		goose.style.left = x+'px';
		goose.style.top = (y - gooseSpriteCoordinates[currentSpritePosition][3])+'px';
	}

	function background (goose, gooseSpriteState) {
		goose.style.width = gooseSpriteState[2]+'px';
		goose.style.height = gooseSpriteState[3]+'px';
		goose.style.backgroundPosition = (-gooseSpriteState[0]) + 'px ' + (-gooseSpriteState[1]) + 'px';
	}

	function collide (o, list) {
		let i, l;
		for(i = 0; i < list.length; i++) {
			l = list[i];
			if(o.top + o.height < l.top)
				continue;
			if(o.top + o.height > l.top + moveSpeed)
				continue;
			if(l.left > o.left + o.width)
				continue;
			if(l.left + l.width < o.left)
				continue;
			return true;
		}
		return false;
	}

	function resize () {
		let body = document.body;

		DOMObjects = [];

		let scr = window_scroll();

		all_text_nodes(body, function (e) {
			let range = document.createRange();
			range.selectNodeContents(e);
			let rects = range.getClientRects();
			let dimensions;
			for(let i = 0; i < rects.length; i++) {
				dimensions = {
					top: rects[i].top + scr[1],
					left: rects[i].left,
					width: rects[i].width,
					height: rects[i].height
				};
				DOMObjects.push(dimensions);
			}
		});

		bounds = document_size();
		let w = window_size();
		if(bounds[1] < w[1])
			bounds[1] = w[1];
	}

	function all_text_nodes (element, cb) {
		if(element.childNodes.length > 0)
			for(let i = 0; i < element.childNodes.length; i++)
				all_text_nodes(element.childNodes[i], cb);

		if(element.nodeType == Node.TEXT_NODE && /\S/.test(element.nodeValue))
			cb(element);
	}

	window.gooseify = gooseify;
})();
