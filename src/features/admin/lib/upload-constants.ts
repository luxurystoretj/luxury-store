// Shared client-side mirror of the server-side upload limits (see the R2 upload route
// handlers under src/app/api/admin/product-images and src/app/api/admin/category-banners).
// Centralized so every admin upload widget rejects bad files identically, before any
// network round-trip.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
