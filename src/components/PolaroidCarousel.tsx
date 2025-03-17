"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PolaroidFrame, { CardDrivenProps } from "./PolaroidFrame";

// Define BadgeType here since it's not exported from PolaroidFrame
export type BadgeType = "new" | "favorite" | "important" | string;

interface PolaroidItem {
  photoData: string;
  note: string;
  badge?: BadgeType;
  id?: number;
  isRsvp?: boolean;
}

interface PolaroidCarouselProps {
  polaroids: PolaroidItem[];
  className?: string;
}

// Define the initial driven props to match the CardDrivenProps interface
const initialDrivenProps: CardDrivenProps = {
  cardWrapperX: 0,
  buttonScaleLeft: 1,
  buttonScaleRight: 1,
  mainBgColor: "#fff4f2", // Default light background color
};

// Increase the maximum offset values for a messier appearance
const getRandomOffset = (maxOffset: number) =>
  Math.random() * maxOffset - maxOffset / 2;

const PolaroidCarousel: React.FC<PolaroidCarouselProps> = ({
  polaroids,
  className = "",
}) => {
  // Log incoming polaroids to verify isRsvp property
  const rsvpCount = polaroids.filter((p) => p.isRsvp === true).length;
  console.log("PolaroidCarousel: Incoming polaroids with isRsvp:", rsvpCount);

  // Store the original polaroids for infinite cycling with explicit isRsvp handling
  const originalPolaroids = useRef<PolaroidItem[]>(
    polaroids.map((item, index) => {
      // Create a new object with explicit properties
      return {
        photoData: item.photoData,
        note: item.note,
        badge: item.badge,
        id: index,
        isRsvp: item.isRsvp === true,
      };
    })
  ).current;

  // Log original polaroids to verify isRsvp property is preserved
  const originalRsvpCount = originalPolaroids.filter(
    (p) => p.isRsvp === true
  ).length;
  console.log(
    "PolaroidCarousel: Original polaroids with isRsvp:",
    originalRsvpCount
  );

  // Initialize cards with explicit isRsvp handling
  const [cards, setCards] = useState<PolaroidItem[]>(
    originalPolaroids.map((item) => ({
      photoData: item.photoData,
      note: item.note,
      badge: item.badge,
      id: item.id,
      isRsvp: item.isRsvp === true,
    }))
  );

  // Log initial cards to verify isRsvp property is preserved
  const initialCardsRsvpCount = cards.filter((c) => c.isRsvp === true).length;
  console.log(
    "PolaroidCarousel: Initial cards with isRsvp:",
    initialCardsRsvpCount
  );

  // Add a useEffect to log the cards whenever they change
  useEffect(() => {
    const cardsWithRsvpCount = cards.filter((c) => c.isRsvp === true).length;
    console.log(
      "PolaroidCarousel: Cards updated with isRsvp:",
      cardsWithRsvpCount
    );

    if (cardsWithRsvpCount > 0) {
      console.log(
        "PolaroidCarousel: First card with isRsvp:",
        cards.find((c) => c.isRsvp === true)
      );
    }
  }, [cards]);

  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // These states are used by the PolaroidFrame component
  const [isDragOffBoundary, setIsDragOffBoundary] = useState<
    "left" | "right" | null
  >(null);
  const [, setCardDrivenProps] = useState(initialDrivenProps);

  // Counter for generating unique IDs for recycled cards
  const idCounter = useRef(originalPolaroids.length);
  // Track the current position in the original array
  const currentPositionRef = useRef(0);

  useEffect(() => {
    if (direction === "left" || direction === "right") {
      // Remove the top card
      setCards((prevCards) => {
        const newCards = prevCards.slice(0, -1);

        // If cards are getting low, add more from the original set
        if (newCards.length < 3) {
          // Update the current position based on direction
          if (direction === "left") {
            // Move forward in the order (next card)
            currentPositionRef.current =
              (currentPositionRef.current + 1) % originalPolaroids.length;
          } else {
            // Move backward in the order (previous card)
            currentPositionRef.current =
              (currentPositionRef.current - 1 + originalPolaroids.length) %
              originalPolaroids.length;
          }

          const sourceCard = originalPolaroids[currentPositionRef.current];

          // Create a new card with explicit properties
          const nextCard = {
            photoData: sourceCard.photoData,
            note: sourceCard.note,
            badge: sourceCard.badge,
            id: idCounter.current,
            isRsvp: sourceCard.isRsvp === true,
          };

          // Increment the ID counter
          idCounter.current += 1;

          // Add the card to the beginning of the stack
          return [nextCard, ...newCards];
        }

        return newCards;
      });
    }

    // Reset direction after handling
    setDirection(null);
  }, [direction, originalPolaroids]);

  // Card animation variants
  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, // easeOutExpo
    },
    upcoming: {
      opacity: 1,
      y: 40,
      scale: 0.9,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0 },
      rotate: 15,
    },
    upcomingSecond: {
      opacity: 1,
      y: 60,
      scale: 0.85,
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0 },
      rotate: -10,
    },
    remainings: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    exit: {
      opacity: 0,
      x: direction === "left" ? -100 : 100,
      y: 40,
      rotate: direction === "left" ? -20 : 20,
      transition: { duration: 0.3, ease: [0.87, 0, 0.13, 1] },
    },
  };

  if (!cards.length) {
    return (
      <div className="text-center text-gray-500">No polaroids to display</div>
    );
  }

  return (
    <motion.div
      className={`relative w-full max-w-md mx-auto h-[500px] ${className} flex flex-col justify-center items-center`}
      style={{
        perspective: "1200px",
      }}
    >
      <div className="w-full aspect-[3/4] max-w-[300px] relative">
        {/* Stack of cards */}
        <AnimatePresence>
          {cards.map((card, i) => {
            const isLast = i === cards.length - 1;
            const isUpcoming = i === cards.length - 2;
            const isUpcomingSecond = i === cards.length - 3;

            // Explicitly check for true
            const isRsvp = card.isRsvp === true;

            // Log each card's isRsvp status
            console.log(
              `Card ${i} isRsvp:`,
              isRsvp,
              "Original value:",
              card.isRsvp
            );

            return (
              <motion.div
                key={`card-${card.id}`}
                className="absolute inset-0"
                variants={cardVariants}
                initial="remainings"
                animate={
                  isLast
                    ? "current"
                    : isUpcoming
                    ? "upcoming"
                    : isUpcomingSecond
                    ? "upcomingSecond"
                    : "remainings"
                }
                exit="exit"
                style={{
                  // Increase the randomness for a messier look
                  transform: `rotate(${getRandomOffset(
                    15 // Increased from 5
                  )}deg) translate(${getRandomOffset(20)}px, ${getRandomOffset(
                    20 // Increased from 10
                  )}px)`,
                  // Apply additional transform based on drag boundary
                  ...(isDragOffBoundary && { zIndex: 50 }),
                }}
              >
                <PolaroidFrame
                  id={`cardDriverWrapper-${i}`}
                  photoData={card.photoData}
                  note={card.note}
                  isLast={isLast}
                  setCardDrivenProps={setCardDrivenProps}
                  setIsDragging={setIsDragging}
                  isDragging={isDragging}
                  setIsDragOffBoundary={setIsDragOffBoundary}
                  setDirection={setDirection}
                  isRsvp={isRsvp}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between w-full mt-6 px-4">
        <motion.button
          className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDirection("right")}
          aria-label="Previous photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </motion.button>

        <motion.button
          className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDirection("left")}
          aria-label="Next photo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PolaroidCarousel;
