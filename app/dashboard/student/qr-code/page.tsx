import { Card } from "@/components/ui/card";

export default function QRCodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My QR Code</h1>
        <p className="text-slate-400 mt-1">Your student identification badge</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6 flex flex-col items-center justify-center min-h-96">
        <p className="text-slate-400">Your QR code will be displayed here</p>
      </Card>
    </div>
  );
}
