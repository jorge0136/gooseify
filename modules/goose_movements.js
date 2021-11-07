
function determine_direction(x, oldX) {
  return (x > oldX) ? 0 : 1;
}

function handle_x_out_of_bounds(x, spriteFrameW, boundsWidth) {
  if(x < 0) {
    x = 0;
  } else if(x + spriteFrameW > boundsWidth){
    x = boundsWidth - spriteFrameW;
  }
  return x;
}

function left_arrow_transform(x, moveSpeed, spriteFrameW, boundsWidth) {
  return handle_x_out_of_bounds(x - moveSpeed, spriteFrameW, boundsWidth);
}

function right_arrow_transform(x, moveSpeed, spriteFrameW, boundsWidth) {
  return handle_x_out_of_bounds(x + moveSpeed, spriteFrameW, boundsWidth);
}

function down_arrow_transform(y, moveSpeed) { return y + moveSpeed; }

function up_arrow_transform(ascend, jump_height) {
  ascend.height = jump_height;
  ascend.spriteIndex = -1;
  return ascend;
}

function ascendSpriteIndex(ascend_spriteIndex, directionalAscendSpriteCoordinates) {
  console.log(ascend_spriteIndex);
  const directionalAscendAnimationFrameCount = directionalAscendSpriteCoordinates.length;
  console.log(directionalAscendAnimationFrameCount);
  return directionalAscendSpriteCoordinates[ascend_spriteIndex % directionalAscendAnimationFrameCount];
}

function ascendGooseY(goose, ascend_height, bounds_height, spriteFrameH) {
  goose.y = goose.y - ascend_height;
  goose.y = handle_y_out_of_bounds(goose.y, bounds_height, spriteFrameH);
  return goose.y;
}

function handle_y_out_of_bounds(y, boundsHeight, spriteFrameH) {
  if(y + 1 > boundsHeight) {
    y = boundsHeight - 1;
  } else if(y - spriteFrameH < 0) {
    y = spriteFrameH;
  }
  return y;
}

export {
  determine_direction,
  left_arrow_transform,
  right_arrow_transform,
  down_arrow_transform,
  up_arrow_transform,
  ascendGooseY,
  ascendSpriteIndex,
  handle_x_out_of_bounds
};
