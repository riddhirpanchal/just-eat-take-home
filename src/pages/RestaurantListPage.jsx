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
  Grid,
  Paper,
  Select,
} from "@mantine/core";
import { IconServerOff } from "@tabler/icons-react";
import { useGetRestaurantsByPostcodeQuery } from "../features/restaurants/restaurantsApi";
import { RestaurantList } from "../components/RestaurantList";
import { resetSearch } from "../features/search/searchSlice";
import { useRestaurantFilters } from "../hooks/useRestaurantFilters";
import { FilterSidebar } from "../components/FilterSidebar";

const ITEMS_PER_PAGE = 9;

// --- Styled Components ---
const PageWrapper = styled(Box)`
  background-color: ${(props) => props.theme.colors.orange[0]};
  min-height: 100vh;
`;
const PageTitle = styled(MantineTitle)`
  span {
    color: ${(props) => props.theme.colors.orange[7]};
  }
`;

// UX Improvement: A dedicated styled component for the results header
const ResultsHeader = styled(Group)`
  background-color: white;
  padding: ${(props) => props.theme.spacing.sm}
    ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.radius.md};
  border: 1px solid ${(props) => props.theme.colors.gray[2]};
`;

// --- Component Implementation ---
export function RestaurantListPage() {
  const dispatch = useDispatch();
  const { postcode, area } = useSelector((state) => state.search);
  const [activePage, setActivePage] = useState(1);

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

  const {
    processedRestaurants,
    searchValue,
    setSearchValue,
    selectedCuisines,
    setSelectedCuisines,
    filterToggles,
    setFilterToggles,
    sortOption,
    setSortOption,
  } = useRestaurantFilters(allRestaurants);

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

  useEffect(() => {
    setActivePage(1);
  }, [processedRestaurants]);

  const handleGoBack = () => {
    dispatch(resetSearch());
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return (
        <Flex justify="center" align="center" mih="50vh">
          <Loader color="orange" type="dots" size="xl" />
        </Flex>
      );
    }

    if (isError) {
      let errorTitle = "Request Failed";
      let errorMessage =
        "An unexpected error occurred. Please try again later.";
      if (error) {
        if ("status" in error) {
          if (error.status === 404) {
            errorTitle = "Postcode Not Found";
            errorMessage = `We couldn't find any results for the postcode "${postcode}". Please check that it's correct and try again.`;
          } else if (error.status >= 500) {
            errorTitle = "Server Error";
            errorMessage =
              "There seems to be a temporary problem with our service. Please try again in a few moments.";
          } else if (error.status === "CUSTOM_ERROR") {
            errorTitle = "Network Error";
            errorMessage = error.error;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      return (
        <Alert
          icon={<IconServerOff size="1.5rem" />}
          title={errorTitle}
          color="red"
          variant="light"
          radius="md"
        >
          {errorMessage}
        </Alert>
      );
    }

    if (isSuccess && allRestaurants) {
      const totalPages = Math.ceil(
        processedRestaurants.length / ITEMS_PER_PAGE
      );
      const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
      const paginatedRestaurants = processedRestaurants.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
      );

      return (
        <>
          {paginatedRestaurants.length > 0 ? (
            <RestaurantList restaurants={paginatedRestaurants} />
          ) : (
            <Paper
              withBorder
              p="xl"
              radius="md"
              style={{ textAlign: "center" }}
            >
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
    }
    return null;
  };

  return (
    <PageWrapper>
      <Container size="xl" py="xl">
        <Group justify="space-between" align="center" mb="xl">
          <Box>
            <PageTitle order={2}>
              Restaurants near <span>{area || postcode}</span>
            </PageTitle>
          </Box>
          <Button variant="outline" color="orange" onClick={handleGoBack}>
            Change Location
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
            <FilterSidebar
              autocompleteData={autocompleteData}
              cuisineOptions={cuisineOptions}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              selectedCuisines={selectedCuisines}
              setSelectedCuisines={setSelectedCuisines}
              filterToggles={filterToggles}
              setFilterToggles={setFilterToggles}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8, lg: 9 }}>
            {/* UX Improvement: The header is always rendered to prevent layout shift */}
            <ResultsHeader justify="space-between" align="center" mb="md">
              <Text c="dimmed">
                {isSuccess && allRestaurants
                  ? `Showing ${processedRestaurants.length} of ${allRestaurants.length} results`
                  : "Loading results..."}
              </Text>
              <Select
                label="Sort by"
                value={sortOption}
                onChange={(value) => setSortOption(value || "bestMatch")}
                data={[
                  { value: "bestMatch", label: "Best Match" },
                  { value: "distance", label: "Distance" },
                  { value: "deliveryCost", label: "Delivery Cost" },
                  { value: "minOrder", label: "Minimum Order" },
                ]}
                style={{ width: 200 }}
                allowDeselect={false}
              />
            </ResultsHeader>
            {renderContent()}
          </Grid.Col>
        </Grid>
      </Container>
    </PageWrapper>
  );
}
