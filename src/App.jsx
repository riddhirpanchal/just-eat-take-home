import { Container, Title, Text, Box } from '@mantine/core'

function App() {
  return (
    <Container size="xl" py="xl">
      <Box ta="center" mb="xl">
        <Title order={1} size="h1" fw={900} mb="md">
          🍽️ Restaurant Finder
        </Title>
        <Text size="lg" c="dimmed">
          Discover great restaurants in your area using Just Eat
        </Text>
      </Box>
      
      <Box ta="center" mt="xl">
        <Text c="dimmed">
          Coming soon: Search functionality and restaurant listings
        </Text>
      </Box>
    </Container>
  )
}

export default App