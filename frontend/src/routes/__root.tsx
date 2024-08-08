import { createRootRoute, Outlet } from "@tanstack/react-router";
import { env } from "../env";
import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const TanStackRouterDevtools = env.PUBLIC_DEBUG
  ? lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )
  : () => null;

export const Route = createRootRoute({
  component: () => (
    <div className={cn("mx-auto min-h-screen max-w-screen-2xl bg-accent")}>
      <Header />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools initialIsOpen={false} />
      </Suspense>
      <Toaster />
    </div>
  ),
});
