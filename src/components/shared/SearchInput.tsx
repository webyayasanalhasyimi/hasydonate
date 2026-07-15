import { Input } from "@/components/ui/input";
import { Icons } from "@/lib/icons";

interface SearchInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  disabled,
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="pl-9 w-full"
      />
    </div>
  );
}
