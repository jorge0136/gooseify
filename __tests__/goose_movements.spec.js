import {
  determine_direction,
  handle_x_out_of_bounds,
  ascendGooseY,
  ascendSpriteIndex
} from "../modules/goose_movements.js";

describe("determine_direction", () => {

  describe("when oldX is less than x", () => {

    let x = 3;
    let oldX = 2;
    it("returns 0", () => {
      expect(determine_direction(x, oldX)).toBe(0);
    });
  });

  describe("when oldX is greater than x", () => {

    let x = 3;
    let oldX = 4;
    it("returns 1", () => {
      expect(determine_direction(x, oldX)).toBe(1);
    });
  });

  describe("when oldX is equal to x", () => {

    let x = 3;
    let oldX = 3;
    it("returns 1", () => {
      expect(determine_direction(x, oldX)).toBe(1);
    });
  });
});

describe("handle_x_out_of_bounds", () => {

  describe("when x is less than 0", () => {
    let x = -5000;
    let spriteFrameW = 0;
    let boundsWidth = 0;

    it("returns 0", () => {
      expect(handle_x_out_of_bounds(x, spriteFrameW, boundsWidth)).toBe(0);
    });
  });

  describe("when x + spriteFrameW is greater than boundsWidth", () => {
    let x = 10;
    let spriteFrameW = 3;
    let boundsWidth = 8;

    it("returns x as boundsWidth - spriteFrameW;", () => {
      expect(handle_x_out_of_bounds(x, spriteFrameW, boundsWidth)).toBe(boundsWidth - spriteFrameW);
    });
  });
});

describe("ascendSpriteIndex", () => {

  // Represent the indexes of the ascending flight sprites.
  let directionalascendSpriteIndexes = [ 0, 1, 2, 3 ];

  describe("when in the middle of the animation", () => {
    let ascend_spriteIndex = 2;

    it("returns the value at the sprite index inside directionalascendSpriteIndexes", () => {
      expect(ascendSpriteIndex(ascend_spriteIndex, directionalascendSpriteIndexes)).toBe(2);
    });
  });

  describe("when at the end of the animation", () => {
    let ascend_spriteIndex = 4;

    it("returns the value at the index representing the start of the animation (0)", () => {
      expect(ascendSpriteIndex(ascend_spriteIndex, directionalascendSpriteIndexes)).toBe(0);
    });
  });
});
