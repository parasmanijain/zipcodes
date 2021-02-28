const { handler } = require("./zipcode"); 

describe("basic tests", () => {

  test("handler function exists", () => {

    expect(typeof handler).toBe("function");

  });

});