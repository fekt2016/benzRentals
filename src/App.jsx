import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalStyles from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import MainRoutes from "./routes/MainRoutes";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  // const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <MainRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
