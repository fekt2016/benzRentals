import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "../../styles/theme";

export function ThemeProvider({ children }) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}

