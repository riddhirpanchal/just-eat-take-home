import searchReducer, { setSearchQuery, resetSearch } from "./searchSlice";

describe("search slice", () => {
  const initialState = {
    postcode: null,
    area: null,
    status: "idle",
  };

  test("should handle initial state", () => {
    expect(searchReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should handle setSearchQuery", () => {
    const payload = { postcode: "CT12EH", area: "Ramsgate" };
    const actual = searchReducer(initialState, setSearchQuery(payload));
    expect(actual.postcode).toEqual("CT12EH");
    expect(actual.area).toEqual("Ramsgate");
    expect(actual.status).toEqual("searched");
  });

  test("should handle resetSearch", () => {
    const currentState = {
      postcode: "CT12EH",
      area: "Ramsgate",
      status: "searched",
    };
    const actual = searchReducer(currentState, resetSearch());
    expect(actual).toEqual(initialState);
  });
});
