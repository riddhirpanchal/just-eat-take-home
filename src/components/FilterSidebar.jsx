import styled from "styled-components";
import {
  Autocomplete,
  MultiSelect,
  Switch,
  Paper,
  Text,
  Divider,
} from "@mantine/core";

const FilterSidebarWrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.radius.md};
`;

export function FilterSidebar({
  autocompleteData,
  cuisineOptions,
  searchValue,
  setSearchValue,
  selectedCuisines,
  setSelectedCuisines,
  filterToggles,
  setFilterToggles,
}) {
  const handleToggleChange = (e) => {
    const { name, checked } = e.currentTarget;
    setFilterToggles((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <FilterSidebarWrapper withBorder>
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
    </FilterSidebarWrapper>
  );
}
