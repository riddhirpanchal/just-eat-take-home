import { render, screen } from "./utils/test-utils";
import App from "./App";

describe("App", () => {
  test("renders HomePage by default", () => {
    render(<App />, {
      providerProps: { preloadedState: { search: { status: "idle" } } },
    });
    expect(screen.getByText("Order food and more")).toBeInTheDocument();
  });

  test('renders RestaurantListPage when search status is "searched"', () => {
    const preloadedState = {
      search: {
        status: "searched",
        postcode: "SW1A1AA",
        area: "London (Westminster)",
      },
    };
    render(<App />, { providerProps: { preloadedState } });
    expect(screen.getByText(/Restaurants near/i)).toBeInTheDocument();
  });
});
