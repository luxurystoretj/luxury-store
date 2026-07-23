// Owner-supplied dictionary (2026-07-08, trimmed 2026-07-21). `value` is the
// exact `colorRu` string sent as-is to the API's `color` query param
// (case-insensitive contains across colorRu/Tj/En) — seed data's own
// colorEn/colorTj are mock placeholders, not real translations, so EN labels
// must live here instead. Trimmed from the original 50-value list to the 10
// most common menswear colors (owner request, filter list was overwhelming).
export interface ColorOption {
  value: string
  labelEn: string
}

export const colorOptions: ColorOption[] = [
  { value: "Чёрный", labelEn: "Black" },
  { value: "Белый", labelEn: "White" },
  { value: "Серый", labelEn: "Grey" },
  { value: "Тёмно-синий", labelEn: "Dark Blue" },
  { value: "Синий", labelEn: "Blue" },
  { value: "Коричневый", labelEn: "Brown" },
  { value: "Бежевый", labelEn: "Beige" },
  { value: "Хаки", labelEn: "Khaki" },
  { value: "Бордовый", labelEn: "Burgundy" },
  { value: "Зелёный", labelEn: "Green" },
]
