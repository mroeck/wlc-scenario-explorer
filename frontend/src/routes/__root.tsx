import { createRootRoute, Outlet } from "@tanstack/react-router";
import { env } from "../env";
import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { useRouterState } from "@tanstack/react-router";

const TanStackRouterDevtools = env.PUBLIC_DEBUG
  ? lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )
  : () => null;

export const Route = createRootRoute({
  component: () => <UserInterface />,
});

function UserInterface() {
  const currentRoute = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <div className="mx-auto h-max max-w-screen-2xl bg-accent">
      <Header currentRoute={currentRoute} />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools initialIsOpen={false} />
      </Suspense>
      <Toaster />
    </div>
  );
}
