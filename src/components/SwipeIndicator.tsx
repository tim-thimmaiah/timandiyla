import React from "react";
import { motion } from "framer-motion";

interface SwipeIndicatorProps {
  className?: string;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({ className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div className="relative flex items-center">
          {/* Hand icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#DA4D73] opacity-70"
          >
            <path
              d="M6.5 12L6.5 7C6.5 5.89543 7.39543 5 8.5 5C9.60457 5 10.5 5.89543 10.5 7L10.5 12M6.5 12C6.5 13.1046 7.39543 14 8.5 14C9.60457 14 10.5 13.1046 10.5 12M6.5 12H4.5M10.5 12H12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.5 12L10.5 9C10.5 7.89543 11.3954 7 12.5 7C13.6046 7 14.5 7.89543 14.5 9L14.5 12M10.5 12C10.5 13.1046 11.3954 14 12.5 14C13.6046 14 14.5 13.1046 14.5 12M14.5 12L14.5 11C14.5 9.89543 15.3954 9 16.5 9C17.6046 9 18.5 9.89543 18.5 11L18.5 12M14.5 12C14.5 13.1046 15.3954 14 16.5 14C17.6046 14 18.5 13.1046 18.5 12M18.5 12L18.5 11.5C18.5 10.3954 19.3954 9.5 20.5 9.5C21.6046 9.5 22.5 10.3954 22.5 11.5L22.5 16.5C22.5 19.2614 20.2614 21.5 17.5 21.5H10.5C6.08172 21.5 2.5 17.9183 2.5 13.5L2.5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Swipe animation */}
          <motion.div
            className="absolute left-6"
            animate={{ x: [0, 20, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#DA4D73] opacity-70"
            >
              <path
                d="M13 9L16 12M16 12L13 15M16 12H8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SwipeIndicator;
