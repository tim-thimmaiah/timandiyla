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
                      <span>What is the expected attire?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      For Friday&apos;s event, the dress code is black-tie
                      optional. Feel free to throw in a wild outfit change for
                      the after-party! Saturday&apos;s brunch event will be
                      &quot;come as you are&quot; - hungover, comfortable, and
                      ready to dance or nap on the grass. The backyard will be
                      semi-shaded for both days. The Bay is notorious for
                      dropping in temperature after sunset so please bring a
                      coat! *Items to avoid: any heals that will dig into the
                      grass.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>Transportation suggestions?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      We have lots of open street parking around our home, but
                      we highly recommend taking a ride-share app or public
                      transportation to get there.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>Are children invited?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      Apologies, but no children.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>What&apos;s the wedding gift situation?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      Please do not feel obligated to give us anything, your
                      presence is a true gift to us! If you would like to gift
                      us something, we would greatly appreciate contributions to
                      our honeymoon fund to Slovenia!
                      <br />
                      <br />
                      Here are some ideas:
                      <br />
                      $10 send Iyla with an extra tube of sunscreen
                      <br />
                      $15 rent Tim an extra lifevest for kayaking
                      <br />
                      $20 Tim&apos;s emergency fund as he always forgets
                      something (sunglasses, socks, toothpaste, etc)
                      <br />
                      $75 send Iyla with the actual amount of sunscreen she
                      needs PLUS a new straw sunhat (!)
                      <br />
                      $100 Laško beer fund, Slovenia&apos;s #1 brew
                      <br />
                      $200 upgrade Iyla&apos;s car insurance to premium for
                      their road trip
                      <br />
                      $300 upgrade one of Tim&apos;s flights so he can move his
                      knees from the back of his neighbor&apos;s seat
                      <br />
                      <br />
                      Find us on venmo: @iyla-ollinger and @tim-thimmaiah
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
                      <span>Who&apos;s cuter, you or me?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      This is a heavily debated question in the
                      Ollinger-Thimmaiah household. The answer is always
                      &quot;you.&quot;
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>Who&apos;s cuter, you or Wonder?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      Another hot topic in the Ollinger-Thimmaiah household.
                      Goes without saying… it&apos;s Wonder.
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>What is your color palate for the wedding?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      This is not that kind of wedding. Please wear whatever
                      colors you like :)
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>

              <Disclosure as="div">
                {({ open }) => (
                  <div className="border-2 border-redz-200 p-4 rounded-lg">
                    <Disclosure.Button className="flex w-full justify-between text-left text-xl font-semibold">
                      <span>What weather should we expect?</span>
                      <span className="ml-2">{open ? "−" : "+"}</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-4">
                      It should be between 65-80 degrees during the day and
                      55-60 degrees after sunset.
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
