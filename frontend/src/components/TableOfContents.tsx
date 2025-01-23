import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { TypographyH3 } from "./TypographyH3";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type ToCSection<T extends string> = {
  id: T;
  title: string;
  subsections?: ToCSection<T>[];
};

export function TableOfContents({
  sections,
}: {
  sections: ToCSection<string>[];
}) {
  const { hash, currentPath } = useLocation({
    select: (location) => ({
      hash: location.hash,
      currentPath: location.pathname,
    }),
  });
  const [openSection, setOpenSection] = useState<string>(hash);

  const handleSectionClick = (sectionId: string) => {
    setOpenSection(sectionId);
  };

  return (
    <div className="pl-2 sm:pl-0">
      <div className="pb-5">
        <TypographyH3>Table of Contents</TypographyH3>
      </div>
      <div>
        <Accordion
          type="single"
          value={openSection}
          onValueChange={setOpenSection}
        >
          {sections.map((section) => (
            <AccordionItem
              className="border-none hover:no-underline"
              value={section.id}
              key={section.id}
            >
              <AccordionTrigger
                onClick={() => {
                  handleSectionClick(section.id);
                }}
                showChevron={
                  !!section.subsections && section.subsections.length > 0
                }
                className={cn(
                  "px-primary-x hover:bg-accent hover:no-underline",
                  hash === section.id && "bg-accent",
                )}
              >
                <Link
                  to={currentPath}
                  hash={section.id}
                  className="flex w-full items-center"
                >
                  {section.title}
                </Link>
              </AccordionTrigger>
              {section.subsections && section.subsections.length > 0 && (
                <AccordionContent>
                  <ul className="flex flex-col gap-1">
                    {section.subsections.map((subsection, index) => (
                      <li key={subsection.id}>
                        <Link
                          to={currentPath}
                          hash={subsection.id}
                          className={cn(
                            "flex cursor-pointer px-10 py-2 hover:bg-accent hover:no-underline",
                            index === 0 && "mt-1",
                            hash === subsection.id && "bg-accent",
                          )}
                        >
                          {subsection.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
