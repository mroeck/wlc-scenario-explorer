const space = "4";

export function ColorLine({
  color,
  lineType,
}: {
  color: string;
  lineType: "solid" | "dashed";
}) {
  const isDashed = lineType === "dashed";

  return (
    <div
      className="flex h-5 w-6 items-center"
      style={{
        paddingRight: isDashed ? "" : `${space}px`,
      }}
    >
      <svg viewBox="0 0 24 1" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="0"
          y1="0"
          x2="24"
          y2="0"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={isDashed ? `4 ${space}` : "0"}
        />
      </svg>
    </div>
  );
}
