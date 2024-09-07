import { Section } from "@/components/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Scenarios } from "./Tabs/Scenarios";
import { Filters } from "./Tabs/Filters";
import { ROUTES, SETTINGS_TABS_NAMES } from "@/lib/constants";
import { getRouteApi } from "@tanstack/react-router";

const SETTINGS_TABS = [
  {
    name: SETTINGS_TABS_NAMES.scenarios,
    content: <Scenarios />,
  },
  {
    name: SETTINGS_TABS_NAMES.filters,
    content: <Filters />,
  },
] as const;

const route = getRouteApi(ROUTES.DASHBOARD);

export const Settings = () => {
  const navigate = route.useNavigate();
  const { settingsTab } = route.useSearch({
    select: (search) => ({
      settingsTab: search.settingsTab,
    }),
  });

  const onTabChange = (newSettingsTab: string) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        settingsTab: newSettingsTab,
      }),
    });
  };
  return (
    <Section
      className={cn(
        "flex w-80 flex-col border-none px-0 shadow-none lg:border-gray-200 lg:shadow-md",
      )}
    >
      <h2 className={cn("sr-only")}>Settings</h2>
      <Tabs
        className={cn("flex min-h-0 flex-1 flex-col lg:h-full")}
        onValueChange={onTabChange}
        value={settingsTab}
      >
        <div className={cn("px-primary-x")}>
          <TabsList className={cn("flex")}>
            {SETTINGS_TABS.map((tab) => (
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

        {SETTINGS_TABS.map((tab) => (
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
