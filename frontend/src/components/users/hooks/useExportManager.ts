import { useState, useCallback } from "react";
import { exportUsersStream } from "../../../api/users";
import { useExportTimer } from "./useExportTimer";
import { useExportMetrics, type ExportMetrics } from "./useExportMetrics";

type UseExportManagerReturn = {
  isExportLoading: boolean;
  exportTimer: number | null;
  exportMetrics: ExportMetrics | null;
  handleExport: () => Promise<void>;
};

export function useExportManager(): UseExportManagerReturn {
  const [isExportLoading, setIsExportLoading] = useState(false);
  const { elapsed: exportTimer, startTimer, stopTimer, resetTimer } = useExportTimer();
  const { metrics: exportMetrics, showMetrics, clearMetrics } = useExportMetrics();

  const handleExport = useCallback(async () => {
    const startTime = startTimer();
    setIsExportLoading(true);
    clearMetrics();

    try {
      const performanceMetrics = await exportUsersStream();
      const totalDuration =
        stopTimer() ?? (startTime ? performance.now() - startTime : 0);

      showMetrics({
        totalDuration,
        phases: {
          fetch: performanceMetrics.fetchDuration,
          downloadSetup: performanceMetrics.downloadSetupDuration,
        },
      });

      console.log("Export Performance Analysis:", {
        phases: {
          fetch: `${performanceMetrics.fetchDuration.toFixed(2)}ms`,
          downloadSetup: `${performanceMetrics.downloadSetupDuration.toFixed(2)}ms`,
        },
        totalDuration: `${totalDuration.toFixed(2)}ms`,
        totalDurationSeconds: `${(totalDuration / 1000).toFixed(2)}s`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const duration = stopTimer() ?? (startTime ? performance.now() - startTime : 0);

      showMetrics({ totalDuration: duration });

      console.error("Export failed:", error);
      console.log("Export Performance (Failed):", {
        totalDuration: `${duration.toFixed(2)}ms`,
        totalDurationSeconds: `${(duration / 1000).toFixed(2)}s`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      resetTimer();
      setIsExportLoading(false);
    }
  }, [clearMetrics, resetTimer, showMetrics, startTimer, stopTimer]);

  return { isExportLoading, exportTimer, exportMetrics, handleExport };
}

