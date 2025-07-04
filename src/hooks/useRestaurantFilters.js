import { useState, useMemo } from "react";

export function useRestaurantFilters(allRestaurants) {
  // --- State Management for Filters & Sorting ---
  const [searchValue, setSearchValue] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [filterToggles, setFilterToggles] = useState({
    openNow: false,
    new: false,
    freeDelivery: false,
  });
  // 1. Add state for the current sort option
  const [sortOption, setSortOption] = useState("bestMatch");

  // --- Combined Filtering & Sorting Logic ---
  const processedRestaurants = useMemo(() => {
    if (!allRestaurants) return [];

    // --- Filtering ---
    let restaurants = [...allRestaurants];
    // ... (filtering logic remains the same) ...
    if (filterToggles.openNow) {
      restaurants = restaurants.filter((r) => r.isOpenNowForDelivery);
    }
    if (filterToggles.new) {
      restaurants = restaurants.filter((r) => r.isNew);
    }
    if (filterToggles.freeDelivery) {
      restaurants = restaurants.filter((r) => r.deliveryCost === 0);
    }
    if (selectedCuisines.length > 0) {
      restaurants = restaurants.filter((r) =>
        r.cuisines?.some((c) => selectedCuisines.includes(c.uniqueName))
      );
    }
    const lowercasedSearchValue = searchValue.toLowerCase();
    if (lowercasedSearchValue) {
      restaurants = restaurants.filter(
        (r) =>
          r.name?.toLowerCase().includes(lowercasedSearchValue) ||
          r.cuisines?.some((c) =>
            c.name?.toLowerCase().includes(lowercasedSearchValue)
          )
      );
    }

    // --- Sorting ---
    // 2. Apply sorting logic after all filters have been applied
    switch (sortOption) {
      case "deliveryCost":
        restaurants.sort((a, b) => a.deliveryCost - b.deliveryCost);
        break;
      case "minOrder":
        restaurants.sort(
          (a, b) => a.minimumDeliveryValue - b.minimumDeliveryValue
        );
        break;
      case "distance":
        restaurants.sort(
          (a, b) => a.driveDistanceMeters - b.driveDistanceMeters
        );
        break;
      case "bestMatch":
      default:
        // No sorting needed, use the default order from the API
        break;
    }

    return restaurants;
  }, [
    allRestaurants,
    searchValue,
    selectedCuisines,
    filterToggles,
    sortOption,
  ]);

  // 3. Return the sorted list and the new state setters
  return {
    processedRestaurants, // Renamed for clarity
    searchValue,
    setSearchValue,
    selectedCuisines,
    setSelectedCuisines,
    filterToggles,
    setFilterToggles,
    sortOption,
    setSortOption,
  };
}
