import { useState, useRef, useCallback, useEffect } from "react";

type UseExportTimerReturn = {
  elapsed: number | null;
  startTimer: () => number;
  stopTimer: () => number | null;
  resetTimer: () => void;
};

export function useExportTimer(updateInterval = 10): UseExportTimerReturn {
  const [elapsed, setElapsed] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const clearIntervalRef = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearIntervalRef();
    };
  }, [clearIntervalRef]);

  const startTimer = useCallback(() => {
    const startTime = performance.now();
    startTimeRef.current = startTime;
    setElapsed(0);

    clearIntervalRef();
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        setElapsed(performance.now() - startTimeRef.current);
      }
    }, updateInterval);

    return startTime;
  }, [clearIntervalRef, updateInterval]);

  const stopTimer = useCallback(() => {
    const startTime = startTimeRef.current;
    clearIntervalRef();
    startTimeRef.current = null;
    setElapsed(null);

    if (startTime === null) {
      return null;
    }

    return performance.now() - startTime;
  }, [clearIntervalRef]);

  const resetTimer = useCallback(() => {
    clearIntervalRef();
    startTimeRef.current = null;
    setElapsed(null);
  }, [clearIntervalRef]);

  return { elapsed, startTimer, stopTimer, resetTimer };
}

