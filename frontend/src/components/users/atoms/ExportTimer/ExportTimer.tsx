import Text from "../Text/Text";

type ExportTimerProps = {
  elapsedTime: number;
};

export default function ExportTimer({ elapsedTime }: ExportTimerProps) {
  return (
    <Text size="sm" style={{ color: "#666" }}>
      ({(elapsedTime / 1000).toFixed(2)}s)
    </Text>
  );
}

