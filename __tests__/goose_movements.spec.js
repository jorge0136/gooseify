import {
  determineDirection,
  handleXOutOfBounds,
  randomizeStationaryAnimation,
  ascendGooseY,
  nextAscendSpriteIndex
} from "../modules/goose_movements.js";

describe("determineDirection", () => {

  describe("when oldX is less than x", () => {

    let x = 3;
    let oldX = 2;
    it("returns 0", () => {
      expect(determineDirection(x, oldX)).toBe(0);
    });
  });

  describe("when oldX is greater than x", () => {

    let x = 3;
    let oldX = 4;
    it("returns 1", () => {
      expect(determineDirection(x, oldX)).toBe(1);
    });
  });

  describe("when oldX is equal to x", () => {

    let x = 3;
    let oldX = 3;
    it("returns 1", () => {
      expect(determineDirection(x, oldX)).toBe(1);
    });
  });
});

describe("handleXOutOfBounds", () => {

  describe("when x is less than 0", () => {
    let x = -5000;
    let spriteFrameWidth = 0;
    let boundsWidth = 0;

    it("returns 0", () => {
      expect(handleXOutOfBounds(x, spriteFrameWidth, boundsWidth)).toBe(0);
    });
  });

  describe("when x + spriteFrameWidth is greater than boundsWidth", () => {
    let x = 10;
    let spriteFrameWidth = 3;
    let boundsWidth = 8;

    it("returns x as boundsWidth - spriteFrameWidth;", () => {
      expect(handleXOutOfBounds(x, spriteFrameWidth, boundsWidth)).toBe(boundsWidth - spriteFrameWidth);
    });
  });
});

describe("randomizeStationaryAnimation", () => {

  let step = 10;
  describe("when stationaryStep is zero", () => {
    let stationaryStep = 0;

    let [ step1, stationaryStep1 ] = randomizeStationaryAnimation(step, stationaryStep);
    let [ step2, stationaryStep2 ] = randomizeStationaryAnimation(step, stationaryStep);

    it("returns a different 'step' each time the function is called", () => {
      expect(step1).not.toEqual(step2);
    });

    it("returns a different 'stationaryStep' each time the function is called", () => {
      expect(stationaryStep1).not.toEqual(stationaryStep2);
    });
  });

  describe("when stationaryStep is less than zero", () => {
    let stationaryStep = -1;

    let [ step1, stationaryStep1 ] = randomizeStationaryAnimation(step, stationaryStep);
    let [ step2, stationaryStep2 ] = randomizeStationaryAnimation(step, stationaryStep);

    it("returns a different 'step' each time the function is called", () => {
      expect(step1).not.toEqual(step2);
    });

    it("returns a different 'stationaryStep' each time the function is called", () => {
      expect(stationaryStep1).not.toEqual(stationaryStep2);
    });
  });

  describe("when stationaryStep is greater than zero", () => {
    let stationaryStep = 5;

    it("returns step unaltered as the first return value", () => {
      expect(randomizeStationaryAnimation(step, stationaryStep)[0]).toBe(step);
    });

    it("returns the decrement stationaryStep as the second value", () => {
      expect(randomizeStationaryAnimation(step, stationaryStep)[1]).toBe(stationaryStep - 1);
    });
  });
});

describe("nextAscendSpriteIndex", () => {

  // Represent the indexes of the ascending flight sprites.
  let directionalascendSpriteIndexes = [ 0, 1, 2, 3 ];

  describe("when in the middle of the animation", () => {
    let step = 2;

    it("returns the value at the sprite index inside directionalascendSpriteIndexes", () => {
      expect(nextAscendSpriteIndex(directionalascendSpriteIndexes, step)).toBe(2);
    });
  });

  describe("when at the end of the animation", () => {
    let step = 4;

    it("returns the value at the index representing the start of the animation (0)", () => {
      expect(nextAscendSpriteIndex(directionalascendSpriteIndexes, step)).toBe(0);
    });
  });
});
