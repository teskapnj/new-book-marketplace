import Link from "next/link";

type MediaType = "books" | "dvds" | "cds" | "games";

const categories = [
  {
    id: "books",
    title: "Sell Books for Cash",
    description: "Get an instant quote for your used books.",
    href: "/sell-books-for-cash",
    icon: "📚",
  },
  {
    id: "dvds",
    title: "Sell DVDs & Blu-rays",
    description: "Sell DVDs, Blu-rays and 4K movies for cash.",
    href: "/sell-dvds-for-cash",
    icon: "📀",
  },
  {
    id: "cds",
    title: "Sell CDs for Cash",
    description: "Turn your used music CDs into cash.",
    href: "/sell-cds-for-cash",
    icon: "💿",
  },
  {
    id: "games",
    title: "Sell Video Games",
    description: "Get cash offers for your used video games.",
    href: "/sell-video-games-for-cash",
    icon: "🎮",
  },
];

export default function MediaCategoryLinks({
  current,
}: {
  current: MediaType;
}) {
  const otherCategories = categories.filter(
    (category) => category.id !== current
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Selling Other Media?
          </h2>

          <p className="mt-3 text-lg text-gray-600">
            Sell different types of used media with SellBookMedia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="block rounded-2xl border border-gray-200 bg-slate-50 p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-4">{category.icon}</div>

              <h3 className="text-xl font-bold text-gray-900">
                {category.title}
              </h3>

              <p className="mt-2 text-gray-600">
                {category.description}
              </p>

              <span className="inline-block mt-4 font-semibold text-blue-600">
                Learn More →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}