import Link from 'next/link'

type Guide = {
  slug: string
  title: string
  topics: string[]
}

const ALL_GUIDES: Guide[] = [
  {
    slug: 'how-much-are-used-books-worth',
    title: 'How Much Are Used Books Worth?',
    topics: ['books', 'value'],
  },
  {
    slug: 'how-to-find-book-value-by-isbn',
    title: 'How to Find a Book Value by ISBN',
    topics: ['books', 'value', 'barcode'],
  },
  {
    slug: 'where-to-sell-books-and-dvds-for-cash',
    title: 'Where to Sell Books & DVDs for Cash',
    topics: ['books', 'dvds', 'selling'],
  },

  {
    slug: 'how-much-are-used-cds-worth',
    title: 'How Much Are Used CDs Worth?',
    topics: ['cds', 'value'],
  },
  {
    slug: 'how-to-sell-a-cd-collection',
    title: 'How to Sell a CD Collection',
    topics: ['cds', 'collections', 'selling'],
  },
  {
    slug: 'who-buys-cd-collections',
    title: 'Who Buys CD Collections?',
    topics: ['cds', 'collections', 'selling'],
  },

  {
    slug: 'how-much-are-used-dvds-worth',
    title: 'How Much Are Used DVDs Worth?',
    topics: ['dvds', 'value'],
  },
  {
    slug: 'are-old-dvds-worth-anything',
    title: 'Are Old DVDs Worth Anything?',
    topics: ['dvds', 'value'],
  },
  {
    slug: 'who-buys-dvd-collections',
    title: 'Who Buys DVD Collections?',
    topics: ['dvds', 'collections', 'selling'],
  },
  {
    slug: 'why-are-used-dvds-worth-so-little',
    title: 'Why Are Used DVDs Worth So Little?',
    topics: ['dvds', 'value'],
  },
  {
    slug: 'what-to-do-with-old-dvds-and-cds',
    title: 'What to Do With Old DVDs & CDs',
    topics: ['dvds', 'cds', 'selling'],
  },

  {
    slug: 'what-makes-used-video-games-valuable',
    title: 'What Makes Used Video Games Valuable?',
    topics: ['games', 'value'],
  },

  {
    slug: 'best-places-to-sell-cds-dvds-games',
    title: 'Best Places to Sell CDs, DVDs & Games',
    topics: ['cds', 'dvds', 'games', 'selling'],
  },
  {
    slug: 'media-value-by-barcode',
    title: 'Media Value by Barcode',
    topics: ['books', 'cds', 'dvds', 'games', 'value', 'barcode'],
  },
  {
    slug: 'decluttr-shut-down-alternative',
    title: 'Decluttr Alternatives for Selling Used Media',
    topics: ['cds', 'dvds', 'games', 'selling'],
  },
]

function getRelatedGuides(currentSlug: string) {
  const currentGuide = ALL_GUIDES.find(
    (guide) => guide.slug === currentSlug
  )

  const currentTopics = currentGuide?.topics ?? []

  return ALL_GUIDES
    .filter((guide) => guide.slug !== currentSlug)
    .map((guide, index) => {
      const sharedTopics = guide.topics.filter((topic) =>
        currentTopics.includes(topic)
      ).length

      return {
        guide,
        score: sharedTopics,
        index,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }

      return a.index - b.index
    })
    .slice(0, 6)
    .map((item) => item.guide)
}

export default function RelatedGuides({
  currentSlug,
}: {
  currentSlug: string
}) {
  const relatedGuides = getRelatedGuides(currentSlug)

  return (
    <section className="mt-10 border-t border-gray-200 pt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Related Guides
        </h2>

        <Link
          href="/guides"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View all guides →
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {relatedGuides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="rounded-xl border border-gray-200 bg-white p-4 font-medium text-gray-900 transition hover:border-blue-300 hover:text-blue-700 hover:shadow-sm"
          >
            {guide.title}
          </Link>
        ))}
      </div>
    </section>
  )
}