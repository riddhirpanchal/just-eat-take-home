import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MantineProvider, useMantineTheme } from "@mantine/core";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { configureStore } from "@reduxjs/toolkit";

import { searchSlice } from "../features/search/searchSlice";
import { restaurantsApi } from "../features/restaurants/restaurantsApi";
import { theme } from "../config/theme"; // Your custom partial theme

function MantineStyledProvider({ children }) {
  const mantineTheme = useMantineTheme();
  return (
    <StyledThemeProvider theme={mantineTheme}>{children}</StyledThemeProvider>
  );
}

const AllTheProviders = ({ children, preloadedState }) => {
  const store = configureStore({
    reducer: {
      search: searchSlice.reducer,
      [restaurantsApi.reducerPath]: restaurantsApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(restaurantsApi.middleware),
  });

  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <MantineStyledProvider>{children}</MantineStyledProvider>
      </MantineProvider>
    </Provider>
  );
};

const customRender = (ui, options) =>
  render(ui, {
    wrapper: (props) => (
      <AllTheProviders {...props} {...options?.providerProps} />
    ),
    ...options,
  });

export * from "@testing-library/react";

export { customRender as render };
