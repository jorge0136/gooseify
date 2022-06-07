# gooseify.js

> Put a goose on your webpage with simple javascript.

## Getting Started

gooseify.js is a simple javascript module that can be loaded on any webpage with enough text for the
goose to stand on.

* [See it in action here.](https://jorge0136.github.io/gooseify/index)
* [See how to use gooseify on a webpage here.](/example_html/lisp_quote.html)

The heart of gooseify is javascript contained in [main.js](/main.js), whose dependencies live in the [/modules](/modules) folder.
Include that javscript in your page and call `gooseify();` onload. An example can be found [here](/example_html/lisp_quote.html).

Note you only need yarn to do any building if you are developing gooseify.

## Features

- Animated goose that drops into the webpage on load.
- Control goose with arrow keys.
- Different poses while at rest.
- Maneuver over the webpage with the arrow keys.
- Configurable CSS transforms provides a goose of any color or style you please.

## Animation Configuration

Editable animation attributes in [main.js](/main.js) include:

* Movement speed
* Jump height
* Animation update interval

Editable CSS effects configurable within [/modules/goose_sprite.js](/modules/goose_sprite.js):

* Goose image size scaling
* Goose image color / CSS filters

## Building & Testing

Yarn is used to manage testing dependencies. The library itself has no dependencies aside from those
contained in [main.js](/main.js), [/modules](/modules).

```shell
  $ yarn install
  $ yarn test
```

## Contributing

Issues/ pull requests welcome. Please use included `.eslintrc.js` if submitting a pull request.

## Links

- Inspired by [catify.js](https://github.com/yobert/catify)
- Inspired by [Sonicfan32](https://www.spriters-resource.com/custom_edited/untitledgoosegamecustoms/sheet/121990/).
