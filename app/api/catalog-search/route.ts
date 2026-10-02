import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MARKETPLACE_ID = "ATVPDKIKX0DER";
const SP_API_BASE = "https://sellingpartnerapi-na.amazon.com";
const USER_AGENT = "SellBookMedia/1.0 (Language=TypeScript)";

let cachedToken: {
  value: string;
  expiresAtMs: number;
} | null = null;

type SearchCategory = "book" | "movie" | "cd" | "game";

type SelectedIdentifier = {
  type: string;
  value: string;
};

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && cachedToken.expiresAtMs > now + 60_000) {
    return cachedToken.value;
  }

  const clientId = process.env.AMAZON_LWA_CLIENT_ID;
  const clientSecret = process.env.AMAZON_LWA_CLIENT_SECRET;
  const refreshToken = process.env.AMAZON_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Amazon SP-API environment variables are missing.");
  }

  const response = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.access_token) {
    throw new Error("Unable to get Amazon access token.");
  }

  const expiresInSeconds = Number(data.expires_in) || 3600;

  cachedToken = {
    value: data.access_token,
    expiresAtMs: Date.now() + expiresInSeconds * 1000,
  };

  return cachedToken.value;
}

function classifyProduct(
  productTypeRaw: string,
  titleRaw: string
): SearchCategory | null {
  const productType = String(productTypeRaw || "").toUpperCase();
  const title = String(titleRaw || "").toUpperCase();

  // Digital-only urunleri arama sonucuna sokma.
  if (
    productType.includes("DOWNLOAD") ||
    productType.includes("DIGITAL") ||
    productType.includes("STREAMING") ||
    productType.includes("KINDLE")
  ) {
    return null;
  }

  if (
    productType.includes("BOOK") ||
    productType === "ABIS_BOOK"
  ) {
    return "book";
  }

  if (
    productType.includes("PHYSICAL_MOVIE") ||
    productType.includes("VIDEO_DVD") ||
    productType.includes("DVD") ||
    productType.includes("BLU_RAY") ||
    productType.includes("BLURAY") ||
    productType.includes("MOVIE")
  ) {
    return "movie";
  }

  if (
    productType.includes("AUDIO_CD") ||
    productType.includes("MUSIC_ALBUM") ||
    productType === "ABIS_MUSIC" ||
    productType === "MUSIC"
  ) {
    return "cd";
  }

  if (
    productType.includes("VIDEO_GAME") ||
    productType.includes("VIDEOGAME") ||
    productType.includes("CONSOLE_VIDEO") ||
    productType.includes("GAME_SOFTWARE")
  ) {
    return "game";
  }

  // Bazi eski catalog kayitlarinda product type genel olabilir.
  // Sadece acik fiziksel medya ibaresi varsa yardimci fallback.
  if (
    productType === "PRODUCT" &&
    (
      title.includes("[DVD]") ||
      title.includes("(DVD)") ||
      title.includes("BLU-RAY") ||
      title.includes("BLURAY")
    )
  ) {
    return "movie";
  }

  return null;
}

function getFormatLabel(
  category: SearchCategory,
  productTypeRaw: string,
  titleRaw: string
) {
  const productType = String(productTypeRaw || "").toUpperCase();
  const title = String(titleRaw || "").toUpperCase();

  if (category === "book") return "Book";
  if (category === "cd") return "CD";
  if (category === "game") return "Video Game";

  if (
    title.includes("4K") ||
    title.includes("UHD") ||
    productType.includes("4K")
  ) {
    return "4K UHD";
  }

  if (
    title.includes("BLU-RAY") ||
    title.includes("BLURAY") ||
    productType.includes("BLU_RAY") ||
    productType.includes("BLURAY")
  ) {
    return "Blu-ray";
  }

  if (
    title.includes("DVD") ||
    productType.includes("DVD")
  ) {
    return "DVD";
  }

  return "Movie";
}

function getIdentifiers(item: any) {
  const groups = Array.isArray(item?.identifiers)
    ? item.identifiers
    : [];

  return groups.flatMap((group: any) =>
    Array.isArray(group?.identifiers)
      ? group.identifiers
      : []
  );
}

function selectIdentifier(
  item: any,
  category: SearchCategory
): SelectedIdentifier | null {
  const identifiers = getIdentifiers(item)
    .map((identifier: any) => ({
      type: String(identifier?.identifierType || "").toUpperCase(),
      value: String(identifier?.identifier || "")
        .replace(/[^a-zA-Z0-9X]/gi, "")
        .trim()
        .toUpperCase(),
    }))
    .filter((identifier: SelectedIdentifier) => identifier.value);

  // Kitaplarda ISBN'i tercih et.
  if (category === "book") {
    for (const type of ["ISBN", "EAN", "GTIN", "UPC"]) {
      const match = identifiers.find(
        (identifier: SelectedIdentifier) =>
          identifier.type === type
      );

      if (match) return match;
    }

    return null;
  }

  // DVD / Blu-ray / CD / Game:
  // ISBN kullanmiyoruz. Fiziksel urun barkodunu istiyoruz.
  for (const type of ["UPC", "EAN", "GTIN"]) {
    const match = identifiers.find(
      (identifier: SelectedIdentifier) =>
        identifier.type === type
    );

    if (match) return match;
  }

  return null;
}

function getImage(item: any) {
  const imageGroups = Array.isArray(item?.images)
    ? item.images
    : [];

  for (const group of imageGroups) {
    const images = Array.isArray(group?.images)
      ? group.images
      : [];

    const main =
      images.find((image: any) => image?.variant === "MAIN") ||
      images[0];

    if (main?.link) {
      return String(main.link);
    }
  }

  return "";
}

async function verifyWithKeepa(code: string) {
  const apiKey = process.env.KEEPA_API_KEY;

  if (!apiKey) {
    throw new Error("KEEPA_API_KEY is missing.");
  }

  const url = new URL("https://api.keepa.com/product");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("domain", "1");
  url.searchParams.set("code", code);
  url.searchParams.set("stats", "1");
  url.searchParams.set("history", "0");
  url.searchParams.set("update", "24");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json().catch(() => null);
    const products = Array.isArray(data?.products)
      ? data.products
      : [];

    // Ghost/stale catalog sonucunu gostermemek icin
    // Keepa'da urun + gecerli current sales rank ariyoruz.
    return products.some((product: any) => {
      const salesRank = Number(product?.stats?.current?.[3]);
      return Number.isFinite(salesRank) && salesRank > 0;
    });
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function searchAmazon(query: string, accessToken: string) {
  const url = new URL(
    `${SP_API_BASE}/catalog/2022-04-01/items`
  );

  url.searchParams.set("marketplaceIds", MARKETPLACE_ID);
  url.searchParams.set("keywords", query);
  url.searchParams.set(
    "includedData",
    "identifiers,images,productTypes,summaries"
  );
  url.searchParams.set("pageSize", "20");
  url.searchParams.set("keywordsLocale", "en_US");

  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "x-amz-access-token": accessToken,
        "user-agent": USER_AGENT,
      },
      cache: "no-store",
    });

    if (
      (response.status === 429 || response.status === 503) &&
      attempt < 2
    ) {
      await sleep(650 * (attempt + 1));
      continue;
    }

    const data = await response.json().catch(() => null);

    return {
      response,
      data,
    };
  }

  throw new Error("Amazon catalog search failed.");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const query = String(body?.query || "").trim();

    if (query.length < 2 || query.length > 120) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid title.",
        },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();
    const { response, data } = await searchAmazon(
      query,
      accessToken
    );

    if (!response.ok) {
      console.error(
        "SP-API catalog search error:",
        response.status,
        data
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unable to search right now. Please try again.",
        },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const items = Array.isArray(data?.items)
      ? data.items
      : [];

    // Amazon'un sonuc sirasini BOZMUYORUZ.
    // Alakasiz kategorileri atip ilk alakali ve Keepa'da
    // gercek urun/rank bulunan sonucu gosteriyoruz.
    for (const item of items) {
      const summary = Array.isArray(item?.summaries)
        ? item.summaries[0]
        : null;

      const title = String(summary?.itemName || "").trim();

      const productType = String(
        Array.isArray(item?.productTypes)
          ? item.productTypes[0]?.productType || ""
          : ""
      );

      if (!title) continue;

      const category = classifyProduct(
        productType,
        title
      );

      if (!category) continue;

      const identifier = selectIdentifier(
        item,
        category
      );

      if (!identifier) continue;

      const keepaVerified = await verifyWithKeepa(
        identifier.value
      );

      if (!keepaVerified) {
        console.log(
          `CATALOG SEARCH SKIP: ${title} | ${identifier.type}=${identifier.value} | Keepa verification failed`
        );
        continue;
      }

      const result = {
        title,
        image: getImage(item),
        format: getFormatLabel(
          category,
          productType,
          title
        ),
        barcode: identifier.value,
        barcodeType: identifier.type,
      };

      console.log(
        `CATALOG SEARCH MATCH: "${query}" -> ${title} | ${result.format} | ${result.barcodeType}=${result.barcode}`
      );

      return NextResponse.json({
        success: true,
        item: result,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "No matching book, movie, CD, or video game was found.",
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Catalog search error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to search right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
