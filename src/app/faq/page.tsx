"use client";

import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { Disclosure } from "@headlessui/react";

export default function FAQPage() {
  return (
    <PageTransition>
      <div className="min-h-screen p-8 flex flex-col items-center justify-center font-serif italic">
        <main className="max-w-4xl w-full">
          <div className="py-4 mb-0">
            <svg
              className="h-[6vh] md:h-[6vh] mx-auto"
              viewBox="0 0 112 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.875966 1.73647H27.8527V8.86825H9.55813V18.3256H21.6511V25.4574H9.55813V56H0.875966V1.73647ZM23.2869 56L34.9148 1.73647H42.3567L53.9846 56H45.3024L42.7443 44.062H34.5272L31.9691 56H23.2869ZM36.0776 36.9302H41.1939L38.6357 24.7597L36.0776 36.9302ZM83.0725 57.2403C67.4136 57.2403 54.7004 44.5271 54.7004 28.8682C54.7004 13.1318 67.4136 0.496167 83.0725 0.496167C98.8089 0.496167 111.445 13.1318 111.445 28.8682C111.445 39.4109 105.708 48.7132 97.1035 53.5969L102.53 62.5891H93.8477L90.1267 56.3876C87.8787 56.9302 85.4756 57.2403 83.0725 57.2403ZM83.0725 48.5581C83.8477 48.5581 84.5454 48.4806 85.3205 48.4031L81.4446 42.0465H90.1267L92.6074 46.155C98.6539 42.7442 102.762 36.3101 102.762 28.8682C102.762 17.938 94.0027 9.17833 83.0725 9.17833C72.2198 9.17833 63.3826 17.938 63.3826 28.8682C63.3826 39.7209 72.2198 48.5581 83.0725 48.5581Z"
                fill="#DA4D73"
              />
            </svg>
          </div>

          <div className="p-8 rounded-lg max-w-lg mx-auto relative mb-12">
            <div className="space-y-6 mt-4">
              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>What is the dress code?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      The dress code for our wedding is [Dress Code]. Please
                      dress accordingly for the weather as portions of our
                      celebration may be outdoors.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>Can I bring a plus one?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      We&apos;ve reserved spots for those indicated on your
                      invitation. Please refer to your invitation for details
                      about plus ones or contact us if you have any questions.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>Are children welcome?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      [Answer about children at the wedding]
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>Will there be parking available?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      [Parking information]
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>What if I have dietary restrictions?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      Please indicate any dietary restrictions or food allergies
                      in the RSVP form, and we will do our best to accommodate
                      your needs.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>When is the RSVP deadline?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      Please RSVP by [RSVP Deadline] so we can finalize
                      arrangements with our vendors.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>
                        How can I contact you if I have more questions?
                      </span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      Feel free to reach out to us at [contact email] with any
                      additional questions or concerns.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            </div>
          </div>
        </main>
        <footer className="mt-6 md:mt-4 pt-0 md:pt-0 text-center text-sm text-[#A0304F]">
          <nav className="flex flex-wrap justify-center gap-4 mt-6 md:mt-8">
            <Link
              href="/"
              className="px-4 md:px-6 py-2 md:py-3 transition-colors underline underline-offset-4 hover:text-[#A0304F]"
            >
              Back Home
            </Link>
            <Link
              href="/event"
              className="px-4 md:px-6 py-2 md:py-3 transition-colors underline underline-offset-4 hover:text-[#A0304F]"
            >
              Event Details
            </Link>
          </nav>
        </footer>
      </div>
    </PageTransition>
  );
}
