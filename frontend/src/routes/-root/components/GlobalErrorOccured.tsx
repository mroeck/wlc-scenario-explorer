import { ErrorOccurred } from "@/components/ErrorOccurred";
import { Button } from "@/components/ui/button";

export const GlobalErrorOccured = () => {
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <div className="flex flex-col items-center justify-center bg-background pt-[20dvh]">
      <ErrorOccurred />
      <Button onClick={refreshPage}>Refresh the page</Button>
    </div>
  );
};
