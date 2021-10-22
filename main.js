import { document_size, window_scroll, window_size } from './modules/window_utilities.js';
import { gooseSpritePositions, run, ascend, descend } from './modules/goose_sprite_state.js';

(function (){
	"use strict";
	/* eslint-env browser */

	let gooseSpriteBase64 = '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'

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

	function listener_add (el, ev, cb) {
		if (el.addEventListener)
			el.addEventListener(ev, cb, false);
		else
			el.attachEvent('on' + ev, cb);
	}

	function get_key (ev) {
		ev = ev ? ev : this.event;
		return ev.keyCode ? ev.keyCode : ev.which;
	}

	// Global state
	let DOMObjects = [];
	let keyHeld = []; // auto set to false when key lifted

	let goose;
	let x = 100;
	let y = 100;
	let astep = 0;
	let stillStep = 0;
	let gooseSpritePosition = 0;
	let ascending = false;
	let ascendHeight = 0;
	let ascendState = -1;
	let moveSpeed = 4;
	let direction = 0;
	let bounds;

	let focused = true;
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
			if(!has_focus()) { return; }

			let k = get_key(e);
			keyHeld[k] = true;

			if(k >= 37 && k <= 40) {
				e.preventDefault();
			}
		});

		listener_add(document, 'keyup', function (e) {
			if(!has_focus()) { return; }

			let k = get_key(e);
			keyHeld[k] = false;

			if(k >= 37 && k <= 40) {
				e.preventDefault();
			}
		});
	}

	function has_focus () {
		if(!focused || !goose) {
			return false;
		}

		if(document.activeElement &&
			document.activeElement.tagName.match(/^(INPUT|TEXTAREA)$/)) {
			return false;
		}

		return true;
	}

	function update () {
		if(astep > 1000000)
			astep = 0;

		let oldX = x;
		let oldY = y;

		let gooseRect = {
			'top': y - gooseSpritePositions[gooseSpritePosition][3],
			'left': x,
			'width':gooseSpritePositions[gooseSpritePosition][2],
			'height': gooseSpritePositions[gooseSpritePosition][3]
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

		if(x + gooseSpritePositions[gooseSpritePosition][2] > bounds[0])
			x = bounds[0] - gooseSpritePositions[gooseSpritePosition][2];

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
			if(ascendState < ascend[direction].length)
				gooseSpritePosition = ascend[direction][ascendState];
			else
				gooseSpritePosition = ascend[direction][ascend[direction].length-1];
			y = y - ascendHeight;

			if(y - gooseSpritePositions[gooseSpritePosition][3] < 0)
				y = gooseSpritePositions[gooseSpritePosition][3];

			ascendHeight--;
			if(ascendHeight == -1)
				ascending = false;
		}

		if(y + 1 > bounds[1]) {
			y = bounds[1] - 1;
		}

		if(y - gooseSpritePositions[gooseSpritePosition][3] < 0) {
			y = gooseSpritePositions[gooseSpritePosition][3];
		}

		let stationary = x == oldX && y == oldY
		let descending = !ascending && !sitting

		if(stationary) {
			if(stillStep <= 0) {
				stillStep = Math.floor(Math.random() * 20) + 20;
				astep = Math.floor(Math.random() * 100000);
			}
			stillStep--;

			gooseSpritePosition = astep % 7;
			draw();
			return;
		}

		astep++;

		if(ascending) {
			draw();
			return;
		}

		if(descending) {
			gooseSpritePosition = descend[direction][astep%2];
			draw();
			return;
		}

		gooseSpritePosition = run[direction][Math.floor(astep / 2) % 4];

		draw();
	}

	// Drawing is manipulated by adjusting the following CSS properties of the base64 encoded PNG.
	// left, top, width, height, background-position
	function draw () {
		background(goose, gooseSpritePositions[gooseSpritePosition]);
		goose.style.left = x+'px';
		goose.style.top = (y - gooseSpritePositions[gooseSpritePosition][3])+'px';
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
