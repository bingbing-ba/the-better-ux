'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useDoDontView } from '@/app/ux-cases/_hooks/useDoDontView';
import { DoDontToggle } from '@/app/ux-cases/_components/DoDontToggle';
import { DoExample } from './_components/DoExample';
import { DontExample } from './_components/DontExample';

// Case metadata
const caseData = {
  title: 'Route Handlers vs Server Actions for Data Fetching',
  tags: ['data-fetching', 'api', 'performance', 'react-query'],
};

export default function RouteHandlersVsServerActionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const { view } = useDoDontView();

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <h1 className="text-4xl font-bold mb-4">{caseData.title}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {caseData.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Toggle */}
        <div className="mb-8">
          <DoDontToggle />
        </div>

        {/* Content */}
        {view === 'dont' ? <DontExample /> : <DoExample />}
      </div>
    </div>
  );
}
