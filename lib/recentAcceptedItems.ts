import "server-only";

import { db, FieldValue } from "@/lib/firebaseAdmin";

export type RecentAcceptedCategory =
  | "books"
  | "cds"
  | "dvds"
  | "games";

export type RecentAcceptedItem = {
  id: string;
  code: string;
  title: string;
  image: string;
  category: RecentAcceptedCategory;
  acceptedAt: number;
};

const COLLECTION = "recent_accepted_items";
const DOCUMENT = "latest";
const MAX_ITEMS = 20;

const ALLOWED_IMAGE_HOSTS = new Set([
  "images-na.ssl-images-amazon.com",
  "m.media-amazon.com",
  "ecx.images-amazon.com",
  "g-ecx.images-amazon.com",
]);

function isSupportedCategory(
  value: unknown
): value is RecentAcceptedCategory {
  return (
    value === "books" ||
    value === "cds" ||
    value === "dvds" ||
    value === "games"
  );
}

function sanitizeImageUrl(value: unknown): string {
  const raw = String(value || "").trim();

  if (!raw) return "";

  try {
    const url = new URL(raw);

    if (
      url.protocol !== "https:" ||
      !ALLOWED_IMAGE_HOSTS.has(url.hostname)
    ) {
      return "";
    }

    return url.toString().slice(0, 500);
  } catch {
    return "";
  }
}

export async function recordRecentAcceptedItem(
  scannedCode: string,
  product: any,
  pricing: {
    accepted?: boolean;
    category?: string;
  }
): Promise<void> {
  if (!pricing?.accepted) return;
  if (!isSupportedCategory(pricing.category)) return;

  const code = String(scannedCode || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 20);

  const title = String(product?.title || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);

  const asin = String(product?.asin || "")
    .replace(/[^A-Z0-9_-]/gi, "")
    .toUpperCase()
    .slice(0, 40);

  const image = sanitizeImageUrl(product?.image);

  const id = asin || code;

  if (!id || !code || !title) return;

  const acceptedAt = Date.now();

  try {
    const ref = db
      .collection(COLLECTION)
      .doc(DOCUMENT);

    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);

      const existing = Array.isArray(
        snapshot.data()?.items
      )
        ? snapshot.data()!.items
        : [];

      const cleanExisting =
        existing.filter((item: any) => {
          return (
            item &&
            typeof item.id === "string" &&
            item.id !== id
          );
        });

      const nextItems: RecentAcceptedItem[] = [
        {
          id,
          code,
          title,
          image,
          category: pricing.category,
          acceptedAt,
        },
        ...cleanExisting,
      ].slice(0, MAX_ITEMS);

      transaction.set(ref, {
        items: nextItems,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  } catch (error) {
    // SEO kaydi scan sonucunu asla bozmaz.
    console.error(
      "Recent accepted item save error:",
      error
    );
  }
}

export async function getRecentAcceptedItems():
Promise<RecentAcceptedItem[]> {
  try {
    const snapshot = await db
      .collection(COLLECTION)
      .doc(DOCUMENT)
      .get();

    const rawItems = snapshot.data()?.items;

    if (!Array.isArray(rawItems)) {
      return [];
    }

    return rawItems
      .slice(0, MAX_ITEMS)
      .map((item: any) => {
        if (
          !item ||
          typeof item.id !== "string" ||
          typeof item.code !== "string" ||
          typeof item.title !== "string" ||
          !isSupportedCategory(item.category)
        ) {
          return null;
        }

        return {
          id: item.id.slice(0, 40),
          code: item.code.slice(0, 20),
          title: item.title.slice(0, 180),
          image: sanitizeImageUrl(item.image),
          category: item.category,
          acceptedAt:
            typeof item.acceptedAt === "number"
              ? item.acceptedAt
              : 0,
        };
      })
      .filter(
        (
          item
        ): item is RecentAcceptedItem =>
          item !== null
      );
  } catch (error) {
    console.error(
      "Recent accepted items read error:",
      error
    );

    return [];
  }
}
