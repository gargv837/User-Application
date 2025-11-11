import { inputStyle } from "../styles/styles";

type UsersSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onResetToFirstPage: () => void;
};

export default function UsersSearch({ value, onChange, onResetToFirstPage }: UsersSearchProps) {
  return (
    <input
      placeholder="Search by name or email"
      value={value}
      onChange={(e) => {
        onResetToFirstPage();
        onChange(e.target.value);
      }}
      style={{ ...inputStyle, maxWidth: 360 }}
    />
  );
}


