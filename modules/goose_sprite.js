// Animation is a PNG sprite sheet encoded in a base64 string.
const gooseSpriteBase64 = "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";

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

// Drawing is manipulated by adjusting CSS properties of the base64 encoded PNG:
function draw(goose, spriteFrameCoordinates) {
  const [ spriteFrameX, spriteFrameY, spriteFrameWidth, spriteFrameHeight ] = spriteFrameCoordinates;
  goose.style.top = (goose.y - spriteFrameHeight) + "px";
  goose.style.left = goose.x + "px";
  goose.style.width = spriteFrameWidth + "px";
  goose.style.height = spriteFrameHeight + "px";
  goose.style.backgroundPosition = (-spriteFrameX) + "px " + (-spriteFrameY) + "px";
  return goose;
}

export { style_goose, draw };
