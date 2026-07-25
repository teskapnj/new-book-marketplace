import Link from "next/link";

const ALL_GUIDES = [
  { slug: "how-much-are-used-books-worth", title: "How Much Are Used Books Worth?" },
  { slug: "how-much-are-used-dvds-worth", title: "How Much Are Used DVDs Worth?" },
  { slug: "sell-video-games-for-cash", title: "Sell Video Games for Cash" },
  { slug: "best-places-to-sell-cds-dvds-games", title: "Best Places to Sell CDs, DVDs & Games" },
  { slug: "where-to-sell-books-and-dvds-for-cash", title: "Where to Sell Books & DVDs for Cash" },
  { slug: "decluttr-shut-down-alternative", title: "Best Decluttr Alternative" },
];

export default function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const others = ALL_GUIDES.filter((g) => g.slug !== currentSlug);

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h2>
      <ul className="space-y-2">
        {others.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              {g.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}