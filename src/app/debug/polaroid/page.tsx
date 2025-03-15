"use client";

import React, { useState } from "react";
import PolaroidFrame3D from "@/components/PolaroidFrame3D";

// Create a custom type for 3D effect parameters
interface ThreeDEffectParams {
  rotationSpeed: number;
  floatAmplitude: number;
  hoverRotation: number;
  hoverScale: number;
}

// Camera settings
interface CameraSettings {
  positionZ: number;
  fov: number;
}

// Lighting settings
interface LightingSettings {
  ambientIntensity: number;
  pointLightIntensity: number;
  pointLightX: number;
  pointLightY: number;
  pointLightZ: number;
}

const DebugPolaroid: React.FC = () => {
  // State for component props
  const [note, setNote] = useState<string>("Hello from the debug page!");
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [photoData, setPhotoData] = useState<string | null>(null);

  // State for 3D effect parameters
  const [effectParams, setEffectParams] = useState<ThreeDEffectParams>({
    rotationSpeed: 0.3,
    floatAmplitude: 0.05,
    hoverRotation: 0.05,
    hoverScale: 1.05,
  });

  // State for camera settings
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    positionZ: 5,
    fov: 50,
  });

  // State for lighting settings
  const [lightingSettings, setLightingSettings] = useState<LightingSettings>({
    ambientIntensity: 0.5,
    pointLightIntensity: 1,
    pointLightX: 10,
    pointLightY: 10,
    pointLightZ: 10,
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState<
    "basic" | "effects" | "camera" | "lighting"
  >("basic");

  // Sample images for testing
  const sampleImages = [
    null,
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=2574&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2669&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522143049013-2519756a52d4?q=80&w=2670&auto=format&fit=crop",
  ];

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Loading file:", file.name, file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        console.log("File loaded, data URL length:", result.length);
        setPhotoData(result);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle effect parameter changes
  const handleEffectParamChange = (
    param: keyof ThreeDEffectParams,
    value: number
  ) => {
    setEffectParams((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  // Handle camera setting changes
  const handleCameraSettingChange = (
    param: keyof CameraSettings,
    value: number
  ) => {
    setCameraSettings((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  // Handle lighting setting changes
  const handleLightingSettingChange = (
    param: keyof LightingSettings,
    value: number
  ) => {
    setLightingSettings((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  // Reset all settings to default
  const resetAllSettings = () => {
    setEffectParams({
      rotationSpeed: 0.3,
      floatAmplitude: 0.05,
      hoverRotation: 0.05,
      hoverScale: 1.05,
    });

    setCameraSettings({
      positionZ: 5,
      fov: 50,
    });

    setLightingSettings({
      ambientIntensity: 0.5,
      pointLightIntensity: 1,
      pointLightX: 10,
      pointLightY: 10,
      pointLightZ: 10,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          PolaroidFrame Debug
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>

            {/* Tabs */}
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 ${
                  activeTab === "basic"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("basic")}
              >
                Basic
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "effects"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("effects")}
              >
                3D Effects
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "camera"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("camera")}
              >
                Camera
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "lighting"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("lighting")}
              >
                Lighting
              </button>
            </div>

            {/* Basic Controls */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                {/* Note input */}
                <div>
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Note Text
                  </label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                {/* Preview toggle */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isPreview}
                      onChange={(e) => setIsPreview(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Preview Mode
                    </span>
                  </label>
                </div>

                {/* Photo selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Photos
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleImages.map((src, index) => (
                      <button
                        key={index}
                        onClick={() => setPhotoData(src)}
                        className={`border-2 rounded-md overflow-hidden h-16 ${
                          photoData === src
                            ? "border-blue-500"
                            : "border-gray-200"
                        }`}
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={`Sample ${index}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                            None
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Your Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            )}

            {/* 3D Effect Controls */}
            {activeTab === "effects" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-3">
                  3D Effect Parameters
                </h3>

                {/* Rotation Speed */}
                <div className="mb-4">
                  <label
                    htmlFor="rotationSpeed"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Rotation Speed: {effectParams.rotationSpeed.toFixed(2)}
                  </label>
                  <input
                    id="rotationSpeed"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={effectParams.rotationSpeed}
                    onChange={(e) =>
                      handleEffectParamChange(
                        "rotationSpeed",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Float Amplitude */}
                <div className="mb-4">
                  <label
                    htmlFor="floatAmplitude"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Float Amplitude: {effectParams.floatAmplitude.toFixed(2)}
                  </label>
                  <input
                    id="floatAmplitude"
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    value={effectParams.floatAmplitude}
                    onChange={(e) =>
                      handleEffectParamChange(
                        "floatAmplitude",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Hover Rotation */}
                <div className="mb-4">
                  <label
                    htmlFor="hoverRotation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hover Rotation: {effectParams.hoverRotation.toFixed(2)}
                  </label>
                  <input
                    id="hoverRotation"
                    type="range"
                    min="0"
                    max="0.2"
                    step="0.01"
                    value={effectParams.hoverRotation}
                    onChange={(e) =>
                      handleEffectParamChange(
                        "hoverRotation",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Hover Scale */}
                <div className="mb-4">
                  <label
                    htmlFor="hoverScale"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hover Scale: {effectParams.hoverScale.toFixed(2)}
                  </label>
                  <input
                    id="hoverScale"
                    type="range"
                    min="1"
                    max="1.2"
                    step="0.01"
                    value={effectParams.hoverScale}
                    onChange={(e) =>
                      handleEffectParamChange(
                        "hoverScale",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Camera Controls */}
            {activeTab === "camera" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-3">Camera Settings</h3>

                {/* Camera Position Z */}
                <div className="mb-4">
                  <label
                    htmlFor="positionZ"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Camera Distance: {cameraSettings.positionZ.toFixed(1)}
                  </label>
                  <input
                    id="positionZ"
                    type="range"
                    min="2"
                    max="10"
                    step="0.1"
                    value={cameraSettings.positionZ}
                    onChange={(e) =>
                      handleCameraSettingChange(
                        "positionZ",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Camera FOV */}
                <div className="mb-4">
                  <label
                    htmlFor="fov"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Field of View: {cameraSettings.fov.toFixed(0)}°
                  </label>
                  <input
                    id="fov"
                    type="range"
                    min="20"
                    max="100"
                    step="1"
                    value={cameraSettings.fov}
                    onChange={(e) =>
                      handleCameraSettingChange(
                        "fov",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Lighting Controls */}
            {activeTab === "lighting" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium mb-3">Lighting Settings</h3>

                {/* Ambient Light Intensity */}
                <div className="mb-4">
                  <label
                    htmlFor="ambientIntensity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ambient Light:{" "}
                    {lightingSettings.ambientIntensity.toFixed(2)}
                  </label>
                  <input
                    id="ambientIntensity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={lightingSettings.ambientIntensity}
                    onChange={(e) =>
                      handleLightingSettingChange(
                        "ambientIntensity",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Point Light Intensity */}
                <div className="mb-4">
                  <label
                    htmlFor="pointLightIntensity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Point Light Intensity:{" "}
                    {lightingSettings.pointLightIntensity.toFixed(2)}
                  </label>
                  <input
                    id="pointLightIntensity"
                    type="range"
                    min="0"
                    max="2"
                    step="0.01"
                    value={lightingSettings.pointLightIntensity}
                    onChange={(e) =>
                      handleLightingSettingChange(
                        "pointLightIntensity",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Point Light Position X */}
                <div className="mb-4">
                  <label
                    htmlFor="pointLightX"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Light Position X: {lightingSettings.pointLightX.toFixed(1)}
                  </label>
                  <input
                    id="pointLightX"
                    type="range"
                    min="-20"
                    max="20"
                    step="0.1"
                    value={lightingSettings.pointLightX}
                    onChange={(e) =>
                      handleLightingSettingChange(
                        "pointLightX",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Point Light Position Y */}
                <div className="mb-4">
                  <label
                    htmlFor="pointLightY"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Light Position Y: {lightingSettings.pointLightY.toFixed(1)}
                  </label>
                  <input
                    id="pointLightY"
                    type="range"
                    min="-20"
                    max="20"
                    step="0.1"
                    value={lightingSettings.pointLightY}
                    onChange={(e) =>
                      handleLightingSettingChange(
                        "pointLightY",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>

                {/* Point Light Position Z */}
                <div className="mb-4">
                  <label
                    htmlFor="pointLightZ"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Light Position Z: {lightingSettings.pointLightZ.toFixed(1)}
                  </label>
                  <input
                    id="pointLightZ"
                    type="range"
                    min="-20"
                    max="20"
                    step="0.1"
                    value={lightingSettings.pointLightZ}
                    onChange={(e) =>
                      handleLightingSettingChange(
                        "pointLightZ",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div className="mt-6 pt-4 border-t">
              <button
                onClick={resetAllSettings}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
              >
                Reset All Settings
              </button>
            </div>
          </div>

          {/* Component Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-full max-w-md">
              <PolaroidFrame3D
                photoData={photoData}
                note={note}
                isPreview={isPreview}
                effectParams={effectParams}
                cameraSettings={cameraSettings}
                lightingSettings={lightingSettings}
              />
            </div>
          </div>
        </div>

        {/* Component Props Display */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Props</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
            {JSON.stringify(
              {
                photoData: photoData
                  ? `${photoData.substring(0, 30)}...`
                  : null,
                note,
                isPreview,
                effectParams,
                cameraSettings,
                lightingSettings,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DebugPolaroid;
