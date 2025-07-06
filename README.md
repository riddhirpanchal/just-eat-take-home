# Project Documentation: Food Delivery App

## 1. Project Overview

This application is a modern web app for Browse and filtering local restaurants. It allows users to search for restaurants by postcode, view a detailed list of options, and apply a variety of filters to find exactly what they're looking for.

The project is built with a modern React stack, emphasizing a clean, maintainable, and scalable architecture. It includes a comprehensive testing suite with both unit/component tests and end-to-end browser tests.

---

## 2. Getting Started

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** or **yarn** package manager

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/riddhirpanchal/just-eat-take-home.git](https://github.com/riddhirpanchal/just-eat-take-home.git)
    cd just-eat-take-home
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This starts the Vite development server, typically on `http://localhost:5173`.

4.  **Running Tests:**
    The project includes two types of tests. See the "Testing" section below for more details.
    - **To run Jest unit & component tests:**
      ```bash
      npm test
      ```
    - **To run Playwright end-to-end tests:**
      ```bash
      npx playwright test
      ```

## Deployment with Docker

This application is configured to be built and run as a production-ready Docker container using a multi-stage build for a small and secure final image.

### Prerequisites

* **Docker Desktop** must be installed and running.

### Building and Running the Container

1.  **Build the Docker image:**
    From the project root, run the following command. This will build the React app and package it with Nginx.
    ```bash
    docker build -t food-delivery-app .
    ```

2.  **Run the Docker container:**
    Once the image is built, run this command to start the application.
    ```bash
    docker run -p 8080:80 food-delivery-app
    ```

3.  **View the application:**
    Open your browser and navigate to **`http://localhost:8080`**.   


### Use deployed docker image

Run below command to directly run the application from the image of dockerhub

```
docker run -p 8080:80 riddhi1012/food-delivery-app:latest
```

Open your browser and navigate to **`http://localhost:8080`**.   
 
---

## 3. Project Structure

The project follows a feature-sliced design, with dedicated directories for tests.

```
├── __mocks__
│   └── fileMock.js
├── Dockerfile
├── eslint.config.js
├── index.html
├── jest.config.js
├── jest.setup.js
├── main
├── nginx.conf
├── package.json
├── playwright-report
│   └── index.html
├── playwright.config.js
├── public
│   └── favicon.svg
├── README.md
├── src
│   ├── App.jsx
│   ├── App.test.jsx
│   ├── assets
│   │   ├── food_bg.png
│   │   └── react.svg
│   ├── components
│   │   ├── FilterSidebar.jsx
│   │   ├── FilterSidebar.test.js
│   │   ├── RestaurantCard.jsx
│   │   ├── RestaurantCard.test.js
│   │   ├── RestaurantList.jsx
│   │   └── RestaurantList.test.js
│   ├── config
│   │   └── theme.js
│   ├── constants
│   │   └── locations.js
│   ├── features
│   │   ├── restaurants
│   │   │   └── restaurantsApi.js
│   │   └── search
│   │       ├── searchSlice.js
│   │       └── searchSlice.test.js
│   ├── hooks
│   │   ├── useRestaurantFilters.js
│   │   └── useRestaurantFilters.test.js
│   ├── main.jsx
│   ├── mock.json
│   ├── pages
│   │   ├── HomePage.jsx
│   │   ├── HomePage.test.jsx
│   │   ├── RestaurantListPage.jsx
│   │   └── RestaurantListPage.test.js
│   ├── store
│   │   └── index.js
│   └── utils
│       └── test-utils.jsx
├── test-results
├── tests-e2e
│   └── search.spec.js
├── vite.config.js
└── yarn.lock
```

## 5. Code Breakdown

This section details the purpose and location of each key file in the application.

### Core Application Setup

- **`src/main.jsx`**: The entry point of the app. It sets up top-level providers (`Redux`, `MantineProvider`, `StyledThemeProvider`).
- **`vite.config.js`**: Configures the Vite build tool, including the development server proxy to avoid CORS issues.
- **`jest.config.js` / `jest.setup.js`**: Configures the Jest testing environment, including transformations for SWC and mocking for static assets.
- **`playwright.config.js`**: Configures the Playwright E2E testing framework, including browser setup and launching the Vite web server.

### State Management & Data Fetching

- **`src/features/restaurants/restaurantsApi.js`**: Defines API communication using RTK Query. Can be toggled to use mock data.
- **`src/features/search/searchSlice.js`**: A Redux slice that manages the user's search query (`postcode`, `area`).

### Pages & Components

- **`src/pages/HomePage.jsx`**: The landing page where users can search for a location.
- **`src/pages/RestaurantListPage.jsx`**: The main results page. It acts as an orchestrator, using hooks for data fetching (`useGetRestaurantsByPostcodeQuery`) and filtering logic (`useRestaurantFilters`), and rendering the appropriate child components.
- **`src/components/FilterSidebar.jsx`**: A presentational component that renders all filter controls.
- **`src/components/RestaurantCard.jsx`**: Displays a single restaurant's information.
- **`src/components/RestaurantList.jsx`**: A simple component that maps a list of restaurants to `RestaurantCard` components.

### Custom Hooks

- **`src/hooks/useRestaurantFilters.js`**: A key hook that centralizes all logic for filtering and sorting the list of restaurants, making the `RestaurantListPage` much cleaner.
