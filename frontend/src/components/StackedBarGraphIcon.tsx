import { cn } from "@/lib/utils";

type StackedBarGraphIconProps = {
  colorful: boolean;
};
export const StackedBarGraphIcon = ({ colorful }: StackedBarGraphIconProps) => {
  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 555.94 487.71"
    >
      <polyline
        fill="none"
        className={cn(colorful ? "stroke-[#394285]" : "stroke-primary-900")}
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="20 20 20 467.71 535.94 467.71"
      />
      <rect
        x="62.87"
        y="289.79"
        width="96.18"
        height="136.1"
        className={cn(colorful ? "fill-[#499acc]" : "fill-primary-900")}
      />
      <path
        className={cn(colorful ? "fill-[#394285]" : "fill-primary-900")}
        d="M449.58,480.88V607H363.39V480.88h86.19m10-10H353.39V617H459.58V470.88Z"
        transform="translate(-295.52 -186.09)"
      />
      <rect
        x="62.87"
        y="133.41"
        width="96.18"
        height="155.5"
        className={cn(colorful ? "fill-[#3abb5c]" : "fill-transparent")}
      />
      <path
        className={cn(colorful ? "fill-[#394285]" : "fill-primary-900")}
        d="M449.58,324.5V470H363.39V324.5h86.19m10-10H353.39V480H459.58V314.5Z"
        transform="translate(-295.52 -186.09)"
      />
      <rect
        x="228.76"
        y="322.34"
        width="96.18"
        height="98.95"
        className={cn(colorful ? "fill-[#499acc]" : "fill-primary-900")}
      />
      <path
        className={cn(colorful ? "fill-[#394285]" : "fill-primary-900")}
        d="M615.46,513.42v89H529.28v-89h86.18m10-10H519.28v109H625.46v-109Z"
        transform="translate(-295.52 -186.09)"
      />
      <rect
        x="228.76"
        y="253.22"
        width="96.18"
        height="76.4"
        className={cn(colorful ? "fill-[#3abb5c]" : "fill-transparent")}
      />
      <path
        className={cn(colorful ? "fill-[#394285]" : "fill-primary-900")}
        d="M615.46,444.3v66.4H529.28V444.3h86.18m10-10H519.28v86.4H625.46V434.3Z"
        transform="translate(-295.52 -186.09)"
      />
      <rect
        x="394.44"
        y="116.99"
        width="96.18"
        height="308.9"
        className={cn(colorful ? "fill-[#499acc]" : "fill-primary-900")}
      />
      <path
        className={cn(colorful ? "fill-[#394285]" : "fill-primary-900")}
        d="M781.15,308.08V607H695V308.08h86.18m10-10H685V617H791.15V298.08Z"
        transform="translate(-295.52 -186.09)"
      />
      <rect
        x="394.44"
        y="57.46"
        width="96.18"
        height="78.04"
        className={cn(colorful ? "fill-[#3abb5c]" : "fill-transparent")}
      />
      <path
        className={cn(colorful ? "fill-[#394285]" : "fill-primary-900")}
        d="M781.15,248.55v68H695v-68h86.18m10-10H685v88H791.15v-88Z"
        transform="translate(-295.52 -186.09)"
      />
    </svg>
  );
};
