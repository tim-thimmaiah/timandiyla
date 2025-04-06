"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
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
  randomRotate?: number;
  randomTranslateX?: number;
  randomTranslateY?: number;
}

interface PolaroidCarouselProps {
  polaroids: PolaroidItem[];
  className?: string;
}

// Define the initial driven props
const initialDrivenProps: CardDrivenProps = {
  cardWrapperX: 0,
  buttonScaleLeft: 1,
  buttonScaleRight: 1,
  mainBgColor: "#fff4f2", // Default light background color
};

// Function to get random offset with smoothing
const getRandomOffset = (max: number) => {
  const offset = (Math.random() + Math.random() + Math.random()) / 3;
  return (offset * 2 - 1) * max;
};

// Generate card transforms
const generateCardTransform = () => {
  return {
    randomRotate: getRandomOffset(8),
    randomTranslateX: getRandomOffset(10),
    randomTranslateY: getRandomOffset(10),
  };
};

const PolaroidCarousel: React.FC<PolaroidCarouselProps> = ({
  polaroids,
  className = "",
}) => {
  // Prepare data - ensure first photo is at index 0
  const preparedPolaroids = useMemo(() => {
    return polaroids.map((item, index) => ({
      photoData: item.photoData,
      note: item.note,
      id: index,
      isRsvp: item.isRsvp === true,
      ...generateCardTransform(),
    }));
  }, [polaroids]);

  // Store current index
  const [currentIndex, setCurrentIndex] = useState(0);

  // UI state
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // We need to use isDragOffBoundary to set the direction based on drag
  const [isDragOffBoundary, setIsDragOffBoundary] = useState<
    "left" | "right" | null
  >(null);
  const [cardDrivenProps, setCardDrivenProps] = useState(initialDrivenProps);

  // Processing flag reference to prevent rapid clicks
  const isProcessing = useRef(false);

  // Get the current photo
  const currentPhoto =
    preparedPolaroids.length > 0 ? preparedPolaroids[currentIndex] : null;

  // Prepare visible cards - calculate this before any early returns
  const visibleCards = useMemo(() => {
    if (!currentPhoto) return [];

    // We always want the current photo visible
    const result = [currentPhoto];

    if (preparedPolaroids.length > 1) {
      // Add previous photo(s) if available to create the stack effect
      const previousIndex =
        (currentIndex - 1 + preparedPolaroids.length) %
        preparedPolaroids.length;
      result.unshift({
        ...preparedPolaroids[previousIndex],
        ...generateCardTransform(),
      });

      // Add one more previous photo for deeper stack if available
      if (preparedPolaroids.length > 2) {
        const previousIndex2 =
          (currentIndex - 2 + preparedPolaroids.length) %
          preparedPolaroids.length;
        // Only add if it's a different photo
        if (previousIndex2 !== previousIndex) {
          result.unshift({
            ...preparedPolaroids[previousIndex2],
            ...generateCardTransform(),
          });
        }
      }
    }

    return result;
  }, [currentIndex, preparedPolaroids, currentPhoto]);

  // Watch for dragOffBoundary changes to trigger navigation
  useEffect(() => {
    // Only proceed if we have a drag boundary and aren't already processing
    if (isDragOffBoundary && !isProcessing.current) {
      // When dragging right (positive X direction), show the previous card
      // When dragging left (negative X direction), show the next card
      if (isDragOffBoundary === "right") {
        goToPrevious();
      } else if (isDragOffBoundary === "left") {
        goToNext();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragOffBoundary]);

  // Handle navigation
  const goToNext = () => {
    if (isProcessing.current || preparedPolaroids.length <= 1) return;

    isProcessing.current = true;
    // For next, we swipe left (negative X direction)
    setDirection("left");

    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % preparedPolaroids.length
      );
      setDirection(null);
      setIsDragOffBoundary(null);
      isProcessing.current = false;
    }, 300);
  };

  const goToPrevious = () => {
    if (isProcessing.current || preparedPolaroids.length <= 1) return;

    isProcessing.current = true;
    // For previous, we swipe right (positive X direction)
    setDirection("right");

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? preparedPolaroids.length - 1 : prevIndex - 1
      );
      setDirection(null);
      setIsDragOffBoundary(null);
      isProcessing.current = false;
    }, 300);
  };

  // Exit early if no photos
  if (preparedPolaroids.length === 0) {
    return (
      <div className="text-center text-gray-500">No polaroids to display</div>
    );
  }

  // Animation variants
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
      },
    },
    exit: {
      opacity: 0,
      // Left = move to next card (negative X direction)
      // Right = move to previous card (positive X direction)
      x: direction === "left" ? -300 : 300,
      y: 40,
      rotate: direction === "left" ? -20 : 20,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        velocity: 20,
      },
    },
  };

  return (
    <motion.div
      className={`relative w-full max-w-md mx-auto h-[500px] ${className} flex flex-col justify-center items-center`}
      style={{ perspective: "1200px" }}
    >
      <div className="w-full aspect-[3/4] max-w-[300px] relative">
        <AnimatePresence mode="popLayout">
          {visibleCards.map((card, i) => {
            const isLast = i === visibleCards.length - 1;
            const isUpcoming = i === visibleCards.length - 2;

            // Explicitly check for isRsvp
            const isRsvp = card.isRsvp === true;

            return (
              <motion.div
                key={`card-${card.id}-${i}`}
                className="absolute inset-0"
                variants={cardVariants}
                initial="upcomingSecond"
                animate={
                  isLast
                    ? "current"
                    : isUpcoming
                    ? "upcoming"
                    : "upcomingSecond"
                }
                exit="exit"
                style={{
                  transform: isLast
                    ? undefined
                    : `rotate(${card.randomRotate}deg) translate(${card.randomTranslateX}px, ${card.randomTranslateY}px)`,
                  zIndex: isLast ? 30 : isUpcoming ? 20 : 10,
                }}
                layout="position"
              >
                <PolaroidFrame
                  id={`card-${card.id}-${i}`}
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
        animate={{ opacity: isDragging ? 0.5 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goToPrevious}
          aria-label="Previous photo"
          animate={{ scale: cardDrivenProps.buttonScaleLeft }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
          onClick={goToNext}
          aria-label="Next photo"
          animate={{ scale: cardDrivenProps.buttonScaleRight }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
