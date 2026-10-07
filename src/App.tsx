import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthInit } from "./hooks/auth/useAuthInit";

const queryClient = new QueryClient();

function App() {
  useAuthInit(); // Verify session cookie on startup → populates Redux

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
