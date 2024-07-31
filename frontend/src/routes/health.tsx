import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/health")({
  component: () => <div>Hello /health!</div>,
});
