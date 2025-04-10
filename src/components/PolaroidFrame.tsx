import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  PanInfo,
} from "framer-motion";

// Define the type for card driven props
export interface CardDrivenProps {
  cardWrapperX: number;
  buttonScaleLeft: number;
  buttonScaleRight: number;
  mainBgColor: string;
}

interface PolaroidFrameProps {
  id?: string;
  photoData: string | null;
  note: string;
  isPreview?: boolean;
  triggerShake?: boolean;
  onShake?: () => void;
  isLast: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isDragging: boolean;
  setCardDrivenProps: (
    props: CardDrivenProps | ((prev: CardDrivenProps) => CardDrivenProps)
  ) => void;
  setIsDragOffBoundary: (boundary: "left" | "right" | null) => void;
  setDirection: (direction: "left" | "right") => void;
  exitDirection?: "left" | "right" | null;
  isRsvp?: boolean;
}

const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  id,
  photoData,
  note,
  isPreview = false,
  triggerShake = false,
  onShake,
  isLast,
  setIsDragging,
  isDragging,
  exitDirection,
  setCardDrivenProps,
  setIsDragOffBoundary,
  setDirection,
  isRsvp = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Disable hover effects when dragging
  useEffect(() => {
    if (isDragging && isHovered) {
      setIsHovered(false);
    }
  }, [isDragging, isHovered]);

  // Calculate font size based on note length
  const calculateFontSize = () => {
    if (!note) return isPreview ? "14px" : "18px";
    const baseFontSize = isPreview ? 14 : 18;
    if (note.length <= 20) return `${baseFontSize}px`;
    if (note.length <= 40) return `${baseFontSize - 2}px`;
    if (note.length <= 60) return `${baseFontSize - 4}px`;
    if (note.length <= 80) return `${baseFontSize - 5}px`;
    return `${baseFontSize - 6}px`;
  };

  // Hover effects - simplified to avoid linter errors
  // This is kept as a placeholder for future hover effect enhancements
  const handleMouseMove = () => {
    // Future hover effect code would go here
  };

  useEffect(() => {
    if (triggerShake && !isShaking) {
      setIsShaking(true);
      if (onShake) onShake();
      setTimeout(() => setIsShaking(false), 500);
    }
  }, [triggerShake, isShaking, onShake]);

  const fontSize = calculateFontSize();

  // Animation values
  const x = useMotionValue(0);
  const offsetBoundary = 150;

  // Improved animation curves for more natural movement
  const inputX = [-offsetBoundary, 0, offsetBoundary];
  const outputX = [-200, 0, 200];
  const outputY = [30, 0, 30]; // Less upward movement for a more subtle feel
  const outputRotate = [-25, 0, 25]; // Less rotation for a more subtle rotate
  const outputActionScaleBadAnswer = [2.5, 1, 0.4]; // More subtle scaling
  const outputActionScaleRightAnswer = [0.4, 1, 2.5]; // More subtle scaling

  // Create more responsive transforms
  const drivenX = useTransform(x, inputX, outputX, {
    clamp: false, // Allow for more natural movement beyond boundaries
  });

  const drivenY = useTransform(x, inputX, outputY, {
    clamp: false,
  });

  const drivenRotation = useTransform(x, inputX, outputRotate, {
    clamp: false,
  });

  const drivenActionLeftScale = useTransform(
    x,
    inputX,
    outputActionScaleBadAnswer
  );

  const drivenActionRightScale = useTransform(
    x,
    inputX,
    outputActionScaleRightAnswer
  );

  // Add opacity based on swipe direction
  // const leftOpacity = useTransform(
  //   x,
  //   [-offsetBoundary, -offsetBoundary / 2, 0],
  //   [1, 0.8, 0]
  // );

  // const rightOpacity = useTransform(
  //   x,
  //   [0, offsetBoundary / 2, offsetBoundary],
  //   [0, 0.8, 1]
  // );

  useMotionValueEvent(x, "change", (latest) => {
    setCardDrivenProps((state) => ({
      ...state,
      cardWrapperX: latest,
      buttonScaleLeft: drivenActionLeftScale.get(),
      buttonScaleRight: drivenActionRightScale.get(),
    }));
  });

  // Handle drag end with velocity for more natural swipe
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    setIsDragOffBoundary(null);

    const xOffset = info.offset.x;
    const velocity = info.velocity.x;
    const direction = xOffset > 0 ? "right" : "left";

    // Determine if card should exit based on position or velocity
    const shouldExit =
      Math.abs(xOffset) > offsetBoundary || Math.abs(velocity) > 800; // Exit if velocity is high enough

    if (shouldExit) {
      setDirection(direction);
    }
  };

  return (
    <>
      {/* Driven wrapper - Visual card */}
      <motion.div
        className={`absolute w-full h-full bg-white rounded-lg shadow-lg`}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
          y: drivenY,
          rotate: drivenRotation,
          x: drivenX,
          boxShadow: isHovered
            ? "0 15px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)"
            : "0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)",
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          restDelta: 0.001,
        }}
        onMouseEnter={() =>
          isLast && !isDragging && !exitDirection && setIsHovered(true)
        }
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        ref={containerRef}
      >
        {/* Left swipe indicator */}
        {/* <motion.div
          className="absolute top-5 left-5 z-10 bg-redz-700 text-white px-3 py-1 rounded-full font-bold transform -rotate-12"
          style={{
            opacity: leftOpacity,
            scale: drivenActionLeftScale,
            originX: 0,
            originY: 0,
          }}
        >
          NOPE
        </motion.div> */}

        {/* Right swipe indicator */}
        {/* <motion.div
          className="absolute top-5 right-5 z-10 bg-emerald-500 text-white px-3 py-1 rounded-full font-bold transform rotate-12"
          style={{
            opacity: rightOpacity,
            scale: drivenActionRightScale,
            originX: 1,
            originY: 0,
          }}
        >
          YES
        </motion.div> */}

        {/* RSVP Badge - Only show for photos from users who have RSVP'd */}
        {isRsvp && (
          <div
            className="box box--4"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <div className="box_rotate">
              <svg
                enableBackground="new 0 0 300 300"
                preserveAspectRatio="xMidYMid meet"
                version="1.1"
                viewBox="0 0 300 300"
                x="0px"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                y="0px"
                className="text-white font-sans"
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 150, 150 m -40, 0 a 40,40 0 0,1 80,0 a 40,40 0 0,1 -80,0 "
                  />
                </defs>
                <circle cx="150" cy="100" fill="none" r="75" />
                <g>
                  <use fill="none" xlinkHref="#circlePath" />
                  <text fill="#fff" className="text-white font-sans">
                    <textPath
                      xlinkHref="#circlePath"
                      className="text-white font-sans"
                    >
                      RSVP | RSVP | RSVP | RSVP | RSVP | RSVP |
                    </textPath>
                  </text>
                </g>
              </svg>
            </div>
          </div>
        )}

        <div
          className={`polaroid-container ${isShaking ? "animate-shake" : ""}`}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            transformStyle: "preserve-3d",
            transition: "box-shadow 0.3s ease",
          }}
        >
          <div
            className="photo-border"
            style={{
              position: "absolute",
              top: "5%",
              left: "5%",
              width: "90%",
              height: "72%",
              backgroundColor: "#f0f0f0",
              boxShadow: "inset 0 0 8px rgba(0, 0, 0, 0.1)",
              transformStyle: "preserve-3d",
              transform: "translateZ(0.5px)",
              borderRadius: "2px",
            }}
          />
          <div
            className="photo-container"
            style={{
              position: "absolute",
              top: "6%",
              left: "6%",
              width: "88%",
              height: "70%",
              backgroundColor: photoData ? "transparent" : "#e5e7eb",
              transformStyle: "preserve-3d",
              transform: "translateZ(1px)",
              overflow: "hidden",
              borderRadius: "1px",
            }}
          >
            {photoData && (
              <Image
                src={photoData}
                alt="Polaroid photo"
                fill
                sizes="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
          </div>
          <div
            className="photo-texture"
            style={{
              position: "absolute",
              top: "6%",
              left: "6%",
              width: "88%",
              height: "70%",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%)",
              transformStyle: "preserve-3d",
              transform: "translateZ(1.5px)",
              pointerEvents: "none",
              opacity: 0.3,
            }}
          />
          <div
            className="note-area-shadow"
            style={{
              position: "absolute",
              bottom: "4%",
              left: "9%",
              width: "82%",
              height: "16%",
              backgroundColor: "#ffff",
              transformStyle: "preserve-3d",
              transform: "translateZ(0.25px)",
              borderRadius: "2px",
            }}
          />
          <div
            className="note-area"
            style={{
              position: "absolute",
              bottom: "5%",
              left: "10%",
              width: "80%",
              height: "15%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transformStyle: "preserve-3d",
              transform: "translateZ(0.5px)",
            }}
          >
            <p
              className="font-handwriting"
              style={{
                margin: 0,
                padding: 0,
                fontSize,
                color: "#2a2a2a",
                textAlign: "center",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: note.length > 60 ? 3 : 2,
                WebkitBoxOrient: "vertical",
                lineHeight: note.length > 60 ? "1.2" : "1.3",
              }}
            >
              {note}
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        id={id}
        className={`absolute w-full aspect-[100/150] ${
          !isDragging ? "hover:cursor-grab" : "cursor-grabbing"
        }`}
        drag="x"
        dragSnapToOrigin
        dragElastic={0.15} // More elastic for better feel
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{
          bounceStiffness: 600,
          bounceDamping: 40,
          power: 0.5, // More natural feeling swipe
        }}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) => {
          const offset = info.offset.x;

          if (offset < 0 && offset < offsetBoundary * -1) {
            setIsDragOffBoundary("left");
          } else if (offset > 0 && offset > offsetBoundary) {
            setIsDragOffBoundary("right");
          } else {
            setIsDragOffBoundary(null);
          }
        }}
        onDragEnd={handleDragEnd}
        style={{ x }}
      ></motion.div>
    </>
  );
};

export default PolaroidFrame;
