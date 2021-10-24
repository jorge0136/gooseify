
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

  function handle_y_out_of_bounds (y, boundsHeight, spriteFrameH) {
    if(y + 1 > boundsHeight) {
      y = boundsHeight - 1;
    } else if(y - spriteFrameH < 0) {
      y = spriteFrameH;
    }
    return y;
  }

  function down_arrow_transform(y, moveSpeed) { return y + moveSpeed; }

  export {
    determine_direction,
    handle_x_out_of_bounds,
    handle_y_out_of_bounds,
    down_arrow_transform
  };
