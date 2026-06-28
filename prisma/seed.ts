import { prisma } from "@/lib/db/prisma";

/**
 * Luxury Store database seeder.
 *
 * Creates realistic premium mock data for the MVP:
 * brands, categories, products (with images and sizes),
 * product relations ("Matches with this") and a homepage section.
 *
 * Text fields are trilingual (RU/TJ/EN). For mock data the TJ and EN values
 * are derived from the Russian value by appending " TJ" / " EN".
 *
 * The script is idempotent: it clears existing data before inserting,
 * so it can be re-run safely.
 */

// Approximate exchange rate used only to derive realistic USD prices.
const TJS_PER_USD = 11;

const toUsd = (tjs: number): number => Math.round(tjs / TJS_PER_USD);

// Trilingual mock helpers: derive TJ/EN from the Russian base string.
const nameTri = (ru: string) => ({
  nameRu: ru,
  nameTj: `${ru} TJ`,
  nameEn: `${ru} EN`,
});
const descTri = (ru: string) => ({
  descriptionRu: ru,
  descriptionTj: `${ru} TJ`,
  descriptionEn: `${ru} EN`,
});
const compTri = (ru: string) => ({
  compositionRu: ru,
  compositionTj: `${ru} TJ`,
  compositionEn: `${ru} EN`,
});
const colorTri = (ru: string) => ({
  colorRu: ru,
  colorTj: `${ru} TJ`,
  colorEn: `${ru} EN`,
});
const titleTri = (ru: string) => ({
  titleRu: ru,
  titleTj: `${ru} TJ`,
  titleEn: `${ru} EN`,
});
const subtitleTri = (ru: string) => ({
  subtitleRu: ru,
  subtitleTj: `${ru} TJ`,
  subtitleEn: `${ru} EN`,
});

async function clearDatabase() {
  // Delete in dependency order (children first) to respect foreign keys.
  await prisma.productRelation.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productSize.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.homepageSection.deleteMany();
}

async function main() {
  console.log("Seeding...");

  await clearDatabase();

  // --- Brands ---------------------------------------------------------------
  const tomFord = await prisma.brand.create({
    data: {
      name: "Tom Ford",
      slug: "tom-ford",
      ...descTri(
        "Американский люксовый бренд, известный безупречными смокингами и строгими костюмами.",
      ),
      logoUrl: "https://placehold.co/200x80?text=Tom+Ford",
    },
  });

  const brioni = await prisma.brand.create({
    data: {
      name: "Brioni",
      slug: "brioni",
      ...descTri(
        "Итальянский дом высокой мужской моды, символ ручного пошива и абсолютной роскоши.",
      ),
      logoUrl: "https://placehold.co/200x80?text=Brioni",
    },
  });

  const zegna = await prisma.brand.create({
    data: {
      name: "Ermenegildo Zegna",
      slug: "ermenegildo-zegna",
      ...descTri(
        "Легендарный итальянский бренд, создающий собственные премиальные ткани с 1910 года.",
      ),
      logoUrl: "https://placehold.co/200x80?text=Zegna",
    },
  });

  const canali = await prisma.brand.create({
    data: {
      name: "Canali",
      slug: "canali",
      ...descTri(
        "Семейный итальянский бренд элегантной мужской одежды премиум-класса.",
      ),
      logoUrl: "https://placehold.co/200x80?text=Canali",
    },
  });

  // --- Categories -----------------------------------------------------------
  const suits = await prisma.category.create({
    data: { ...nameTri("Костюмы"), slug: "suits" },
  });

  const shoes = await prisma.category.create({
    data: { ...nameTri("Обувь"), slug: "shoes" },
  });

  const accessories = await prisma.category.create({
    data: { ...nameTri("Аксессуары"), slug: "accessories" },
  });

  const watches = await prisma.category.create({
    data: { ...nameTri("Часы"), slug: "watches" },
  });

  // --- Products -------------------------------------------------------------
  const blackTuxedo = await prisma.product.create({
    data: {
      ...nameTri("Смокинг Tom Ford «Shelton»"),
      slug: "tom-ford-shelton-tuxedo",
      ...descTri(
        "Классический чёрный смокинг приталенного силуэта из шерсти с шёлковыми лацканами.",
      ),
      ...compTri("98% шерсть, 2% шёлк"),
      ...colorTri("Чёрный"),
      priceTjs: 42000,
      priceUsd: toUsd(42000),
      brandId: tomFord.id,
      categoryId: suits.id,
      isActive: true,
      isFeatured: true,
      isNew: true,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Shelton+Tuxedo+1",
            sortOrder: 0,
          },
          {
            imageUrl: "https://placehold.co/800x1000?text=Shelton+Tuxedo+2",
            sortOrder: 1,
          },
        ],
      },
      sizes: {
        create: [
          { size: "48", quantity: 2 },
          { size: "50", quantity: 3 },
          { size: "52", quantity: 1 },
          { size: "54", quantity: 0 },
        ],
      },
    },
  });

  const navySuit = await prisma.product.create({
    data: {
      ...nameTri("Костюм Brioni «Brunico»"),
      slug: "brioni-brunico-suit",
      ...descTri(
        "Тёмно-синий двубортный костюм ручной работы из тонкой итальянской шерсти.",
      ),
      ...compTri("100% шерсть Super 150's"),
      ...colorTri("Тёмно-синий"),
      priceTjs: 55000,
      priceUsd: toUsd(55000),
      brandId: brioni.id,
      categoryId: suits.id,
      isActive: true,
      isFeatured: true,
      isNew: false,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Brunico+Suit+1",
            sortOrder: 0,
          },
        ],
      },
      sizes: {
        create: [
          { size: "48", quantity: 1 },
          { size: "50", quantity: 2 },
          { size: "52", quantity: 2 },
        ],
      },
    },
  });

  const greySuit = await prisma.product.create({
    data: {
      ...nameTri("Костюм Zegna «Milano»"),
      slug: "zegna-milano-suit",
      ...descTri(
        "Светло-серый однобортный костюм из фирменной ткани High Performance.",
      ),
      ...compTri("100% шерсть Zegna High Performance"),
      ...colorTri("Серый"),
      priceTjs: 38000,
      priceUsd: toUsd(38000),
      brandId: zegna.id,
      categoryId: suits.id,
      isActive: true,
      isFeatured: false,
      isNew: true,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Milano+Suit+1",
            sortOrder: 0,
          },
        ],
      },
      sizes: {
        create: [
          { size: "50", quantity: 4 },
          { size: "52", quantity: 2 },
          { size: "54", quantity: 1 },
        ],
      },
    },
  });

  const oxfordShoes = await prisma.product.create({
    data: {
      ...nameTri("Туфли-оксфорды Tom Ford «Elkan»"),
      slug: "tom-ford-elkan-oxfords",
      ...descTri(
        "Чёрные оксфорды из телячьей кожи с зеркальной полировкой, ручная сборка.",
      ),
      ...compTri("100% телячья кожа"),
      ...colorTri("Чёрный"),
      priceTjs: 18000,
      priceUsd: toUsd(18000),
      brandId: tomFord.id,
      categoryId: shoes.id,
      isActive: true,
      isFeatured: true,
      isNew: false,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Elkan+Oxfords+1",
            sortOrder: 0,
          },
        ],
      },
      sizes: {
        create: [
          { size: "41", quantity: 2 },
          { size: "42", quantity: 3 },
          { size: "43", quantity: 2 },
          { size: "44", quantity: 1 },
        ],
      },
    },
  });

  const derbyShoes = await prisma.product.create({
    data: {
      ...nameTri("Туфли-дерби Canali"),
      slug: "canali-derby-shoes",
      ...descTri("Коричневые дерби из кожи с фактурой, удобная кожаная подошва."),
      ...compTri("100% натуральная кожа"),
      ...colorTri("Коричневый"),
      priceTjs: 14000,
      priceUsd: toUsd(14000),
      brandId: canali.id,
      categoryId: shoes.id,
      isActive: true,
      isFeatured: false,
      isNew: false,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Canali+Derby+1",
            sortOrder: 0,
          },
        ],
      },
      sizes: {
        create: [
          { size: "42", quantity: 2 },
          { size: "43", quantity: 2 },
          { size: "44", quantity: 0 },
        ],
      },
    },
  });

  const leatherBelt = await prisma.product.create({
    data: {
      ...nameTri("Ремень Brioni из кожи аллигатора"),
      slug: "brioni-alligator-belt",
      ...descTri(
        "Чёрный ремень из кожи аллигатора с фирменной пряжкой из палладия.",
      ),
      ...compTri("100% кожа аллигатора"),
      ...colorTri("Чёрный"),
      priceTjs: 12000,
      priceUsd: toUsd(12000),
      brandId: brioni.id,
      categoryId: accessories.id,
      isActive: true,
      isFeatured: false,
      isNew: true,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Brioni+Belt+1",
            sortOrder: 0,
          },
        ],
      },
      sizes: {
        create: [
          { size: "95", quantity: 3 },
          { size: "100", quantity: 2 },
          { size: "105", quantity: 1 },
        ],
      },
    },
  });

  const silkTie = await prisma.product.create({
    data: {
      ...nameTri("Галстук Zegna из шёлка"),
      slug: "zegna-silk-tie",
      ...descTri("Тёмно-синий галстук из плотного шёлка жаккардового плетения."),
      ...compTri("100% шёлк"),
      ...colorTri("Тёмно-синий"),
      priceTjs: 11500,
      priceUsd: toUsd(11500),
      brandId: zegna.id,
      categoryId: accessories.id,
      isActive: true,
      isFeatured: false,
      isNew: false,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Zegna+Tie+1",
            sortOrder: 0,
          },
        ],
      },
      sizes: {
        create: [{ size: "One Size", quantity: 8 }],
      },
    },
  });

  const dressWatch = await prisma.product.create({
    data: {
      ...nameTri("Часы Canali «Classic»"),
      slug: "canali-classic-watch",
      ...descTri(
        "Классические часы с корпусом из нержавеющей стали и кожаным ремешком.",
      ),
      ...compTri("Нержавеющая сталь, сапфировое стекло, кожаный ремешок"),
      ...colorTri("Серебристый"),
      priceTjs: 25000,
      priceUsd: toUsd(25000),
      brandId: canali.id,
      categoryId: watches.id,
      isActive: true,
      isFeatured: true,
      isNew: true,
      images: {
        create: [
          {
            imageUrl: "https://placehold.co/800x1000?text=Canali+Watch+1",
            sortOrder: 0,
          },
        ],
      },
      sizes: {
        create: [{ size: "One Size", quantity: 4 }],
      },
    },
  });

  // --- Product relations ("Matches with this") ------------------------------
  // The black tuxedo is matched with oxford shoes and an alligator belt.
  await prisma.productRelation.createMany({
    data: [
      { productId: blackTuxedo.id, relatedProductId: oxfordShoes.id },
      { productId: blackTuxedo.id, relatedProductId: leatherBelt.id },
      { productId: blackTuxedo.id, relatedProductId: dressWatch.id },
      // The navy Brioni suit is matched with a silk tie and derby shoes.
      { productId: navySuit.id, relatedProductId: silkTie.id },
      { productId: navySuit.id, relatedProductId: derbyShoes.id },
    ],
  });

  // --- Homepage section -----------------------------------------------------
  await prisma.homepageSection.create({
    data: {
      sectionKey: "hero",
      ...titleTri("Luxury Store"),
      ...subtitleTri("Премиальный мужской бутик. Костюмы, обувь и аксессуары."),
      imageUrl: "https://placehold.co/1920x1080?text=Luxury+Store+Hero",
      isActive: true,
    },
  });

  // --- Summary --------------------------------------------------------------
  const [brandCount, categoryCount, productCount, relationCount] =
    await Promise.all([
      prisma.brand.count(),
      prisma.category.count(),
      prisma.product.count(),
      prisma.productRelation.count(),
    ]);

  console.log(
    `Seed complete: ${brandCount} brands, ${categoryCount} categories, ` +
      `${productCount} products, ${relationCount} relations.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
