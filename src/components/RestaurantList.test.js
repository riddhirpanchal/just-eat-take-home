import { render, screen } from "../utils/test-utils";
import { RestaurantList } from "./RestaurantList";
import { RestaurantCard } from "./RestaurantCard";

jest.mock("./RestaurantCard", () => ({
  RestaurantCard: jest.fn(({ restaurant }) => (
    <article data-testid={`restaurant-${restaurant.id}`}>
      {restaurant.name}
    </article>
  )),
}));

const mockRestaurants = [
  { id: 1, name: "Pizza Palace" },
  { id: 2, name: "Sushi Station" },
  { id: 3, name: "Burger Barn" },
];

describe("RestaurantList", () => {
  beforeEach(() => {
    RestaurantCard.mockClear();
  });

  test("renders the correct number of restaurant cards", () => {
    render(<RestaurantList restaurants={mockRestaurants} />);

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(mockRestaurants.length);

    expect(RestaurantCard).toHaveBeenCalledTimes(mockRestaurants.length);
  });

  test("passes the correct restaurant data to each RestaurantCard", () => {
    render(<RestaurantList restaurants={mockRestaurants} />);

    expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
    expect(screen.getByText("Sushi Station")).toBeInTheDocument();
    expect(screen.getByText("Burger Barn")).toBeInTheDocument();

    expect(RestaurantCard.mock.calls[0][0].restaurant).toEqual(
      mockRestaurants[0]
    );
    expect(RestaurantCard.mock.calls[1][0].restaurant).toEqual(
      mockRestaurants[1]
    );
    expect(RestaurantCard.mock.calls[2][0].restaurant).toEqual(
      mockRestaurants[2]
    );
  });

  test("renders nothing when the restaurants list is empty", () => {
    render(<RestaurantList restaurants={[]} />);

    const cards = screen.queryAllByRole("article");
    expect(cards).toHaveLength(0);

    expect(RestaurantCard).not.toHaveBeenCalled();
  });
});
