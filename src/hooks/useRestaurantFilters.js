import { useState, useMemo } from "react";

export function useRestaurantFilters(allRestaurants) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [filterToggles, setFilterToggles] = useState({
    openNow: false,
    new: false,
    freeDelivery: false,
  });

  const filteredRestaurants = useMemo(() => {
    if (!allRestaurants) return [];

    let restaurants = [...allRestaurants];

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

    return restaurants;
  }, [allRestaurants, searchValue, selectedCuisines, filterToggles]);

  return {
    filteredRestaurants,
    searchValue,
    setSearchValue,
    selectedCuisines,
    setSelectedCuisines,
    filterToggles,
    setFilterToggles,
  };
}
