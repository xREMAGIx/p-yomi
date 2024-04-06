import { RouterProvider, createRouter } from "@tanstack/react-router";
import toast, { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { useAuth } from "./hooks/useAuth";
import { store } from "./redux/store";

// Import the generated route tree
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { DEFAULT_QUERY_OPTION } from "./libs/constants";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { authentication: undefined! },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  }),
  defaultOptions: {
    queries: {
      ...DEFAULT_QUERY_OPTION,
    },
  },
});

function App() {
  const authentication = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ authentication }} />
      <Toaster />
    </QueryClientProvider>
  );
}

function RootApp() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default RootApp;
