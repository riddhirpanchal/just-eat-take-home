import { render, screen, fireEvent } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { FilterSidebar } from "./FilterSidebar";

const defaultProps = {
  autocompleteData: ["Pizza", "Sushi", "Burger"],
  cuisineOptions: [
    { value: "italian", label: "Italian" },
    { value: "japanese", label: "Japanese" },
  ],
  searchValue: "",
  setSearchValue: jest.fn(),
  selectedCuisines: [],
  setSelectedCuisines: jest.fn(),
  filterToggles: {
    openNow: false,
    new: false,
    freeDelivery: false,
  },
  setFilterToggles: jest.fn(),
};

describe("FilterSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all inputs and titles", () => {
    render(<FilterSidebar {...defaultProps} />);

    expect(screen.getByText("Filter Results")).toBeInTheDocument();

    expect(
      screen.getByLabelText("Search by name or cuisine", { selector: "input" })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Filter by cuisine category", { selector: "input" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Open Now")).toBeInTheDocument();
    expect(screen.getByLabelText("New")).toBeInTheDocument();
    expect(screen.getByLabelText("Free Delivery")).toBeInTheDocument();
  });

  test("calls setSearchValue when user changes the search field", () => {
    render(<FilterSidebar {...defaultProps} />);

    const searchInput = screen.getByRole("textbox", {
      name: /search by name or cuisine/i,
    });

    fireEvent.change(searchInput, { target: { value: "Pizza" } });

    expect(defaultProps.setSearchValue).toHaveBeenCalledWith("Pizza");
  });

  test("calls setSelectedCuisines when user selects a cuisine", async () => {
    const user = userEvent.setup();
    render(<FilterSidebar {...defaultProps} />);

    const multiSelectInput = screen.getByRole("textbox", {
      name: /filter by cuisine category/i,
    });
    await user.click(multiSelectInput);

    const italianOption = await screen.findByText("Italian");
    await user.click(italianOption);

    expect(defaultProps.setSelectedCuisines).toHaveBeenCalledWith(["italian"]);
  });

  test("calls setFilterToggles with the correct state when a switch is clicked", async () => {
    const user = userEvent.setup();
    render(<FilterSidebar {...defaultProps} />);

    const openNowSwitch = screen.getByLabelText("Open Now");
    await user.click(openNowSwitch);

    expect(defaultProps.setFilterToggles).toHaveBeenCalledTimes(1);

    const updaterFunction = defaultProps.setFilterToggles.mock.calls[0][0];
    const newState = updaterFunction(defaultProps.filterToggles);

    expect(newState).toEqual({
      openNow: true,
      new: false,
      freeDelivery: false,
    });
  });
});
