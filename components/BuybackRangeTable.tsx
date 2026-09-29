export type BuybackRangeKey =
  | "dvds"
  | "bluray4k"
  | "cds"
  | "books"
  | "games";

const BUYBACK_RANGES: {
  key: BuybackRangeKey;
  label: string;
  range: string;
}[] = [
  {
    key: "dvds",
    label: "DVDs",
    range: "$0.10–$2.00",
  },
  {
    key: "bluray4k",
    label: "Blu-ray / 4K",
    range: "$0.50–$6.00",
  },
  {
    key: "cds",
    label: "CDs",
    range: "$0.10–$1.50",
  },
  {
    key: "books",
    label: "Books",
    range: "$0.25–$20+",
  },
  {
    key: "games",
    label: "Video Games",
    range: "$0.50–$35+",
  },
];

export default function BuybackRangeTable({
  categories,
}: {
  categories?: BuybackRangeKey[];
}) {
  const rows =
    categories && categories.length
      ? BUYBACK_RANGES.filter((item) => categories.includes(item.key))
      : BUYBACK_RANGES;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="divide-y divide-slate-100">
        {rows.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-6 px-5 py-4 sm:px-6"
          >
            <span className="font-semibold text-slate-800">
              {item.label}
            </span>

            <span className="whitespace-nowrap text-lg font-bold text-blue-700">
              {item.range}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
        <p className="text-sm leading-relaxed text-slate-500">
          These are approximate online buyback-market ranges, not retail or
          collector sale prices. Actual offers vary by title, edition,
          condition, demand, and buyer inventory.
        </p>
      </div>
    </div>
  );
}
