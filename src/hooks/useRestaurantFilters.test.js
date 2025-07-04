import { renderHook, act } from "@testing-library/react";
import { useRestaurantFilters } from "./useRestaurantFilters";

// --- Mock Data ---
const mockRestaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    isOpenNowForDelivery: true,
    isNew: false,
    deliveryCost: 2.5,
    minimumDeliveryValue: 10,
    driveDistanceMeters: 1500,
    cuisines: [{ uniqueName: "pizza", name: "Pizza" }],
  },
  {
    id: 2,
    name: "Sushi Station",
    isOpenNowForDelivery: false,
    isNew: true,
    deliveryCost: 0,
    minimumDeliveryValue: 20,
    driveDistanceMeters: 3000,
    cuisines: [
      { uniqueName: "sushi", name: "Sushi" },
      { uniqueName: "japanese", name: "Japanese" },
    ],
  },
  {
    id: 3,
    name: "Burger Barn",
    isOpenNowForDelivery: true,
    isNew: true,
    deliveryCost: 5,
    minimumDeliveryValue: 5,
    driveDistanceMeters: 500,
    cuisines: [{ uniqueName: "burgers", name: "Burgers" }],
  },
];

describe("useRestaurantFilters", () => {
  // --- Test 1: Initial State ---
  test("should return all restaurants and default values initially", () => {
    const { result } = renderHook(() => useRestaurantFilters(mockRestaurants));

    expect(result.current.processedRestaurants).toEqual(mockRestaurants);
    expect(result.current.searchValue).toBe("");
    expect(result.current.selectedCuisines).toEqual([]);
    expect(result.current.filterToggles).toEqual({
      openNow: false,
      new: false,
      freeDelivery: false,
    });
    expect(result.current.sortOption).toBe("bestMatch");
  });

  // --- Test 2: Filtering Logic ---
  describe("Filtering", () => {
    test("should filter by search value (name)", () => {
      const { result } = renderHook(() =>
        useRestaurantFilters(mockRestaurants)
      );

      act(() => {
        result.current.setSearchValue("Pizza");
      });

      expect(result.current.processedRestaurants).toHaveLength(1);
      expect(result.current.processedRestaurants[0].name).toBe("Pizza Palace");
    });

    test("should filter by selected cuisines", () => {
      const { result } = renderHook(() =>
        useRestaurantFilters(mockRestaurants)
      );

      act(() => {
        result.current.setSelectedCuisines(["sushi"]);
      });

      expect(result.current.processedRestaurants).toHaveLength(1);
      expect(result.current.processedRestaurants[0].name).toBe("Sushi Station");
    });

    test('should filter by "Open Now" toggle', () => {
      const { result } = renderHook(() =>
        useRestaurantFilters(mockRestaurants)
      );

      act(() => {
        result.current.setFilterToggles({
          ...result.current.filterToggles,
          openNow: true,
        });
      });

      expect(result.current.processedRestaurants).toHaveLength(2);
      expect(
        result.current.processedRestaurants.every((r) => r.isOpenNowForDelivery)
      ).toBe(true);
    });

    test('should filter by "Free Delivery" toggle', () => {
      const { result } = renderHook(() =>
        useRestaurantFilters(mockRestaurants)
      );

      act(() => {
        result.current.setFilterToggles({
          ...result.current.filterToggles,
          freeDelivery: true,
        });
      });

      expect(result.current.processedRestaurants).toHaveLength(1);
      expect(result.current.processedRestaurants[0].name).toBe("Sushi Station");
    });
  });

  // --- Test 3: Sorting Logic ---
  describe("Sorting", () => {
    test("should sort by delivery cost (lowest first)", () => {
      const { result } = renderHook(() =>
        useRestaurantFilters(mockRestaurants)
      );

      act(() => {
        result.current.setSortOption("deliveryCost");
      });

      const names = result.current.processedRestaurants.map((r) => r.name);
      expect(names).toEqual(["Sushi Station", "Pizza Palace", "Burger Barn"]);
    });

    test("should sort by minimum order (lowest first)", () => {
      const { result } = renderHook(() =>
        useRestaurantFilters(mockRestaurants)
      );

      act(() => {
        result.current.setSortOption("minOrder");
      });

      const names = result.current.processedRestaurants.map((r) => r.name);
      expect(names).toEqual(["Burger Barn", "Pizza Palace", "Sushi Station"]);
    });

    test("should sort by distance (closest first)", () => {
      const { result } = renderHook(() =>
        useRestaurantFilters(mockRestaurants)
      );

      act(() => {
        result.current.setSortOption("distance");
      });

      const names = result.current.processedRestaurants.map((r) => r.name);
      expect(names).toEqual(["Burger Barn", "Pizza Palace", "Sushi Station"]);
    });
  });

  // --- Test 4: Combined Filtering and Sorting ---
  test("should apply multiple filters and sorting simultaneously", () => {
    const { result } = renderHook(() => useRestaurantFilters(mockRestaurants));

    // Apply filters: Only show "New" restaurants
    act(() => {
      result.current.setFilterToggles({
        ...result.current.filterToggles,
        new: true,
      });
    });

    act(() => {
      result.current.setSortOption("distance");
    });

    const names = result.current.processedRestaurants.map((r) => r.name);
    expect(names).toEqual(["Burger Barn", "Sushi Station"]);
  });

  test("should return an empty array if allRestaurants is undefined", () => {
    const { result } = renderHook(() => useRestaurantFilters(undefined));
    expect(result.current.processedRestaurants).toEqual([]);
  });
});
