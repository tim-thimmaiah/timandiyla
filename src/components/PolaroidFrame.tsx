import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { motion } from "framer-motion";

// Badge types
export type BadgeType = "rsvp" | "coming" | "cantWait" | null;

// Badge properties interface
interface BadgeProperties {
  text: string;
  color: string;
  rotation: string;
  shape: "stamp" | "flower" | "scalloped";
  extraStyles: CSSProperties;
}

interface PolaroidFrameProps {
  photoData: string | null;
  note: string;
  badge?: BadgeType;
  isPreview?: boolean;
  className?: string;
  triggerShake?: boolean;
  onShake?: () => void;
}

const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  photoData,
  note,
  badge = null,
  isPreview = false,
  className = "",
  triggerShake = false,
  onShake,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Calculate font size based on note length
  const calculateFontSize = () => {
    if (!note) return isPreview ? "14px" : "18px";

    // Base font size
    const baseFontSize = isPreview ? 14 : 18;

    // Adjust font size based on text length
    if (note.length <= 20) {
      return `${baseFontSize}px`;
    } else if (note.length <= 40) {
      return `${baseFontSize - 2}px`;
    } else if (note.length <= 60) {
      return `${baseFontSize - 4}px`;
    } else if (note.length <= 80) {
      return `${baseFontSize - 5}px`;
    } else {
      return `${baseFontSize - 6}px`;
    }
  };

  // Get badge properties
  const getBadgeProperties = (): BadgeProperties | null => {
    const r = isPreview ? "10px" : "15px"; // Radius for stamp and scalloped shapes

    switch (badge) {
      case "rsvp":
        return {
          text: "RSVP'd",
          color: "#DA4D73", // Pink
          rotation: "-5deg",
          shape: "stamp",
          extraStyles: {
            height: isPreview ? "40px" : "60px",
            aspectRatio: "1.5",
            padding: r,
            background: "#DA4D73",
            mask: `radial-gradient(50% 50%,#0000 66%,#000 67%) round ${r} ${r}/calc(2*${r}) calc(2*${r}), conic-gradient(#000 0 0) content-box`,
            WebkitMask: `radial-gradient(50% 50%,#0000 66%,#000 67%) round ${r} ${r}/calc(2*${r}) calc(2*${r}), conic-gradient(#000 0 0) content-box`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isPreview ? "10px" : "14px",
            color: "white",
            textAlign: "center",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
          } as CSSProperties,
        };
      case "coming":
        return {
          text: "We're coming!",
          color: "#4CAF50", // Green
          rotation: "3deg",
          shape: "flower",
          extraStyles: {
            width: isPreview ? "50px" : "70px",
            aspectRatio: "1",
            background: "#4CAF50",
            "--g":
              "/20.56% 20.56% radial-gradient(#000 calc(71% - 1px),#0000 71%) no-repeat",
            mask: "100% 50% var(--g),93.301% 75% var(--g),75% 93.301% var(--g),50% 100% var(--g),25% 93.301% var(--g),6.699% 75% var(--g),0% 50% var(--g),6.699% 25% var(--g),25% 6.699% var(--g),50% 0% var(--g),75% 6.699% var(--g),93.301% 25% var(--g),radial-gradient(100% 100%,#000 38.366%,#0000 calc(38.366% + 1px))",
            WebkitMask:
              "100% 50% var(--g),93.301% 75% var(--g),75% 93.301% var(--g),50% 100% var(--g),25% 93.301% var(--g),6.699% 75% var(--g),0% 50% var(--g),6.699% 25% var(--g),25% 6.699% var(--g),50% 0% var(--g),75% 6.699% var(--g),93.301% 25% var(--g),radial-gradient(100% 100%,#000 38.366%,#0000 calc(38.366% + 1px))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isPreview ? "9px" : "14px",
            color: "white",
            textAlign: "center",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
          } as CSSProperties,
        };
      case "cantWait":
        return {
          text: "Can't wait!",
          color: "#2196F3", // Blue
          rotation: "-3deg",
          shape: "scalloped",
          extraStyles: {
            height: isPreview ? "50px" : "70px",
            aspectRatio: "1",
            padding: `calc(1.5*${r})`,
            background: "#2196F3",
            mask: `linear-gradient(#000 0 0) no-repeat 50%/calc(100% - 2*${r}) calc(100% - 2*${r}), radial-gradient(farthest-side,#000 97%,#0000) 0 0/calc(2*${r}) calc(2*${r}) round`,
            WebkitMask: `linear-gradient(#000 0 0) no-repeat 50%/calc(100% - 2*${r}) calc(100% - 2*${r}), radial-gradient(farthest-side,#000 97%,#0000) 0 0/calc(2*${r}) calc(2*${r}) round`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isPreview ? "9px" : "14px",
            color: "white",
            textAlign: "center",
            boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
          } as CSSProperties,
        };
      default:
        return null;
    }
  };

  // Update container dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      // This function ensures the container is properly sized
      // but doesn't need to store dimensions in state
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Handle shake when triggerShake prop changes
  useEffect(() => {
    if (triggerShake && !isShaking) {
      setIsShaking(true);
      if (onShake) onShake();

      setTimeout(() => {
        setIsShaking(false);
      }, 500); // Animation duration
    }
  }, [triggerShake, isShaking, onShake]);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized mouse position (-1 to 1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePosition({ x, y });
    }
  };

  // Calculate rotation based on mouse position
  const rotateX = isHovered ? -mousePosition.y * 15 : 0; // Max 15 degrees
  const rotateY = isHovered ? mousePosition.x * 15 : 0; // Max 15 degrees

  // Floating animation properties
  const floatY = isHovered
    ? 0
    : "calc(sin(var(--float-time, 0) * 0.5rad) * 5px)";
  const floatRotateY = isHovered
    ? 0
    : "calc(sin(var(--float-time, 0) * 0.3rad) * 3deg)";

  // Scale slightly on hover
  const scale = isHovered ? 1.02 : 1;

  // Base dimensions (aspect ratio from the 3D component)
  const baseWidth = isPreview ? "200px" : "300px";
  const baseHeight = isPreview ? "280px" : "400px";

  // Get dynamic font size
  const fontSize = calculateFontSize();

  // Get badge properties
  const badgeProps = getBadgeProperties();

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "-20px", // Add negative margin to overlap with SVG text
        zIndex: 10, // Ensure polaroid is above the SVG
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className={`polaroid-container ${isShaking ? "animate-shake" : ""}`}
        style={{
          width: baseWidth,
          height: baseHeight,
          maxWidth: "100%",
          maxHeight: "100%",
          transformStyle: "preserve-3d",
          transform: `
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateY(${floatY}) 
            rotateY(${floatRotateY})
            scale(${scale})
          `,
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.5s ease-out",
          position: "relative",
        }}
        animate={{
          "--float-time": [0, Math.PI * 2],
        }}
        transition={{
          "--float-time": {
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          },
        }}
      >
        {/* Polaroid frame */}
        <div
          className="polaroid-frame"
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
          {/* Photo area with subtle border */}
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
              <img
                src={photoData}
                alt="Polaroid photo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
          </div>

          {/* Subtle texture overlay for the photo */}
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

          {/* Badge */}
          {badgeProps && (
            <div
              className="badge font-sans"
              style={{
                position: "absolute",
                top: "2%",
                right: "5%",
                transform: `translateZ(3px) rotate(${badgeProps.rotation})`,
                transformStyle: "preserve-3d",
                zIndex: 20,
              }}
            >
              <div style={badgeProps.extraStyles}>{badgeProps.text}</div>
            </div>
          )}

          {/* Note area with subtle shadow */}
          <div
            className="note-area-shadow"
            style={{
              position: "absolute",
              bottom: "4%",
              left: "9%",
              width: "82%",
              height: "16%",
              backgroundColor: "#ffff",
              // boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.05)",
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
                fontSize: fontSize,
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

          {/* Subtle paper texture overlay */}
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
    </motion.div>
  );
};

export default PolaroidFrame;
