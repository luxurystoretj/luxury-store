// Russian display labels for the fixed homepage section keys (hero/about/contacts). Admin UI
// is Russian-only. Falls back to the raw sectionKey for any unexpected key.
const HOMEPAGE_SECTION_LABELS: Record<string, string> = {
  hero: "Главный экран",
  about: "О бренде",
  contacts: "Контакты",
};

export function homepageSectionLabel(sectionKey: string): string {
  return HOMEPAGE_SECTION_LABELS[sectionKey] ?? sectionKey;
}
