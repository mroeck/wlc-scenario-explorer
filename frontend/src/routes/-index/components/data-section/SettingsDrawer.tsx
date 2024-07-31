import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Settings } from "../side-section/Settings";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SettingsDrawer = () => {
  return (
    <Drawer direction="right" data-vaul-no-drag>
      <DrawerTrigger>
        <Button asChild variant="outline">
          <span>Settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className={cn("h-full")}
        dragHint={false}
        data-vaul-no-drag
      >
        <div className={cn("flex justify-end pr-3 pt-3")}>
          <DrawerClose>
            <CircleX className={cn("size-7 text-red-500")} />
          </DrawerClose>
        </div>
        <div className={cn("flex min-h-0 flex-1 justify-center")}>
          <Settings />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
