export type AdminNavItem = {
  label: string;
  href: string;
};

// Nav destinations for the admin sidebar. Non-dashboard links currently 404 —
// they light up in session 2 (CRUD tables) and session 3 (image upload +
// homepage editor). Listed here so the sidebar and the dashboard's "quick jump"
// grid stay in sync.
export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { label: "Дашборд", href: "/admin" },
  { label: "Товары", href: "/admin/products" },
  { label: "Бренды", href: "/admin/brands" },
  { label: "Категории", href: "/admin/categories" },
  { label: "Главная", href: "/admin/homepage" },
  { label: "Баннеры категорий", href: "/admin/category-banners" },
];
