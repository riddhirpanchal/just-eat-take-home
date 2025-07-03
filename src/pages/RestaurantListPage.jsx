import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  Container,
  Text,
  Box,
  Loader,
  Alert,
  Button,
  Group,
  Flex,
  Pagination,
  Title as MantineTitle,
  Autocomplete,
  MultiSelect,
  Switch,
  Grid,
  Paper,
  Divider,
} from "@mantine/core";
import { useGetRestaurantsByPostcodeQuery } from "../features/restaurants/restaurantsApi";
import { RestaurantList } from "../features/restaurants/RestaurantList";
import { resetSearch } from "../features/search/searchSlice";

const ITEMS_PER_PAGE = 9;

const PageWrapper = styled(Box)`
  background-color: ${(props) => props.theme.colors.orange[0]};
  min-height: 100vh;
`;

const PageTitle = styled(MantineTitle)`
  span {
    color: ${(props) => props.theme.colors.orange[7]};
  }
`;

const FilterSidebar = styled(Paper)`
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.radius.md};
`;

export function RestaurantListPage() {
  const dispatch = useDispatch();
  const { postcode, area } = useSelector((state) => state.search);

  const [activePage, setActivePage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [filterToggles, setFilterToggles] = useState({
    openNow: false,
    new: false,
    freeDelivery: false,
  });

  const { data, isLoading, isSuccess, isError, error } =
    useGetRestaurantsByPostcodeQuery(postcode, {
      skip: !postcode,
    });

  const allRestaurants = useMemo(() => {
    if (!data) return undefined;
    return Array.isArray(data) ? data : data.restaurants;
  }, [data]);

  const metaData = useMemo(() => {
    if (!data || Array.isArray(data)) return undefined;
    return data.metaData;
  }, [data]);

  const cuisineOptions = useMemo(() => {
    if (!metaData?.cuisineDetails) return [];
    return metaData.cuisineDetails.map((cuisine) => ({
      value: cuisine.uniqueName,
      label: `${cuisine.name} (${cuisine.count})`,
    }));
  }, [metaData]);

  const autocompleteData = useMemo(() => {
    if (!allRestaurants) return [];
    const restaurantNames = allRestaurants.map((r) => r.name);
    const cuisineNames = allRestaurants.flatMap((restaurant) =>
      restaurant.cuisines ? restaurant.cuisines.map((c) => c.name) : []
    );
    const combinedList = [...restaurantNames, ...cuisineNames];
    return [...new Set(combinedList)];
  }, [allRestaurants]);

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

  useEffect(() => {
    setActivePage(1);
  }, [filteredRestaurants]);

  const handleGoBack = () => {
    dispatch(resetSearch());
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.currentTarget;
    setFilterToggles((prev) => ({ ...prev, [name]: checked }));
  };

  let content;
  if (isLoading) {
    content = (
      <Flex justify="center" align="center" mih="50vh">
        <Loader color="orange" type="dots" size="xl" />
      </Flex>
    );
  } else if (isSuccess && allRestaurants) {
    const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    const paginatedRestaurants = filteredRestaurants.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    content = (
      <>
        {paginatedRestaurants.length > 0 ? (
          <RestaurantList restaurants={paginatedRestaurants} />
        ) : (
          <Paper withBorder p="xl" radius="md" style={{ textAlign: "center" }}>
            <Text>No restaurants match your current filters.</Text>
            <Text size="sm" c="dimmed">
              Try adjusting your search.
            </Text>
          </Paper>
        )}
        {totalPages > 1 && (
          <Flex justify="center" mt="xl">
            <Pagination
              total={totalPages}
              value={activePage}
              onChange={setActivePage}
              color="orange"
              radius="xl"
            />
          </Flex>
        )}
      </>
    );
  } else if (isError) {
    content = (
      <Alert color="red" title="Error!">
        {error.data?.message || "Could not fetch restaurants."}
      </Alert>
    );
  }

  return (
    <PageWrapper>
      <Container size="xl" py="xl">
        <Group justify="space-between" align="center" mb="xl">
          <Box>
            <PageTitle order={2}>
              Restaurants near <span>{area || postcode}</span>
            </PageTitle>
            {isSuccess && allRestaurants && (
              <Text c="dimmed">
                Showing {filteredRestaurants.length} of {allRestaurants.length}{" "}
                results
              </Text>
            )}
          </Box>
          <Button variant="outline" color="orange" onClick={handleGoBack}>
            Change Location
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
            <FilterSidebar withBorder>
              <Text fw={700} mb="md">
                Filter Results
              </Text>
              <Divider mb="md" />

              <Autocomplete
                label="Search by name or cuisine"
                placeholder="e.g., Pizza, KFC"
                data={autocompleteData}
                value={searchValue}
                onChange={setSearchValue}
                mb="md"
                clearable
              />

              <MultiSelect
                label="Filter by cuisine category"
                placeholder="Select categories"
                data={cuisineOptions}
                value={selectedCuisines}
                onChange={setSelectedCuisines}
                mb="lg"
                searchable
                clearable
              />

              <Divider label="More options" labelPosition="center" mb="md" />

              <Switch
                label="Open Now"
                name="openNow"
                checked={filterToggles.openNow}
                onChange={handleToggleChange}
                color="orange"
                mb="sm"
              />
              <Switch
                label="New"
                name="new"
                checked={filterToggles.new}
                onChange={handleToggleChange}
                color="orange"
                mb="sm"
              />
              <Switch
                label="Free Delivery"
                name="freeDelivery"
                checked={filterToggles.freeDelivery}
                onChange={handleToggleChange}
                color="orange"
              />
            </FilterSidebar>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>{content}</Grid.Col>
        </Grid>
      </Container>
    </PageWrapper>
  );
}
