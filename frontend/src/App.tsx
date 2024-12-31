import { lazy } from "react";
import {
  NotFoundRoute,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

import { routeTree } from "./routeTree.gen";
import { env } from "./env";
import { NotFound } from "./components/NotFound";
import { Route as rootRoute } from "./routes/__root";

const ReactQueryDevtools = env.PUBLIC_DEBUG
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((res) => ({
        default: res.ReactQueryDevtools,
      })),
    )
  : () => null;

const queryClient = new QueryClient();

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
    </QueryClientProvider>
  );
}
