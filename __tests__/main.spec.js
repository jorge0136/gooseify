const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../example_html/simple.html"), "utf8");

jest
  .dontMock("fs");

describe("gooseify", function() {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterEach(() => {
    // restore the original func after test
    jest.resetModules();
  });

  // TODO: Implement integration specs
  describe.skip("when embedded in example html as a script module", () => {

    it("renders a div with a goose class", function() {
      expect(document.querySelector(".gooseify")).toBeTruthy();
    });
  });
});
