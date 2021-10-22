function document_size () {
  return [
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  ];
}

function window_size () {
  let wx, wy;
  if (window.innerWidth) {
    wx = window.innerWidth;
    wy = window.innerHeight;
  }
  if (!wx && document.documentElement) {
    wx = document.documentElement.clientWidth;
    wy = document.documentElement.clientHeight;
  }
  if (!wx) {
    let body = document.body || document.getElementsByTagName('body')[0];
    if (body) {
      if (body.clientWidth) {
        wx = body.clientWidth;
        wy = body.clientHeight;
      } else if (body.offsetWidth) {
        wx = body.offsetWidth;
        wy = body.offsetHeight;
      }
    }
  }

  return [wx, wy];
}

function window_scroll () {
  let x = 0;
  let y = 0;

  if (self.pageYOffset) {
    x = self.pageXOffset;
    y = self.pageYOffset;
  } else if (document.documentElement && document.documentElement.scrollTop) {
    x = document.documentElement.scrollLeft;
    y = document.documentElement.scrollTop;
  } else if (document.body) {
    x = document.body.scrollLeft;
    y = document.body.scrollTop;
  }

  return [x, y];
}

export { document_size, window_scroll, window_size };
