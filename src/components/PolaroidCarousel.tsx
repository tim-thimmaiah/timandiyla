"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PolaroidFrame, { CardDrivenProps } from "./PolaroidFrame";

// Define BadgeType here since it's not exported from PolaroidFrame
export type BadgeType = "new" | "favorite" | "important" | "cantWait" | string;

export interface PolaroidItem {
  photoData: string;
  note: string;
  badge?: BadgeType;
  id?: number;
  isRsvp?: boolean;
  // Add fields for pre-calculated transform values
  randomRotate?: number;
  randomTranslateX?: number;
  randomTranslateY?: number;
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

// Function to get random offset with smoothing to avoid extreme values
const getRandomOffset = (maxOffset: number) => {
  // Use a bell curve-like distribution for more natural variation
  const offset = (Math.random() + Math.random() + Math.random()) / 3;
  return (offset * 2 - 1) * maxOffset;
};

// Generate card transforms ahead of time instead of in render loop
const generateCardTransform = () => {
  const randomRotate = getRandomOffset(8);
  const randomTranslateX = getRandomOffset(10);
  const randomTranslateY = getRandomOffset(10);
  return { randomRotate, randomTranslateX, randomTranslateY };
};

const PolaroidCarousel: React.FC<PolaroidCarouselProps> = ({
  polaroids,
  className = "",
}) => {
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
        // Add transform properties to the card
        ...generateCardTransform(),
      };
    })
  ).current;

  // Initialize cards with explicit isRsvp handling
  const [cards, setCards] = useState<PolaroidItem[]>(
    originalPolaroids.map((item) => ({
      photoData: item.photoData,
      note: item.note,
      badge: item.badge,
      id: item.id,
      isRsvp: item.isRsvp === true,
      // Add transform properties to the card
      ...generateCardTransform(),
    }))
  );

  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOffBoundary, setIsDragOffBoundary] = useState<
    "left" | "right" | null
  >(null);
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);

  // Counter for generating unique IDs for recycled cards
  const idCounter = useRef(originalPolaroids.length);
  // Track the current position in the original array
  const currentPositionRef = useRef(0);
  // Performance optimization - track active card processing
  const isProcessingCardChange = useRef(false);

  // Only keep track of the last 3 cards for better performance
  const visibleCards = useMemo(() => {
    // Only show at most 3 cards at a time
    return cards.slice(-3);
  }, [cards]);

  useEffect(() => {
    if (direction === "left" || direction === "right") {
      if (isProcessingCardChange.current) return;
      isProcessingCardChange.current = true;

      // Remove the top card
      setCards((prevCards) => {
        const newCards = prevCards.slice(0, -1);

        // Always maintain at least 3 cards (or all cards if less than 3 exist)
        if (newCards.length < 3 && originalPolaroids.length > 0) {
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
            // Add transform properties to the new card
            ...generateCardTransform(),
          };

          // Increment the ID counter
          idCounter.current += 1;

          // Add the card to the beginning of the stack
          return [nextCard, ...newCards];
        }

        return newCards;
      });

      // Reset processing flag after a short delay to prevent rapid changes
      setTimeout(() => {
        isProcessingCardChange.current = false;
      }, 300);
    }

    // Reset direction after handling
    setDirection(null);
  }, [direction, originalPolaroids]);

  // Card animation variants with improved transitions
  const cardVariants = {
    current: {
      opacity: 1,
      y: 0,
      scale: 1,
      zIndex: 30,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
        velocity: 0,
      },
    },
    upcoming: {
      opacity: 1,
      y: 40,
      scale: 0.9,
      zIndex: 20,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 1.2,
      },
    },
    upcomingSecond: {
      opacity: 0.8,
      y: 60,
      scale: 0.85,
      zIndex: 10,
      rotate: -5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 1.5,
      },
    },
    remainings: {
      opacity: 0,
      y: 20,
      scale: 0.9,
      zIndex: 0,
    },
    exit: {
      opacity: 0,
      x: direction === "left" ? -300 : 300,
      y: 40,
      rotate: direction === "left" ? -20 : 20,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        velocity: 20,
        restDelta: 0.5,
      },
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
        {/* Stack of cards - only render the visible ones */}
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card, i) => {
            const isLast = i === visibleCards.length - 1;
            const isUpcoming = i === visibleCards.length - 2;
            const isUpcomingSecond = i === visibleCards.length - 3;

            // Explicitly check for true
            const isRsvp = card.isRsvp === true;

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
                  // Apply a consistent transform for each card using pre-generated values
                  transform: isLast
                    ? undefined
                    : `rotate(${card.randomRotate}deg) translate(${card.randomTranslateX}px, ${card.randomTranslateY}px)`,
                  // Apply additional transform based on drag boundary
                  zIndex:
                    isLast && isDragOffBoundary
                      ? 50
                      : isLast
                      ? 30
                      : isUpcoming
                      ? 20
                      : isUpcomingSecond
                      ? 10
                      : 0,
                }}
                layout
              >
                <PolaroidFrame
                  id={`cardDriverWrapper-${card.id}`}
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
      <motion.div
        className="flex justify-between w-full mt-6 px-4"
        animate={{
          opacity: isDragging ? 0.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            !isProcessingCardChange.current && setDirection("right")
          }
          aria-label="Previous photo"
          animate={{
            scale: cardDrivenProps.buttonScaleLeft,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          disabled={isProcessingCardChange.current}
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
          onClick={() =>
            !isProcessingCardChange.current && setDirection("left")
          }
          aria-label="Next photo"
          animate={{
            scale: cardDrivenProps.buttonScaleRight,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          disabled={isProcessingCardChange.current}
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
      </motion.div>
    </motion.div>
  );
};

export default PolaroidCarousel;
