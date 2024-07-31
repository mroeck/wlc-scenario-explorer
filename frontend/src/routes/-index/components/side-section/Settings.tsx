import { Section } from "@/components/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Scenarios } from "./Tabs/Scenarios";
import { Filters } from "./Tabs/Filters";

const tabs = [
  {
    name: "Scenarios",
    content: <Scenarios />,
  },
  {
    name: "Filters",
    content: <Filters />,
  },
] as const;

type TabName = (typeof tabs)[number]["name"];
const defaultTab: TabName = "Scenarios";

export const Settings = () => {
  return (
    <Section
      className={cn(
        "flex w-80 flex-col border-none px-0 shadow-none lg:border-gray-200 lg:shadow-md",
      )}
    >
      <h2 className={cn("sr-only")}>Settings</h2>
      <Tabs
        defaultValue={defaultTab}
        className={cn("flex min-h-0 flex-1 flex-col lg:h-full")}
      >
        <div className={cn("px-primary-x")}>
          <TabsList className={cn("flex")}>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.name}
                value={tab.name}
                className={cn("flex-1")}
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.name}
            value={tab.name}
            className={cn("relative h-[calc(100%-44px)] flex-1")}
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
};
