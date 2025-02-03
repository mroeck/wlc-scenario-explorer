import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from "@tanstack/react-router";
import { Share2Icon, Mail } from "lucide-react";
import { TwitterIcon } from "./logos/TwitterIcon";
import { FacebookIcon } from "./logos/FacebookIcon";
import { cn } from "@/lib/utils";
import { BlueskyIcon } from "./logos/BlueskyIcon";
import { LinkedinIcon } from "./logos/LinkedinIcon";

const MailIcon = () => (
  <Mail
    className="size-full max-h-full max-w-full text-primary"
    width={undefined}
    height={undefined}
  />
);

export const ShareButton = () => {
  const { href } = useLocation({
    select: (location) => ({
      href: location.href,
    }),
  });

  const currentUrlRaw =
    location.hostname.replace("localhost", "example.com") + href;

  const messageRaw =
    "Just discovered this interactive tool for visualizing carbon emissions of Europe's building stock & reduction strategies. Explore building types, life cycle stages & more.";
  const message = encodeURIComponent(messageRaw);
  const messageWithLink = encodeURIComponent(
    `${messageRaw} \n\n${currentUrlRaw}`,
  );
  const currentUrl = encodeURIComponent(currentUrlRaw);
  const title = encodeURIComponent("Checkout this scenarioe explorer!");

  const socialMediaUrls = {
    x: {
      link: `https://x.com/intent/post?text=${message}&url=${currentUrl}`,
      Icon: TwitterIcon,
      backgroundColor: "black",
    },
    bluesky: {
      link: `https://bsky.app/intent/compose?text=${messageWithLink}`,
      Icon: BlueskyIcon,
      backgroundColor: "white",
    },
    facebook: {
      link: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
      Icon: FacebookIcon,
      backgroundColor: "white",
    },
    linkedin: {
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
      Icon: LinkedinIcon,
      backgroundColor: "white",
    },
    email: {
      link: `mailto:?subject=${title}&body=${messageWithLink}`,
      Icon: MailIcon,
      backgroundColor: "white",
    },
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Share2Icon className="text-primary" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <ul className="flex flex-wrap items-end justify-center gap-8">
            {Object.entries(socialMediaUrls).map(([plateform, data]) => (
              <li key={data.link} className="h-20">
                <figure className="flex h-full flex-col items-center gap-2">
                  <a href={data.link} className="flex-1">
                    <div
                      className={cn(
                        "h-full max-h-12 max-w-12 rounded-full p-0",
                        plateform === "x" && "p-3",
                      )}
                      style={{ backgroundColor: data.backgroundColor }}
                    >
                      <div className="flex h-full items-center justify-center">
                        <data.Icon className="size-full max-h-full max-w-full" />
                      </div>
                    </div>
                  </a>
                  <figcaption className="text-sm capitalize">
                    {plateform}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};
