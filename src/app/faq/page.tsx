import Link from "next/link";
import PageTransition from "@/components/PageTransition";

export default function FAQPage() {
  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What is the dress code?</h3>
                <p>The dress code for our wedding is [Dress Code]. Please dress accordingly for the weather as portions of our celebration may be outdoors.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I bring a plus one?</h3>
                <p>We&apos;ve reserved spots for those indicated on your invitation. Please refer to your invitation for details about plus ones or contact us if you have any questions.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Are children welcome?</h3>
                <p>[Answer about children at the wedding]</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Will there be parking available?</h3>
                <p>[Parking information]</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">What if I have dietary restrictions?</h3>
                <p>Please indicate any dietary restrictions or food allergies in the RSVP form, and we will do our best to accommodate your needs.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">When is the RSVP deadline?</h3>
                <p>Please RSVP by [RSVP Deadline] so we can finalize arrangements with our vendors.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How can I contact you if I have more questions?</h3>
                <p>Feel free to reach out to us at [contact email] with any additional questions or concerns.</p>
              </div>
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
