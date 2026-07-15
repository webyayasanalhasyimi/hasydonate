import { Typography } from "./Typography";

interface SectionTitleProps {
  readonly title: string;
  readonly className?: string;
}

export function SectionTitle({ title, className = "" }: SectionTitleProps) {
  return (
    <Typography
      variant="h3"
      as="h2"
      className={`font-semibold text-lg border-b pb-2 ${className}`}
    >
      {title}
    </Typography>
  );
}
