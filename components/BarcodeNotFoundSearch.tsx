"use client";

import { FormEvent, useState } from "react";

type SearchResult = {
  title: string;
  image: string;
  format: string;
  barcode: string;
  barcodeType: string;
};

export default function BarcodeNotFoundSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] =
    useState<SearchResult | null>(null);
  const [error, setError] = useState("");
  const [searching, setSearching] =
    useState(false);

  const handleSearch = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanQuery = query.trim();

    if (cleanQuery.length < 2) {
      setError("Enter the title of your item.");
      setResult(null);
      return;
    }

    setSearching(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "/api/catalog-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: cleanQuery,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (
        !response.ok ||
        !data?.success ||
        !data?.item
      ) {
        setError(
          data?.error ||
            "No matching item was found."
        );
        return;
      }

      setResult(data.item);
    } catch {
      setError(
        "Unable to search right now. Please try again."
      );
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
        Find your item
      </p>

      <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
        Search by title
      </h2>

      <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
        Enter the book, movie, CD, or video game title.
        We&apos;ll show the first relevant item we can verify.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            maxLength={120}
            autoComplete="off"
            placeholder="Example: The Ringer DVD"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[16px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={
              searching ||
              query.trim().length < 2
            }
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {searching
              ? "Searching..."
              : "Search"}
          </button>
        </div>

      </form>

      {error && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm leading-relaxed text-amber-900">
            {error}
          </p>

          <p className="mt-1 text-xs text-amber-700">
            Try a more specific title, author, artist, or edition.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
            <div className="flex h-32 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white sm:h-36 sm:w-28">
              {result.image ? (
                <img
                  src={result.image}
                  alt=""
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="px-2 text-center text-xs text-slate-400">
                  No image
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                {result.format}
              </span>

              <h3 className="mt-2 text-lg font-bold leading-snug text-slate-900">
                {result.title}
              </h3>

              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {result.barcodeType}
                </p>

                <p className="mt-0.5 break-all font-mono text-sm font-semibold text-slate-800">
                  {result.barcode}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
            <p className="mb-3 text-xs leading-relaxed text-slate-500">
              Make sure the cover and title match your item.
              If not, try a more specific search.
            </p>

            <a
              href={`/?lookup=${encodeURIComponent(
                result.barcode
              )}`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 sm:w-auto"
            >
              Check This Item
              <span className="ml-2">
                →
              </span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
