import { SignUpForm } from "@/components/auth/signup-form"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "auth" })

  return {
    title: t("signupTitle"),
    description: t("signupSubtitle"),
  }
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <SignUpForm />
      </div>
    </div>
  )
}
