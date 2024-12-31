import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { env } from "../env";
import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { GlobalErrorOccured } from "./-root/components/GlobalErrorOccured";

const TanStackRouterDevtools = env.PUBLIC_DEBUG
  ? lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    )
  : () => null;

export const Route = createRootRoute({
  component: () => <UserInterface />,
  errorComponent: () => <GlobalErrorOccured />,
});

function UserInterface() {
  return (
    <div className="mx-auto h-max max-w-screen-2xl bg-[hsl(220,14%,96%)]">
      <Header />
      <ScrollRestoration />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools initialIsOpen={false} />
      </Suspense>
      <Toaster />
      <DisclaimerModal />
    </div>
  );
}
