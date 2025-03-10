import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function GiftPage() {
  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8">Gift Registry</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto mb-8">
            <p className="text-center text-lg mb-8">
              Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we&apos;ve registered at the following places:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-3">[Registry Name 1]</h3>
                <p className="mb-4">Find our registry with items we&apos;ve selected for our new home.</p>
                <a 
                  href="#" 
                  className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Registry
                </a>
              </div>
              
              <div className="border p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-3">[Registry Name 2]</h3>
                <p className="mb-4">Browse our wishlist for our future together.</p>
                <a 
                  href="#" 
                  className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Registry
                </a>
              </div>
            </div>
            
            <div className="text-center border-t pt-6">
              <h3 className="text-xl font-semibold mb-3">Honeymoon Fund</h3>
              <p className="mb-4">
                If you prefer, you can contribute to our honeymoon fund to help us create lasting memories on our first adventure as a married couple.
              </p>
              <a 
                href="#" 
                className="inline-block px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-black hover:underline">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
