import { lazy } from "react";
import {
  NotFoundRoute,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./App.css";

import { routeTree } from "./routeTree.gen";
import { env } from "./env";
import { NotFound } from "./components/NotFound";
import { Route as rootRoute } from "./routes/__root";
import { Toaster } from "./components/ui/toaster";
import { isProd } from "./lib/constants";
import type { useToast } from "./hooks/use-toast";

const ReactQueryDevtools = env.PUBLIC_DEBUG
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((res) => ({
        default: res.ReactQueryDevtools,
      })),
    )
  : () => null;

// const queryClient = new QueryClient();
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.errorMessage && query.meta.toast) {
        const toast = query.meta.toast as ReturnType<typeof useToast>["toast"];
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem fetching scenario parameters levels suggestions.",
        });

        if (!isProd) {
          console.error(error);
        }
      }
    },
  }),
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => <NotFound />,
});

const router = createRouter({
  routeTree,
  notFoundRoute,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  );
}
