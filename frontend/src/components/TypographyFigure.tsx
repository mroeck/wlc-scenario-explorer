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
    <figure className={cn("max-w-[900px]", className)}>
      <img src={url} alt={caption} />
      <div className={cn("py-4")}></div>
      <figcaption className={cn("text-center text-muted-foreground")}>
        {caption}
      </figcaption>
    </figure>
  );
}
