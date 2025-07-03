# Project Documentation: Food Delivery App

## 1. Project Overview

This application is a modern web app for browsing and filtering local restaurants. It allows users to search for restaurants by postcode, view a detailed list of options, and apply a variety of filters to find exactly what they're looking for.

The project is built with a modern React stack, emphasizing a clean, maintainable, and scalable architecture.

---

## 2. Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** or **yarn** package manager

### File Location: Project Root

The following steps should be performed in the root directory of the project.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/riddhirpanchal/just-eat-take-home.git
    cd just-eat-take-home
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the Vite development server, typically on `http://localhost:5173`. The application will open automatically in your browser.

---

## 3. Project Structure

The project follows a feature-sliced design, grouping related files by their feature or domain.

```
├── public/
│ └── favicon.svg # Application icon
├── src/
│ ├── components/
│ │ ├── FilterSidebar.jsx # UI for all search filters
│ │ └── RestaurantCard.jsx # Card for a single restaurant
│ │ └── RestaurantList.jsx # Grid layout for restaurant cards
│ ├── features/
│ │ ├── restaurants/
│ │ │ └── restaurantsApi.js # RTK Query slice for the restaurants API
│ │ └── search/
│ │ └── searchSlice.js # Redux slice for search state
│ ├── hooks/
│ │ └── useRestaurantFilters.js # Custom hook for all filtering logic
│ ├── pages/
│ │ ├── HomePage.jsx # The main landing/search page
│ │ └── RestaurantListPage.jsx# The search results and filtering page
│ ├── App.jsx # Main application component with routing
│ ├── main.jsx # Entry point of the application
│ └── store/
│ └── index.js # Redux store configuration
├── .gitignore
├── index.html # Main HTML template
├── package.json
└── vite.config.js # Vite configuration (including proxy)
```

## 4. Code Breakdown

This section details the purpose and location of each key file in the application.

### Core Application Setup

#### `src/main.jsx`

This is the entry point of the app. It sets up all the top-level providers:

- `<Provider>`: Connects the app to the Redux store.
- `<MantineProvider>`: Provides the Mantine theme and styles.
- `<StyledThemeProvider>`: Bridges the Mantine theme to `styled-components`.

#### `vite.config.js` (Project Root)

This file configures the Vite build tool. Its most important feature for this project is the `server.proxy`, which forwards API requests from `/api` to the real backend, avoiding CORS issues during development.

### State Management & Data Fetching

#### `src/features/restaurants/restaurantsApi.js`

This file defines the API communication using RTK Query.

- It can call API or read mockdata depending on `useMockData` variable value.
- The `customBaseQuery` function wraps the fetch logic, adding a delay for mock data and robust `try...catch` error handling for live calls.

#### `src/features/search/searchSlice.js`

This Redux slice manages the user's search query details.

- It holds the `postcode` and `area` of the current search, which is used to display information across different pages consistently.

### Pages

#### `src/pages/HomePage.jsx`

The landing page where users can search for a location.

#### `src/pages/RestaurantListPage.jsx`

The main results page. It is now a lean orchestrator component.

- **Data Fetching**: Gets the postcode from the URL and calls the `useGetRestaurantsByPostcodeQuery` hook.
- **Filtering**: Offloads all filtering state and logic to the `useRestaurantFilters` custom hook.
- **UI**: Renders the `FilterSidebar` and `RestaurantList` components, passing the necessary data and functions down as props.
- **Error Handling**: Contains a detailed block to display specific error messages based on the `isError` and `error` state from the RTK Query hook.

### Reusable Components

#### `src/components/FilterSidebar.jsx`

A presentational component that renders all the filter controls. It is self-contained and receives all its data and functions as props, making it highly reusable.

#### `src/components/RestaurantCard.jsx`

Displays a single restaurant's information. It includes local state to manage the "show more/less" functionality for cuisine tags.

#### `src/components/RestaurantList.jsx`

A simple component that takes a list of restaurants and maps over them, rendering a `RestaurantCard` for each one inside a `SimpleGrid`.

### Custom Hooks

#### `src/hooks/useRestaurantFilters.js`

This custom hook is a key part of the refactoring. It centralizes all the complex logic for filtering the restaurants.

- It contains all the `useState` calls for the various filters.
- It uses `useMemo` to efficiently recalculate the `filteredRestaurants` list only when the source data or a filter value changes.
- This hook makes the `RestaurantListPage` much cleaner by abstracting away the implementation details of filtering.
