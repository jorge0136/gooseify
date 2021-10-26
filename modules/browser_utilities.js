function all_text_nodes(element, cb) {
  if(element.childNodes.length > 0)
    for(let i = 0; i < element.childNodes.length; i++)
      all_text_nodes(element.childNodes[i], cb);

  if(element.nodeType == Node.TEXT_NODE && /\S/.test(element.nodeValue))
    cb(element);
}

function collide(gooseRect, DOMObjectsDimensions, moveSpeed) {
  for (const DOMObjectDimensions of DOMObjectsDimensions) {
    if(gooseRect.top + gooseRect.height < DOMObjectDimensions.top)
      continue;
    if(gooseRect.top + gooseRect.height > DOMObjectDimensions.top + moveSpeed)
      continue;
    if(DOMObjectDimensions.left > gooseRect.left + gooseRect.width)
      continue;
    if(DOMObjectDimensions.left + DOMObjectDimensions.width < gooseRect.left)
      continue;
    return true;
  }
  return false;
}

function document_size() {
  return [
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  ];
}

function get_key(ev) {
  ev = ev ? ev : this.event;
  return ev.keyCode ? ev.keyCode : ev.which;
}

// TODO: There is a bug where if one presses a key and changes the focus out of the browser
// the key is stickied "down". Meaning we get caught in a loop of key presses.
function has_focus(goose) {
  if (!document.hasFocus() || !goose) {
    return false;
  } else {
    return true;
  }
}

function listener_add(el, ev, cb) {
  if (el.addEventListener)
    el.addEventListener(ev, cb, false);
  else
    el.attachEvent("on" + ev, cb);
}

function initDOMObjectsDimensions() {
  let DOMObjectsDimensions = [];
  all_text_nodes(document.body, function(e) {
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
  return DOMObjectsDimensions;
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

function window_scroll() {
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

function window_size() {
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
    let body = document.body || document.getElementsByTagName("body")[0];
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

export {
  collide,
  get_key,
  has_focus,
  init_bounds,
  initDOMObjectsDimensions,
  listener_add
};
