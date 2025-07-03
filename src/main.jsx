import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { MantineProvider, useMantineTheme } from "@mantine/core";
import { ThemeProvider as StyledThemeProvider } from "styled-components"; // Rename to avoid conflict

import App from "./App.jsx";
import { store } from "./store/index.js";
import { theme } from "./config/theme.js";

import "@mantine/core/styles.css";

function MantineStyledProvider({ children }) {
  const mantineTheme = useMantineTheme();
  return (
    <StyledThemeProvider theme={mantineTheme}>{children}</StyledThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <MantineStyledProvider>
          <App />
        </MantineStyledProvider>
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
