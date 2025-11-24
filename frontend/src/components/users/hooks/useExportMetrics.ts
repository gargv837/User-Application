import { useState, useRef, useCallback, useEffect } from "react";

export type ExportMetrics = {
  totalDuration: number;
  phases?: {
    fetch: number;
    downloadSetup: number;
  };
};

type UseExportMetricsReturn = {
  metrics: ExportMetrics | null;
  showMetrics: (nextMetrics: ExportMetrics) => void;
  clearMetrics: () => void;
};

export function useExportMetrics(autoDismissMs = 3000): UseExportMetricsReturn {
  const [metrics, setMetrics] = useState<ExportMetrics | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeoutRef();
    };
  }, [clearTimeoutRef]);

  const showMetrics = useCallback(
    (nextMetrics: ExportMetrics) => {
      setMetrics(nextMetrics);
      clearTimeoutRef();
      timeoutRef.current = setTimeout(() => {
        setMetrics(null);
        timeoutRef.current = null;
      }, autoDismissMs);
    },
    [autoDismissMs, clearTimeoutRef]
  );

  const clearMetrics = useCallback(() => {
    clearTimeoutRef();
    setMetrics(null);
  }, [clearTimeoutRef]);

  return { metrics, showMetrics, clearMetrics };
}

