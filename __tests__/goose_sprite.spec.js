import { styleGoose } from "../modules/goose_sprite.js";

describe("styleGoose()", () => {

  let goose = {};
  let styln_goose = styleGoose(goose);

  it("sets the position as 'absolute'", () => {
    expect(styln_goose.style.position).toBe("absolute");
  });

  it("returns a 'gooseify' class", () => {
    expect(styln_goose.className).toBe("gooseify");
  });

  it("sets backgroundRepeat as 'no-repeat'", () => {
    expect(styln_goose.style.backgroundRepeat).toBe("no-repeat");
  });
});
