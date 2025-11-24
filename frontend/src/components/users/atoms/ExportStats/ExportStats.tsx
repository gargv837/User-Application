import Text from "../Text/Text";

type ExportStatsProps = {
  totalDuration: number;
  phases?: {
    fetch: number;
    downloadSetup: number;
  };
};

export default function ExportStats({ totalDuration, phases }: ExportStatsProps) {
  return (
    <div style={{ marginTop: 8, padding: 8, backgroundColor: "#f5f5f5", borderRadius: 4 }}>
      <Text size="sm" style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>
        Export Completed
      </Text>
      <Text size="sm" style={{ display: "block", marginBottom: 2 }}>
        Total Time: {(totalDuration / 1000).toFixed(2)}s
      </Text>
      {phases && (
        <div style={{ marginTop: 4, fontSize: "12px", color: "#666" }}>
          <div>Fetch: {phases.fetch.toFixed(2)}ms</div>
          <div>Download Setup: {phases.downloadSetup.toFixed(2)}ms</div>
        </div>
      )}
    </div>
  );
}

