import { render, screen, fireEvent } from "../utils/test-utils";
import { HomePage } from "./HomePage";
import { AUTOCOMPLETE_DATA } from "../constants/locations";

describe("HomePage", () => {
  test("renders the main title and subtitle", () => {
    render(<HomePage />);
    expect(screen.getByText("Order food and more")).toBeInTheDocument();
    expect(
      screen.getByText("Restaurants delivering near you")
    ).toBeInTheDocument();
  });

  test("enables the search button only when a valid location is selected", () => {
    render(<HomePage />);
    const searchButton = screen.getByRole("button", { name: /search/i });
    expect(searchButton).toBeDisabled();

    const autocomplete = screen.getByPlaceholderText(
      /enter your area or postcode/i
    );
    fireEvent.change(autocomplete, { target: { value: AUTOCOMPLETE_DATA[0] } });

    expect(searchButton).toBeEnabled();
  });
});
