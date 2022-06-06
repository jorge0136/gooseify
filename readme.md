# gooseify.js

> Put a goose on your webpage with simple javascript.

## Installing / Getting started

gooseify.js is a javascript module that can be loaded on most any webpage.

* [See it in action here.](https://jorge0136.github.io/gooseify/index)
* [See how to use gooseify on a webpage here.](/example_html/lisp_quote.html)

### Initial Install

The heart of gooseify is javascript contained in [main.js](/main.js), whose dependencies live in the [/modules](/modules) folder.
Include that javscript in your page and call `gooseify();` onload. An example can be found [here](/example_html/falling.html).

### Animation Configuration

Editable attributes in [main.js](/main.js) include:

* Movement speed
* Jump height
* Animation update interval

CSS effects can be configured within [/modules/goose_sprite.js](/modules/goose_sprite.js):

* Goose image size scaling
* Goose image color filters

### Building & Testing

Yarn is used to manage testing dependencies. The library itself has no dependencies aside from those
contained in [main.js](/main.js), [/modules](/modules).

```shell
  $ yarn install
  $ yarn test
```

## Features

- Animated goose that drops into the webpage on load.
- Different poses while at rest.
- Maneuver over the webpage with the arrow keys.

## Contributing

Issues/ pull requests welcome. Please use included `.eslintrc.js` if submitting a pull request.

## Links

- Inspired by [catify.js](https://github.com/yobert/catify)
- Inspired by [Sonicfan32](https://www.spriters-resource.com/custom_edited/untitledgoosegamecustoms/sheet/121990/).
