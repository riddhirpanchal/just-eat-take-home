import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  Box,
  Container,
  Title as MantineTitle,
  Text,
  Autocomplete,
  Button,
  Grid,
  Image,
  Flex,
} from "@mantine/core";
import { setSearchQuery } from "../features/search/searchSlice";
import heroImageUrl from "../assets/food_bg.png";
import { LOCATIONS, AUTOCOMPLETE_DATA } from "../constants/locations";

const PageWrapper = styled(Box)`
  background: white;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const GradientOverlay = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.orange[5]} 0%,
    ${(props) => props.theme.colors.orange[7]} 100%
  );
  clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
`;

const HeroContainer = styled(Container)`
  height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled(MantineTitle)`
  color: ${(props) => props.theme.colors.dark[8]};
  font-size: 3.5rem;
  line-height: 1.1;
  font-weight: 800;
`;

const SearchInput = styled(Autocomplete)`
  input {
    border: 1px solid #ccc;
    &:focus-within {
      border-color: ${(props) => props.theme.colors.orange[7]};
    }
  }
`;

export function HomePage() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    const selectedLocation = LOCATIONS.find(
      (loc) => `${loc.area} - ${loc.postcode}` === value
    );

    if (selectedLocation) {
      dispatch(
        setSearchQuery({
          postcode: selectedLocation.postcode,
          area: selectedLocation.area,
        })
      );
    }
  };

  const isValidSelection = AUTOCOMPLETE_DATA.includes(value);

  return (
    <PageWrapper>
      <GradientOverlay />
      <HeroContainer size="xl">
        <Grid align="center" style={{ flex: 1 }}>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Box maw={550}>
              <HeroTitle order={1}>Order food and more</HeroTitle>
              <Text size="xl" mt="md" c="dimmed">
                Restaurants delivering near you
              </Text>

              <form onSubmit={handleSearch}>
                <SearchInput
                  mt="xl"
                  size="xl"
                  radius="xl"
                  placeholder="Enter your area or postcode"
                  data={AUTOCOMPLETE_DATA}
                  value={value}
                  onChange={setValue}
                  rightSection={
                    <Button
                      type="submit"
                      radius="xl"
                      size="md"
                      color="orange"
                      disabled={!isValidSelection}
                    >
                      Search
                    </Button>
                  }
                  rightSectionWidth={110}
                />
              </form>
            </Box>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Flex justify="center" align="center">
              <Image
                maw="80%"
                src={heroImageUrl}
                alt="A delicious bowl of falafel salad"
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </HeroContainer>
    </PageWrapper>
  );
}
