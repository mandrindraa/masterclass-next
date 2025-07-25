import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
const locales = ["en", "fr"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // Use default locale instead of notFound()
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
