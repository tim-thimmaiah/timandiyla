import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
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

  //animation
  const x = useMotionValue(0);
  // const isMobile = useMediaQuery("(max-width: 768px)");

  const offsetBoundary = 150;

  const inputX = [offsetBoundary * -1, 0, offsetBoundary];
  const outputX = [-200, 0, 200];
  const outputY = [50, 0, 50];
  const outputRotate = [-40, 0, 40];
  const outputActionScaleBadAnswer = [3, 1, 0.3];
  const outputActionScaleRightAnswer = [0.3, 1, 3];
  const drivenX = useTransform(x, inputX, outputX);
  const drivenY = useTransform(x, inputX, outputY);
  const drivenRotation = useTransform(x, inputX, outputRotate);
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

  useMotionValueEvent(x, "change", (latest) => {
    setCardDrivenProps((state) => ({
      ...state,
      cardWrapperX: latest,
      buttonScaleLeft: drivenActionLeftScale.get(),
      buttonScaleRight: drivenActionRightScale.get(),
    }));
  });

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
        }}
        transition={{
          rotateX: { duration: 0.1 },
          rotateY: { duration: 0.1 },
          scale: { duration: 0.1 },
        }}
        onMouseEnter={() =>
          isLast && !isDragging && !exitDirection && setIsHovered(true)
        }
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        ref={containerRef}
      >
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
            boxShadow: isHovered
              ? "0 15px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)"
              : "0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)",
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
          <div
            className="paper-texture"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "url('data:image/png;base64,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') repeat",
              opacity: 0.03,
              pointerEvents: "none",
              transformStyle: "preserve-3d",
              transform: "translateZ(2px)",
            }}
          />
        </div>
      </motion.div>
      <motion.div
        id={id}
        className={`absolute w-full aspect-[100/150] ${
          !isDragging ? "hover:cursor-grab" : ""
        }`}
        drag="x"
        dragSnapToOrigin
        dragElastic={false ? 0.2 : 0.06}
        dragConstraints={{ left: 0, right: 0 }}
        dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
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
        onDragEnd={(_, info) => {
          setIsDragging(false);
          setIsDragOffBoundary(null);
          const isOffBoundary =
            info.offset.x > offsetBoundary || info.offset.x < -offsetBoundary;
          const direction = info.offset.x > 0 ? "right" : "left";

          if (isOffBoundary) {
            setDirection(direction);
          }
        }}
        style={{ x }}
      ></motion.div>
    </>
  );
};

export default PolaroidFrame;
