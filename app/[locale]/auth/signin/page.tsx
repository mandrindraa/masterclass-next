import { SignInForm } from "@/components/auth/signin-form"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "auth" })

  return {
    title: t("signinTitle"),
    description: t("signinSubtitle"),
  }
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <SignInForm />
      </div>
    </div>
  )
}
