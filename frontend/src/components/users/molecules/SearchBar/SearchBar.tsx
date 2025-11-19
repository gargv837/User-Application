import { Input } from "../../atoms";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onResetToFirstPage: () => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  onResetToFirstPage,
  placeholder = "Search by name or email",
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onResetToFirstPage();
    onChange(newValue);
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      style={{ maxWidth: 360 }}
    />
  );
}

