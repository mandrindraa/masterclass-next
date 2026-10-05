"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavTitle } from "@/components/ui/nav-title";
import { AlertCircle, Bell, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AbsenceAlertItem {
  id: string;
  sentAt: string;
  acknowledged: boolean;
  student: {
    firstName: string;
    lastName: string;
    studentCode: string;
    class: { name: string };
  };
  attendanceRecord: {
    attendanceSession: {
      date: string;
      slot: string;
      period: { label: string };
    };
  };
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AbsenceAlertItem[]>([]);
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAlerts() {
      try {
        const response = await fetch("/api/alerts");
        if (!response.ok) throw new Error("Unable to load absence alerts.");
        const data: AbsenceAlertItem[] = await response.json();
        if (!cancelled) setAlerts(data);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load absence alerts.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAlerts();
    return () => {
      cancelled = true;
    };
  }, []);

  async function acknowledgeAlert(id: string) {
    setPendingId(id);
    setError("");
    try {
      const response = await fetch(`/api/alerts/${id}/ack`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "Unable to acknowledge this alert.");
      }
      const updated: AbsenceAlertItem = await response.json();
      setAlerts((current) =>
        current.map((alert) => (alert.id === updated.id ? updated : alert)),
      );
    } catch (acknowledgeError) {
      setError(
        acknowledgeError instanceof Error
          ? acknowledgeError.message
          : "Unable to acknowledge this alert.",
      );
    } finally {
      setPendingId(null);
    }
  }

  const visibleAlerts = alerts.filter(
    (alert) => alert.acknowledged === showAcknowledged,
  );

  return (
    <div className="space-y-6">
      <NavTitle
        h1="Absence Alerts"
        h2="Review absences recorded when attendance sessions close"
      />

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Alert status"
      >
        <Button
          type="button"
          variant={showAcknowledged ? "outline" : "default"}
          aria-pressed={!showAcknowledged}
          onClick={() => setShowAcknowledged(false)}
        >
          Needs review
          <span className="ml-1 tabular-nums">
            {alerts.filter((alert) => !alert.acknowledged).length}
          </span>
        </Button>
        <Button
          type="button"
          variant={showAcknowledged ? "default" : "outline"}
          aria-pressed={showAcknowledged}
          onClick={() => setShowAcknowledged(true)}
        >
          Acknowledged
          <span className="ml-1 tabular-nums">
            {alerts.filter((alert) => alert.acknowledged).length}
          </span>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading alerts
        </div>
      ) : visibleAlerts.length === 0 ? (
        <Card className="items-center px-6 py-12 text-center">
          <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {showAcknowledged ? (
              <Check className="size-5" aria-hidden="true" />
            ) : (
              <Bell className="size-5" aria-hidden="true" />
            )}
          </div>
          <p className="font-medium text-foreground">
            {showAcknowledged ? "No acknowledged alerts" : "All caught up"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {showAcknowledged
              ? "Acknowledged absence alerts will appear here."
              : "There are no absence alerts to review."}
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visibleAlerts.map((alert) => {
            const session = alert.attendanceRecord.attendanceSession;
            const date = new Date(session.date).toLocaleDateString();

            return (
              <li key={alert.id}>
                <Card className="gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold text-foreground">
                      {alert.student.firstName} {alert.student.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {alert.student.studentCode}{" "}
                      <span aria-hidden="true">·</span>{" "}
                      {alert.student.class.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Absent {date} <span aria-hidden="true">·</span>{" "}
                      {session.slot.toLowerCase()}{" "}
                      <span aria-hidden="true">·</span> {session.period.label}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      disabled={pendingId === alert.id}
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      {pendingId === alert.id ? (
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Check className="size-4" aria-hidden="true" />
                      )}
                      Acknowledge
                    </Button>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
