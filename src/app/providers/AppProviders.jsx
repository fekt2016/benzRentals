import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";
import { SocketProvider } from "./SocketProvider";
import GlobalStyles from "../../styles/GlobalStyles";

export function AppProviders({ children }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SocketProvider>
          <GlobalStyles />
          {children}
        </SocketProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

