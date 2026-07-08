// Owner-supplied dictionary (2026-07-08). `value` is the exact `colorRu` string
// sent as-is to the API's `color` query param (case-insensitive contains across
// colorRu/Tj/En) — seed data's own colorEn/colorTj are mock placeholders, not
// real translations, so EN labels must live here instead. Only 5 of these 50
// values exist in the current seed data; the rest render as filter options with
// zero current matches until more products are added.
export interface ColorOption {
  value: string
  labelEn: string
}

export const colorOptions: ColorOption[] = [
  // Neutrals
  { value: "Чёрный", labelEn: "Black" },
  { value: "Белый", labelEn: "White" },
  { value: "Серый", labelEn: "Grey" },
  { value: "Тёмно-серый", labelEn: "Dark Grey" },
  { value: "Светло-серый", labelEn: "Light Grey" },
  { value: "Антрацит", labelEn: "Anthracite" },
  { value: "Графитовый", labelEn: "Graphite" },
  { value: "Бежевый", labelEn: "Beige" },
  { value: "Кремовый", labelEn: "Cream" },
  { value: "Слоновая кость", labelEn: "Ivory" },
  // Browns & earth tones
  { value: "Коричневый", labelEn: "Brown" },
  { value: "Тёмно-коричневый", labelEn: "Dark Brown" },
  { value: "Светло-коричневый", labelEn: "Light Brown" },
  { value: "Табачный", labelEn: "Tobacco" },
  { value: "Хаки", labelEn: "Khaki" },
  { value: "Оливковый", labelEn: "Olive" },
  { value: "Песочный", labelEn: "Sand" },
  { value: "Верблюжий", labelEn: "Camel" },
  { value: "Шоколадный", labelEn: "Chocolate" },
  { value: "Коньячный", labelEn: "Cognac" },
  // Blues
  { value: "Синий", labelEn: "Blue" },
  { value: "Тёмно-синий", labelEn: "Dark Blue" },
  { value: "Тёмно-синий морской", labelEn: "Navy" },
  { value: "Голубой", labelEn: "Sky Blue" },
  { value: "Индиго", labelEn: "Indigo" },
  { value: "Кобальтовый", labelEn: "Cobalt" },
  { value: "Стальной синий", labelEn: "Steel Blue" },
  // Greens
  { value: "Зелёный", labelEn: "Green" },
  { value: "Тёмно-зелёный", labelEn: "Dark Green" },
  { value: "Хвойный", labelEn: "Pine" },
  { value: "Болотный", labelEn: "Swamp Green" },
  { value: "Оливково-зелёный", labelEn: "Olive Green" },
  { value: "Хаки-зелёный", labelEn: "Khaki Green" },
  // Reds & burgundies
  { value: "Бордовый", labelEn: "Burgundy" },
  { value: "Тёмно-красный", labelEn: "Dark Red" },
  { value: "Красный", labelEn: "Red" },
  { value: "Терракотовый", labelEn: "Terracotta" },
  // Other accents
  { value: "Жёлтый", labelEn: "Yellow" },
  { value: "Горчичный", labelEn: "Mustard" },
  { value: "Оранжевый", labelEn: "Orange" },
  { value: "Ржавый", labelEn: "Rust" },
  { value: "Фиолетовый", labelEn: "Purple" },
  { value: "Розовый", labelEn: "Pink" },
  { value: "Пудровый", labelEn: "Powder Pink" },
  // Metallics
  { value: "Золотой", labelEn: "Gold" },
  { value: "Серебряный", labelEn: "Silver" },
  { value: "Бронзовый", labelEn: "Bronze" },
  // Composite / multicolor
  { value: "Многоцветный", labelEn: "Multicolor" },
  { value: "Клетка", labelEn: "Check" },
  { value: "Полоска", labelEn: "Stripe" },
]
