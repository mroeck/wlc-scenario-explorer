import { cn } from "@/lib/utils";

type TypographyFigureProps = React.ComponentPropsWithoutRef<"figure"> & {
  url: string;
  caption: string;
};
export function TypographyFigure({
  url,
  caption,
  className,
}: TypographyFigureProps) {
  return (
    <figure className={cn("w-[900px] max-w-full", className)}>
      <img src={url} alt={caption} />
      <div className={cn("py-2")}></div>
      <figcaption className={cn("text-center text-muted-foreground")}>
        {caption}
      </figcaption>
    </figure>
  );
}
