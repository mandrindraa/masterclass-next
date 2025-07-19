"use client"

import { useRouter, usePathname, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { useTranslations } from "next-intl"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const t = useTranslations("language")

  const switchLanguage = (locale: string) => {
    // Extract current locale from pathname
    const currentLocale = params.locale as string
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`)
    router.push(newPathname)
  }

  const currentLocale = params.locale as string

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Languages className="h-4 w-4 mr-2" />
          {currentLocale === "fr" ? "FR" : "EN"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("en")} disabled={currentLocale === "en"}>
          🇺🇸 {t("english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("fr")} disabled={currentLocale === "fr"}>
          🇫🇷 {t("french")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
