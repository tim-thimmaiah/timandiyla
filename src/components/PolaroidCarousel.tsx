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
  // Store the original polaroids for infinite cycling
  const originalPolaroids = useRef<PolaroidItem[]>(
    polaroids.map((item, index) => ({ ...item, id: index }))
  ).current;

  const [cards, setCards] = useState<PolaroidItem[]>(
    originalPolaroids.map((item) => ({ ...item }))
  );
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // These states are used by the PolaroidFrame component
  const [isDragOffBoundary, setIsDragOffBoundary] = useState<
    "left" | "right" | null
  >(null);
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);

  // Counter for generating unique IDs for recycled cards
  const idCounter = useRef(originalPolaroids.length);

  useEffect(() => {
    if (direction === "left" || direction === "right") {
      // Remove the top card
      setCards((prevCards) => {
        const newCards = prevCards.slice(0, -1);

        // If cards are getting low, add more from the original set
        if (newCards.length < 3) {
          // Get the next card from the original set and assign a new unique ID
          const nextCardIndex = idCounter.current % originalPolaroids.length;
          const nextCard = {
            ...originalPolaroids[nextCardIndex],
            id: idCounter.current,
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
                  isRsvp={card.isRsvp}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PolaroidCarousel;
