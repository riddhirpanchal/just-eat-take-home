import { render, screen } from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { RestaurantCard } from "./RestaurantCard";

const fullMockRestaurant = {
  id: 1,
  name: "The Gourmet Place",
  logoUrl: "https://example.com/logo.png",
  rating: {
    count: 123,
    starRating: 4.8,
  },
  cuisines: [
    { uniqueName: "italian", name: "Italian" },
    { uniqueName: "pizza", name: "Pizza" },
    { uniqueName: "mediterranean", name: "Mediterranean" },
    { uniqueName: "pasta", name: "Pasta" },
  ],
  address: {
    firstLine: "123 Foodie Lane",
    postalCode: "FD1 2ST",
  },
  deliveryCost: 2.5,
  deliveryEtaMinutes: {
    rangeLower: 25,
    rangeUpper: 40,
  },
};

const minimalMockRestaurant = {
  id: 2,
  name: "Quick Eats",
  logoUrl: "https://example.com/logo2.png",
  cuisines: [
    { uniqueName: "burgers", name: "Burgers" },
    { uniqueName: "fries", name: "Fries" },
  ],
};

describe("RestaurantCard", () => {
  test("renders all details when restaurant data is complete", () => {
    render(<RestaurantCard restaurant={fullMockRestaurant} />);

    expect(screen.getByText("The Gourmet Place")).toBeInTheDocument();
    expect(
      screen.getByAltText("Logo for The Gourmet Place")
    ).toBeInTheDocument();
    expect(screen.getByText("123 Foodie Lane, FD1 2ST")).toBeInTheDocument();

    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("(123 ratings)")).toBeInTheDocument();

    expect(screen.getByText("25-40 min")).toBeInTheDocument();
    expect(screen.getByText("£2.50")).toBeInTheDocument();
  });

  test("renders correctly when optional data is missing", () => {
    render(<RestaurantCard restaurant={minimalMockRestaurant} />);

    expect(screen.getByText("Quick Eats")).toBeInTheDocument();
    expect(screen.getByAltText("Logo for Quick Eats")).toBeInTheDocument();

    expect(screen.queryByText(/ratings/)).not.toBeInTheDocument();
    expect(screen.queryByText("Address not available")).not.toBeInTheDocument(); // Address group shouldn't render
    expect(screen.queryByText(/min/)).not.toBeInTheDocument();
    expect(screen.queryByText(/£/)).not.toBeInTheDocument();
  });

  test('displays "Free delivery" when deliveryCost is 0', () => {
    const freeDeliveryRestaurant = { ...fullMockRestaurant, deliveryCost: 0 };
    render(<RestaurantCard restaurant={freeDeliveryRestaurant} />);

    expect(screen.getByText("Free delivery")).toBeInTheDocument();
  });

  describe("cuisine badges", () => {
    test('shows a maximum of 3 cuisines and a "+X" badge initially', () => {
      render(<RestaurantCard restaurant={fullMockRestaurant} />);

      expect(screen.getByText("Italian")).toBeInTheDocument();
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Mediterranean")).toBeInTheDocument();

      expect(screen.queryByText("Pasta")).not.toBeInTheDocument();

      expect(screen.getByText("+1")).toBeInTheDocument();
    });

    test('expands to show all cuisines when the "+X" badge is clicked', async () => {
      const user = userEvent.setup();
      render(<RestaurantCard restaurant={fullMockRestaurant} />);

      const showMoreBadge = screen.getByText("+1");
      await user.click(showMoreBadge);

      expect(screen.getByText("Italian")).toBeInTheDocument();
      expect(screen.getByText("Pizza")).toBeInTheDocument();
      expect(screen.getByText("Mediterranean")).toBeInTheDocument();
      expect(screen.getByText("Pasta")).toBeInTheDocument();

      expect(screen.getByText("Show less")).toBeInTheDocument();
      expect(screen.queryByText("+1")).not.toBeInTheDocument();
    });

    test('collapses cuisines when "Show less" is clicked', async () => {
      const user = userEvent.setup();
      render(<RestaurantCard restaurant={fullMockRestaurant} />);

      await user.click(screen.getByText("+1"));

      const showLessBadge = screen.getByText("Show less");
      await user.click(showLessBadge);

      expect(screen.queryByText("Pasta")).not.toBeInTheDocument();
      expect(screen.getByText("+1")).toBeInTheDocument();
      expect(screen.queryByText("Show less")).not.toBeInTheDocument();
    });

    test('does not show a "+X" badge if there are 3 or fewer cuisines', () => {
      const restaurantWithThreeCuisines = {
        ...fullMockRestaurant,
        cuisines: fullMockRestaurant.cuisines.slice(0, 3),
      };
      render(<RestaurantCard restaurant={restaurantWithThreeCuisines} />);

      expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
      expect(screen.queryByText("Show less")).not.toBeInTheDocument();
    });
  });
});
