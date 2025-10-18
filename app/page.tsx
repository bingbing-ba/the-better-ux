import Link from 'next/link';
import { getCasesSortedByDate, getTrendingCases, getNewCases } from './ux-cases/_data/cases';

export default function Home() {
  const allCases = getCasesSortedByDate();
  const trendingCases = getTrendingCases();
  const newCases = getNewCases();

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">The Better UX</h1>
          <p className="text-lg text-gray-600">
            Learn better UX practices through real examples
          </p>
        </header>

        {/* Trending Section */}
        {trendingCases.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">🔥 Trending</h2>
            <div className="grid gap-4">
              {trendingCases.map((caseItem) => (
                <Link
                  key={caseItem.slug}
                  href={`/ux-cases/${caseItem.slug}`}
                  className="block rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <h3 className="mb-2 text-xl font-semibold">{caseItem.title}</h3>
                  <div className="flex gap-2">
                    {caseItem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Section */}
        {newCases.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">✨ New</h2>
            <div className="grid gap-4">
              {newCases.map((caseItem) => (
                <Link
                  key={caseItem.slug}
                  href={`/ux-cases/${caseItem.slug}`}
                  className="block rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  <h3 className="mb-2 text-xl font-semibold">{caseItem.title}</h3>
                  <div className="flex gap-2">
                    {caseItem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Cases */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold">All Cases</h2>
          <div className="grid gap-4">
            {allCases.map((caseItem) => (
              <Link
                key={caseItem.slug}
                href={`/ux-cases/${caseItem.slug}`}
                className="block rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                <h3 className="mb-2 text-xl font-semibold">{caseItem.title}</h3>
                <div className="flex gap-2">
                  {caseItem.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
