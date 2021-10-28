import { style_goose } from "../modules/goose_sprite.js";

describe("style_goose()", () => {
  it("returns a goose", () => {
    expect(style_goose()).toBe(3);
  });
});
