import { getTranslations } from "next-intl/server"

// Static placeholder — real coordinates aren't available yet. Isolated in its
// own file so swapping to a real embed later is a one-file change.
async function ContactsMap() {
  const t = await getTranslations("Contacts")

  return (
    <div className="flex aspect-square w-full items-center justify-center bg-surface text-center text-sm text-foreground lg:aspect-auto lg:h-full lg:min-h-[320px]">
      {t("map.caption")}
    </div>
  )
}

export { ContactsMap }
