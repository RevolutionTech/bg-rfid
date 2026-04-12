import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount >= 5) return false;
        // Retry on HTTP 202 (BGG still processing)
        if (axios.isAxiosError(error) && error.response?.status === 202) {
          return true;
        }
        // Default retry behaviour for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});
