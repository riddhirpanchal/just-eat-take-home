import { render, screen } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { RestaurantListPage } from "./RestaurantListPage";
import { useGetRestaurantsByPostcodeQuery } from "../features/restaurants/restaurantsApi";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import { useDispatch } from "react-redux";
import { resetSearch } from "../features/search/searchSlice";

const paginatedMockRestaurants = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Restaurant ${i + 1}`,
}));

jest.mock("../features/restaurants/restaurantsApi", () => ({
  ...jest.requireActual("../features/restaurants/restaurantsApi"),
  useGetRestaurantsByPostcodeQuery: jest.fn(),
}));

// Mock the filters hook
jest.mock("../hooks/useRestaurantFilters");

// Mock the react-redux hooks
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

// Mock the child components
jest.mock("../components/RestaurantList", () => ({
  RestaurantList: ({ restaurants }) => (
    <div data-testid="restaurant-list">
      {restaurants.map((r) => (
        <div key={r.id}>{r.name}</div>
      ))}
    </div>
  ),
}));
jest.mock("../components/FilterSidebar", () => ({
  FilterSidebar: () => <div data-testid="filter-sidebar" />,
}));

const mockRestaurantData = {
  restaurants: [{ id: 1, name: "Mock Pizza" }],
};
const initialReduxState = {
  search: { postcode: "SW1A 1AA", area: "Westminster" },
};

describe("RestaurantListPage", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);

    useGetRestaurantsByPostcodeQuery.mockReturnValue({
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
    useRestaurantFilters.mockReturnValue({
      processedRestaurants: [],
    });
  });

  test("displays the restaurant list when data is fetched successfully", () => {
    useGetRestaurantsByPostcodeQuery.mockReturnValue({
      isSuccess: true,
      data: mockRestaurantData,
    });
    useRestaurantFilters.mockReturnValue({
      processedRestaurants: mockRestaurantData.restaurants,
      allRestaurants: mockRestaurantData.restaurants,
    });
    render(<RestaurantListPage />, {
      providerProps: { preloadedState: initialReduxState },
    });
    expect(screen.getByTestId("restaurant-list")).toBeInTheDocument();
    expect(screen.getByText("Mock Pizza")).toBeInTheDocument();
  });

  test("displays a message when no restaurants match filters", () => {
    useGetRestaurantsByPostcodeQuery.mockReturnValue({
      isSuccess: true,
      data: mockRestaurantData,
    });
    useRestaurantFilters.mockReturnValue({
      processedRestaurants: [],
      allRestaurants: mockRestaurantData.restaurants,
    });
    render(<RestaurantListPage />, {
      providerProps: { preloadedState: initialReduxState },
    });
    expect(
      screen.getByText("No restaurants match your current filters.")
    ).toBeInTheDocument();
  });

  test('dispatches resetSearch when "Change Location" is clicked', async () => {
    useGetRestaurantsByPostcodeQuery.mockReturnValue({ isSuccess: true });
    render(<RestaurantListPage />, {
      providerProps: { preloadedState: initialReduxState },
    });

    const changeLocationButton = screen.getByRole("button", {
      name: /change location/i,
    });
    await userEvent.click(changeLocationButton);

    expect(mockDispatch).toHaveBeenCalledWith(resetSearch());
  });

  test("shows pagination when there are more results than items per page", async () => {
    const user = userEvent.setup();
    useGetRestaurantsByPostcodeQuery.mockReturnValue({
      isSuccess: true,
      data: { restaurants: paginatedMockRestaurants },
    });
    useRestaurantFilters.mockReturnValue({
      processedRestaurants: paginatedMockRestaurants,
      allRestaurants: paginatedMockRestaurants,
    });

    render(<RestaurantListPage />, {
      providerProps: { preloadedState: initialReduxState },
    });

    // Check that the first page of restaurants is visible
    expect(screen.getByText("Restaurant 1")).toBeInTheDocument();
    expect(screen.queryByText("Restaurant 10")).not.toBeInTheDocument();

    // Find the pagination button for page 2 and click it
    const pageTwoButton = screen.getByRole("button", { name: "2" });
    await user.click(pageTwoButton);

    // Now, the second page of restaurants should be visible
    expect(screen.getByText("Restaurant 10")).toBeInTheDocument();
    expect(screen.queryByText("Restaurant 1")).not.toBeInTheDocument();
  });

  // Add this test case inside your `describe` block
  test("calls setSortOption when the sort select is changed", async () => {
    const user = userEvent.setup();
    // Create a mock setter for this specific test
    const mockSetSortOption = jest.fn();

    useGetRestaurantsByPostcodeQuery.mockReturnValue({
      isSuccess: true,
      data: mockRestaurantData,
    });
    // Override the mock for useRestaurantFilters to include the mock setter
    useRestaurantFilters.mockReturnValue({
      processedRestaurants: mockRestaurantData.restaurants,
      allRestaurants: mockRestaurantData.restaurants,
      setSortOption: mockSetSortOption, // Use our mock setter
    });

    render(<RestaurantListPage />, {
      providerProps: { preloadedState: initialReduxState },
    });

    // Find the select input by its role and accessible name
    const sortSelect = screen.getByRole("textbox", { name: /sort by/i });
    await user.click(sortSelect);

    // Find and click the "Distance" option in the dropdown
    const distanceOption = await screen.findByText("Distance");
    await user.click(distanceOption);

    // Check that our mock setter was called with the correct value
    expect(mockSetSortOption).toHaveBeenCalledWith("distance");
  });
});
