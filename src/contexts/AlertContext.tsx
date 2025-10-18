import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { AlertFloating } from "@/components/application/alerts/alerts";

interface Alert {
  id: string;
  title: string;
  description: ReactNode;
  color?: "default" | "brand" | "gray" | "error" | "warning" | "success";
  confirmLabel?: string;
  dismissLabel?: string;
  onConfirm?: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

interface AlertContextType {
  showAlert: (alert: Omit<Alert, "id">) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (alert: Omit<Alert, "id">) => {
    const id = Math.random().toString(36).substring(7);
    const autoDismiss = alert.autoDismiss ?? !alert.onConfirm; // Auto-dismiss by default if no confirm action
    const duration = alert.duration ?? 5000; // Default 5 seconds

    setAlerts((prev) => [...prev, { ...alert, id, autoDismiss, duration }]);

    // Auto-dismiss after duration
    if (autoDismiss) {
      setTimeout(() => {
        hideAlert(id);
      }, duration);
    }
  };

  const hideAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-auto max-w-md">
        {alerts.map((alert) => (
          <AlertFloating
            key={alert.id}
            title={alert.title}
            description={alert.description}
            color={alert.color}
            confirmLabel={alert.confirmLabel}
            dismissLabel={alert.dismissLabel}
            onClose={() => hideAlert(alert.id)}
            onConfirm={alert.onConfirm ? () => {
              alert.onConfirm?.();
              hideAlert(alert.id);
            } : undefined}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
