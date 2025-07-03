import { SimpleGrid } from "@mantine/core";
import { RestaurantCard } from "./RestaurantCard";

export function RestaurantList({ restaurants }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </SimpleGrid>
  );
}
