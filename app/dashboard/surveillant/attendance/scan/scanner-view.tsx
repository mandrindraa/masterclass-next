"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, CheckCircle2, Loader2, LogOut, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface AttendanceRecord {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  status: string;
}

interface ScannerViewProps {
  sessionId: string;
  isClosed: boolean;
  initialRecords: AttendanceRecord[];
}

export function ScannerView({
  sessionId,
  isClosed,
  initialRecords,
}: ScannerViewProps) {
  const router = useRouter();
  const scannerRef = useRef<{
    stop: () => Promise<void>;
    clear: () => void;
  } | null>(null);
  const [records, setRecords] = useState(initialRecords);
  const [studentCode, setStudentCode] = useState("");
  const [message, setMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isClosed) return;
    let active = true;

    async function startCamera() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!active) return;
        const scanner = new Html5Qrcode("attendance-reader");
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => recordAttendance(decodedText),
          () => undefined,
        );
        if (active) setIsScanning(true);
      } catch {
        if (active)
          setMessage("Camera unavailable. Enter a student code below instead.");
      }
    }

    void startCamera();
    return () => {
      active = false;
      const scanner = scannerRef.current;
      if (scanner)
        void scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => undefined);
    };
    // Scanner initialization is intentionally tied to this session only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosed, sessionId]);

  async function recordAttendance(code: string) {
    const normalizedCode = code.trim();
    if (
      !normalizedCode ||
      records.some((record) => record.studentCode === normalizedCode)
    )
      return;

    const response = await fetch("/api/attendance/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, studentCode: normalizedCode }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Unable to record this student.");
      return;
    }

    setRecords((current) => [
      {
        id: data.id,
        firstName: data.student.firstName,
        lastName: data.student.lastName,
        studentCode: data.student.studentCode,
        status: data.status,
      },
      ...current,
    ]);
    setStudentCode("");
    setMessage(
      `${data.student.firstName} ${data.student.lastName} marked present.`,
    );
  }

  async function closeSession() {
    setIsClosing(true);
    const response = await fetch(
      `/api/attendance/sessions/${sessionId}/close`,
      { method: "PATCH" },
    );
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || "Unable to close session.");
      setIsClosing(false);
      return;
    }
    router.push("/dashboard/surveillant/attendance");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card className="border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">QR scanner</h2>
            <p className="text-sm text-slate-400">
              Scan each student card to mark them present.
            </p>
          </div>
          <Camera className="h-5 w-5 text-emerald-400" />
        </div>
        <div
          id="attendance-reader"
          className="min-h-64 overflow-hidden rounded-lg border border-dashed border-slate-700 bg-slate-950"
        />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void recordAttendance(studentCode);
          }}
          className="mt-4 flex gap-2"
        >
          <input
            value={studentCode}
            onChange={(event) => setStudentCode(event.target.value)}
            placeholder="Enter student code"
            disabled={isClosed}
            className="h-10 min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500"
          />
          <Button type="submit" disabled={isClosed || !studentCode.trim()}>
            <ScanLine className="mr-2 h-4 w-4" />
            Record
          </Button>
        </form>
        <p role="status" className="mt-3 min-h-5 text-sm text-slate-400">
          {message || (isScanning ? "Camera is ready." : "Starting camera...")}
        </p>
      </Card>

      <Card className="border-slate-800 bg-slate-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-white">Scanned students</h2>
            <p className="text-sm text-slate-400">{records.length} recorded</p>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between rounded-md bg-slate-800/60 px-3 py-2"
            >
              <div>
                <p className="text-sm text-white">
                  {record.firstName} {record.lastName}
                </p>
                <p className="text-xs text-slate-400">{record.studentCode}</p>
              </div>
              <span className="text-xs text-emerald-400">Present</span>
            </div>
          ))}
          {records.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              No students scanned yet.
            </p>
          )}
        </div>
        <Button
          onClick={() => void closeSession()}
          disabled={isClosed || isClosing}
          className="mt-6 w-full"
          variant="secondary"
        >
          {isClosing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Close session
        </Button>
      </Card>
    </div>
  );
}
