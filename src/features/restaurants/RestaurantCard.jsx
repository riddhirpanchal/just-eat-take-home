import { useState } from "react";
import styled from "styled-components";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  ThemeIcon,
  rem,
  Divider,
} from "@mantine/core";
import {
  IconStar,
  IconMapPin,
  IconClock,
  IconTruck,
} from "@tabler/icons-react";

const CardWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }
`;

const InfoSection = styled.div`
  flex-grow: 1;
`;

const LogoContainer = styled(Card)`
  flex-shrink: 0;
  overflow: hidden;
  width: ${rem(80)};
  height: ${rem(80)};
`;

const DetailsSection = styled.div`
  flex: 1;
`;

export function RestaurantCard({ restaurant }) {
  const {
    name,
    logoUrl,
    rating,
    cuisines = [],
    address,
    deliveryCost,
    deliveryEtaMinutes,
  } = restaurant;

  const [showAllCuisines, setShowAllCuisines] = useState(false);

  const fullAddress = address
    ? `${address.firstLine}, ${address.postalCode}`
    : "Address not available";

  const handleToggleCuisines = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowAllCuisines((prev) => !prev);
  };

  return (
    <CardWrapper shadow="sm" padding="lg" radius="md" withBorder>
      <InfoSection>
        <Group wrap="nowrap" align="flex-start">
          <LogoContainer p={0} radius="md">
            <Image
              src={logoUrl}
              alt={`Logo for ${name}`}
              w="100%"
              h="100%"
              fit="contain"
              fallbackSrc="https://placehold.co/100x100?text=Logo"
            />
          </LogoContainer>

          <DetailsSection>
            <Text fw={700} size="lg" lineClamp={1}>
              {name}
            </Text>

            {rating && rating.count > 0 && (
              <Group gap="xs" mt={4}>
                <ThemeIcon variant="light" color="orange" size="sm">
                  <IconStar style={{ width: rem(14), height: rem(14) }} />
                </ThemeIcon>
                <Text size="sm" fw={500}>
                  {rating.starRating.toFixed(1)}
                </Text>
                <Text size="sm" c="dimmed">
                  ({rating.count} ratings)
                </Text>
              </Group>
            )}

            {address && (
              <Group gap="xs" mt={4}>
                <ThemeIcon variant="light" color="gray" size="sm">
                  <IconMapPin style={{ width: rem(14), height: rem(14) }} />
                </ThemeIcon>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {fullAddress}
                </Text>
              </Group>
            )}
          </DetailsSection>
        </Group>

        {/* 4. Update the rendering logic for cuisines */}
        {cuisines.length > 0 && (
          <Group mt="md" gap="xs">
            {(showAllCuisines ? cuisines : cuisines.slice(0, 3)).map(
              (cuisine) => (
                <Badge key={cuisine.uniqueName} color="gray" variant="light">
                  {cuisine.name}
                </Badge>
              )
            )}
            {cuisines.length > 3 && (
              <Badge
                color="gray"
                variant="outline"
                onClick={handleToggleCuisines}
                style={{ cursor: "pointer" }}
              >
                {showAllCuisines ? "Show less" : `+${cuisines.length - 3}`}
              </Badge>
            )}
          </Group>
        )}
      </InfoSection>

      {deliveryEtaMinutes && typeof deliveryCost === "number" && (
        <>
          <Divider my="sm" />
          <Group justify="space-between">
            <Group gap="xs">
              <IconClock
                style={{ width: rem(18), height: rem(18) }}
                color="var(--mantine-color-dimmed)"
              />
              <Text size="sm">
                {deliveryEtaMinutes.rangeLower}-{deliveryEtaMinutes.rangeUpper}{" "}
                min
              </Text>
            </Group>
            <Group gap="xs">
              <IconTruck
                style={{ width: rem(18), height: rem(18) }}
                color="var(--mantine-color-dimmed)"
              />
              <Text size="sm">
                {deliveryCost === 0
                  ? "Free delivery"
                  : `£${deliveryCost.toFixed(2)}`}
              </Text>
            </Group>
          </Group>
        </>
      )}
    </CardWrapper>
  );
}
