import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function GoogleVerificationPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Site Not For Search Engine Indexing
      </h1>
      <p className="mb-4">
        This website contains private information related to Tim and Iyla&apos;s
        wedding and is not intended to be indexed by search engines.
      </p>
      <p className="mb-4">
        We have implemented the following measures to prevent indexing:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>robots.txt with Disallow directives</li>
        <li>X-Robots-Tag HTTP headers</li>
        <li>HTML meta robots tags</li>
        <li>robots metadata in Next.js configuration</li>
      </ul>
      <p>
        If you are a search engine crawler, please respect our wishes and do not
        index this site. Thank you.
      </p>
    </div>
  );
}
