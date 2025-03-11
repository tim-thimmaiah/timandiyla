import React from "react";

interface PolaroidFrameProps {
  photoData: string | null;
  note: string;
  isPreview?: boolean;
}

const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  photoData,
  note,
  isPreview = false,
}) => {
  return (
    <div
      className={`relative bg-white shadow-lg rounded-sm ${
        isPreview ? "w-full max-w-xs" : "w-full max-w-md"
      } mx-auto transform transition-transform duration-300 hover:rotate-1`}
    >
      {/* Polaroid frame */}
      <div className="p-3 pb-14">
        {/* Photo area */}
        <div className="aspect-[4/5] w-full bg-gray-100 overflow-hidden">
          {photoData ? (
            <img
              src={photoData}
              alt="Memory photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500 text-center p-4">
                {isPreview ? "Your photo will appear here" : "No photo taken"}
              </p>
            </div>
          )}
        </div>

        {/* Note area */}
        <div className="mt-4 text-center">
          <p className="font-handwriting text-lg text-gray-800 px-2 break-words">
            {note || (isPreview && "Your note will appear here")}
          </p>
        </div>
      </div>

      {/* Polaroid developing animation */}
      {photoData && (
        <div className="absolute inset-0 bg-white animate-develop pointer-events-none"></div>
      )}
    </div>
  );
};

export default PolaroidFrame;

// Add this to your globals.css or tailwind.config.js
// @keyframes develop {
//   0% { opacity: 1; }
//   100% { opacity: 0; }
// }
// .animate-develop {
//   animation: develop 3s forwards;
// }
