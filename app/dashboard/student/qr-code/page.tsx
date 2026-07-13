import { Card } from "@/components/ui/card";
import {NavTitle} from "@/components/ui/nav-title";

export default function QRCodePage() {
  return (
    <div className="space-y-6">
      <NavTitle h1="My QR Code" h2="Your student identification badge" />

      <Card className="bg-slate-900 border-slate-800 p-6 flex flex-col items-center justify-center min-h-96">
        <p className="text-slate-400">Your QR code will be displayed here</p>
      </Card>
    </div>
  );
}
