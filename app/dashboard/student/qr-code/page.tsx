import { auth } from "@/auth";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

export default async function QRCodePage() {
  const session = await auth();
  if (!session || session.user?.role !== Role.STUDENT || !session.user.id)
    redirect("/dashboard");
  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: { class: true },
  });
  if (!student) redirect("/profile");
  const qrDataUrl = await QRCode.toDataURL(student.studentCode, {
    margin: 2,
    width: 320,
  });
  return (
    <div className="space-y-6">
      <NavTitle h1="My QR Code" h2="Your student identification badge" />
      <div className="flex flex-col items-center gap-5 rounded-lg border border-border bg-card p-4 sm:p-8">
        <div className="w-full max-w-80 rounded-lg bg-background p-2 sm:p-4">
          <Image
            src={qrDataUrl}
            alt={`QR code for ${student.studentCode}`}
            width={320}
            height={320}
            className="h-auto w-full"
            unoptimized
          />
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-foreground">
            {student.firstName} {student.lastName}
          </p>
          <p className="mt-1 font-mono text-foreground">
            {student.studentCode}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{student.class.name}</p>
        </div>
        <a
          href={qrDataUrl}
          download={`${student.studentCode}-qr.png`}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Download QR code
        </a>
      </div>
    </div>
  );
}
