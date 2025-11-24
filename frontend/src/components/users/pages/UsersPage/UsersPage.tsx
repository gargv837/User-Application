import { useReducer, useState, useEffect, useRef } from "react";
import {
  useUsersQuery,
  useUsersHandlers,
  useUsersDerived,
  reducer,
  initialState,
} from "../../hooks";
import { PageTemplate } from "../../templates";
import {
  UserForm,
  DataTable,
  PaginationControls,
  Modal,
} from "../../organisms";
import { SearchBar } from "../../molecules";
import { Text, Button, ExportTimer, ExportStats } from "../../atoms";
import "../../styles/Users.css";
import { exportUsersStream } from "../../../../api/users";

export default function UsersPage() {
  const [{ editId, page, limit, search }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [exportTimer, setExportTimer] = useState<number | null>(null);
  const [exportMetrics, setExportMetrics] = useState<{
    totalDuration: number;
    phases?: {
      fetch: number;
      downloadSetup: number;
    };
  } | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const metricsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { data, isLoading, isError } = useUsersQuery(page, limit, search);
  const { users, total, editingUser } = useUsersDerived(data, editId);
  const { onSubmit, handleDelete } = useUsersHandlers(editId, dispatch);

  // Updated to use phonenumber
  const handleAddSubmit = async (values: { phonenumber: string }) => {
    await onSubmit(values);
    setAddModalOpen(false);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (metricsTimeoutRef.current) {
        clearTimeout(metricsTimeoutRef.current);
      }
    };
  }, []);

  // Auto-dismiss export metrics after 3 seconds
  useEffect(() => {
    if (exportMetrics && !isExportLoading) {
      // Clear any existing timeout
      if (metricsTimeoutRef.current) {
        clearTimeout(metricsTimeoutRef.current);
      }
      
      // Set new timeout to clear metrics after 3 seconds
      metricsTimeoutRef.current = setTimeout(() => {
        setExportMetrics(null);
        metricsTimeoutRef.current = null;
      }, 5000);
    }
    
    return () => {
      if (metricsTimeoutRef.current) {
        clearTimeout(metricsTimeoutRef.current);
      }
    };
  }, [exportMetrics, isExportLoading]);

  const handleExport = async () => {
    const startTime = performance.now();
    startTimeRef.current = startTime;
    setIsExportLoading(true);
    setExportTimer(0);
    setExportMetrics(null);
    
    // Clear any existing metrics timeout
    if (metricsTimeoutRef.current) {
      clearTimeout(metricsTimeoutRef.current);
      metricsTimeoutRef.current = null;
    }
    
    // Start live timer
    timerIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = performance.now() - startTimeRef.current;
        setExportTimer(elapsed);
      }
    }, 10); // Update every 10ms for smooth display
    
    try {
      const performanceMetrics = await exportUsersStream();
      const endTime = performance.now();
      const totalDuration = endTime - startTime;
      
      // Clear interval and set final metrics
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      setExportMetrics({
        totalDuration,
        phases: {
          fetch: performanceMetrics.fetchDuration,
          downloadSetup: performanceMetrics.downloadSetupDuration,
        },
      });
      setExportTimer(null);
      
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
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Clear interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      
      setExportMetrics({
        totalDuration: duration,
      });
      setExportTimer(null);
      
      console.error("Export failed:", error);
      console.log("Export Performance (Failed):", {
        totalDuration: `${duration.toFixed(2)}ms`,
        totalDurationSeconds: `${(duration / 1000).toFixed(2)}s`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsExportLoading(false);
      startTimeRef.current = null;
    }
  };

  return (
    <div className="users-container">
      <PageTemplate title="Users">
        <SearchBar
          value={search}
          onResetToFirstPage={() => dispatch({ type: "setPage", page: 1 })}
          onChange={(value) => dispatch({ type: "setSearch", search: value })}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Button onClick={handleExport}>Export</Button>
          <Button onClick={() => setAddModalOpen(true)}>Add User</Button>
        </div>

        {(isLoading || isExportLoading) && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Text>Loading...</Text>
            {isExportLoading && exportTimer !== null && (
              <ExportTimer elapsedTime={exportTimer} />
            )}
          </div>
        )}
        {isError && <Text variant="error">Failed to load users.</Text>}
        {exportMetrics && !isExportLoading && (
          <ExportStats
            totalDuration={exportMetrics.totalDuration}
            phases={exportMetrics.phases}
          />
        )}

        <DataTable
          users={users}
          onEdit={(u) => dispatch({ type: "setEditId", id: u.id })}
          onDelete={handleDelete}
        />

        <PaginationControls
          page={page}
          limit={limit}
          total={total}
          onPageChange={(p) => dispatch({ type: "setPage", page: p })}
          onLimitChange={(l) => dispatch({ type: "setLimit", limit: l })}
        />
      </PageTemplate>

      {/* Add Modal */}
      <Modal
        open={isAddModalOpen}
        title="Add User"
        onClose={() => setAddModalOpen(false)}
      >
        <UserForm
          editingUser={null}
          onSubmit={handleAddSubmit}
          onCancelEdit={() => setAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={Boolean(editingUser)}
        title="Edit User"
        onClose={() => dispatch({ type: "setEditId", id: null })}
      >
        <UserForm
          editingUser={editingUser}
          onSubmit={onSubmit}
          onCancelEdit={() => {
            dispatch({ type: "setEditId", id: null });
          }}
        />
      </Modal>
    </div>
  );
}
