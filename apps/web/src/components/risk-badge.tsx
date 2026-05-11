interface Props {
  risk: string;
}

export function RiskBadge({ risk }: Props) {
  const styles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        styles[risk as keyof typeof styles]
      }`}
    >
      {risk}
    </span>
  );
}
