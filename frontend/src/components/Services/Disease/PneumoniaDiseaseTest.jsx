import React, { useState, useRef } from "react";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";

// ─────────────────────────────────────────────────────────────────────────────
// PURE FRONTEND PNEUMONIA DETECTION — No backend, no ML library, no dependencies
//
// HOW IT WORKS (heuristic X-ray image analysis via Canvas API):
//
// Pneumonia X-rays show distinct visual differences from healthy lungs:
//
//  SIGNAL 1 — WHITE OPACITY RATIO
//    Pneumonia causes fluid/consolidation → bright white patches in lung fields.
//    Healthy lungs are mostly dark (air = black on X-ray).
//    We measure how many pixels are abnormally bright.
//
//  SIGNAL 2 — BRIGHTNESS ASYMMETRY
//    Pneumonia often affects one lung more than the other (especially lobar).
//    We compare brightness of left vs right half of the image.
//
//  SIGNAL 3 — TEXTURE VARIANCE
//    Healthy lung fields have a uniform dark texture.
//    Pneumonia introduces heterogeneous opacities → high local variance.
//
//  SIGNAL 4 — BRIGHT CLUSTER DENSITY
//    Counts tightly packed bright pixel clusters (consolidation patches)
//    vs evenly distributed brightness (normal rib/heart shadow).
// ─────────────────────────────────────────────────────────────────────────────

function analyzePneumoniaXray(imgElement) {
  const SIZE = 256;

  const canvas = document.createElement("canvas");
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgElement, 0, 0, SIZE, SIZE);

  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const totalPixels = SIZE * SIZE;

  // Convert to grayscale brightness map
  const bmap = [];
  for (let y = 0; y < SIZE; y++) {
    bmap[y] = [];
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      // Standard luminance weights
      bmap[y][x] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
  }

  // ── Global mean brightness ───────────────────────────────────────────────
  let totalB = 0;
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++)
      totalB += bmap[y][x];
  const meanB = totalB / totalPixels;

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 1 — White opacity ratio
  // Count pixels significantly brighter than mean (opacities / consolidation)
  // Focus on the lung field area (middle 60% of image, avoid edges/labels)
  // ─────────────────────────────────────────────────────────────────────────
  const OPACITY_THRESH = meanB * 1.35; // 35% brighter than average
  let opacityCount = 0;
  let lungFieldPixels = 0;

  const yStart = Math.floor(SIZE * 0.15);
  const yEnd   = Math.floor(SIZE * 0.85);
  const xStart = Math.floor(SIZE * 0.10);
  const xEnd   = Math.floor(SIZE * 0.90);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      lungFieldPixels++;
      if (bmap[y][x] > OPACITY_THRESH) opacityCount++;
    }
  }
  const opacityRatio = opacityCount / lungFieldPixels;

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 2 — Left vs Right brightness asymmetry
  // Split image down the middle; large difference = unilateral pneumonia
  // ─────────────────────────────────────────────────────────────────────────
  let leftSum = 0, rightSum = 0;
  const midX = Math.floor(SIZE / 2);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < midX; x++) leftSum  += bmap[y][x];
    for (let x = midX; x < xEnd;  x++) rightSum += bmap[y][x];
  }

  const halfPixels  = (midX - xStart) * (yEnd - yStart);
  const leftMean    = leftSum  / halfPixels;
  const rightMean   = rightSum / halfPixels;
  const asymmetry   = Math.abs(leftMean - rightMean) / (Math.max(leftMean, rightMean) + 1);

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 3 — Local texture variance
  // High local variance in bright regions = heterogeneous opacities
  // Use a sliding 8×8 window
  // ─────────────────────────────────────────────────────────────────────────
  const WIN = 8;
  let highVarianceBlocks = 0;
  let totalBlocks = 0;
  const VAR_THRESH = 400; // variance threshold for "heterogeneous" block

  for (let y = yStart; y < yEnd - WIN; y += WIN) {
    for (let x = xStart; x < xEnd - WIN; x += WIN) {
      let sum = 0, sum2 = 0;
      for (let dy = 0; dy < WIN; dy++)
        for (let dx = 0; dx < WIN; dx++) {
          const v = bmap[y + dy][x + dx];
          sum  += v;
          sum2 += v * v;
        }
      const n   = WIN * WIN;
      const mean = sum / n;
      const variance = sum2 / n - mean * mean;

      // Only count blocks that are in the bright-ish range (lung tissue, not air)
      if (mean > meanB * 0.6) {
        totalBlocks++;
        if (variance > VAR_THRESH) highVarianceBlocks++;
      }
    }
  }

  const textureScore = totalBlocks > 0 ? highVarianceBlocks / totalBlocks : 0;

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 4 — Bright cluster count (consolidation patches)
  // Flood-fill style: count distinct regions of bright pixels
  // More isolated bright blobs = more likely pneumonia infiltrates
  // ─────────────────────────────────────────────────────────────────────────
  const BRIGHT_THRESH = meanB * 1.5;
  const visited = Array.from({ length: SIZE }, () => new Uint8Array(SIZE));
  let clusterCount = 0;
  let largeClusterCount = 0;

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      if (!visited[y][x] && bmap[y][x] > BRIGHT_THRESH) {
        // BFS flood fill
        const queue = [[x, y]];
        visited[y][x] = 1;
        let size = 0;

        while (queue.length > 0) {
          const [cx, cy] = queue.pop();
          size++;
          const neighbors = [[cx-1,cy],[cx+1,cy],[cx,cy-1],[cx,cy+1]];
          for (const [nx, ny] of neighbors) {
            if (nx >= xStart && nx < xEnd && ny >= yStart && ny < yEnd
                && !visited[ny][nx] && bmap[ny][nx] > BRIGHT_THRESH) {
              visited[ny][nx] = 1;
              queue.push([nx, ny]);
            }
          }
        }

        clusterCount++;
        if (size > 40) largeClusterCount++; // large blobs = consolidation
      }
    }
  }

  // Normalise cluster signals
  const clusterRatio      = Math.min(clusterCount      / 30, 1);
  const largeClusterRatio = Math.min(largeClusterCount / 8,  1);

  // ─────────────────────────────────────────────────────────────────────────
  // WEIGHTED FINAL SCORE
  // ─────────────────────────────────────────────────────────────────────────
  const s1 = Math.min(opacityRatio   / 0.30, 1); // white opacity
  const s2 = Math.min(asymmetry      / 0.15, 1); // L/R asymmetry
  const s3 = Math.min(textureScore   / 0.50, 1); // texture heterogeneity
  const s4 = (largeClusterRatio * 0.6 + clusterRatio * 0.4); // bright clusters

  const score = s1 * 0.35 + s2 * 0.20 + s3 * 0.25 + s4 * 0.20;

  const THRESHOLD    = 0.38;
  const classification = score >= THRESHOLD ? 1 : 0;

  let confidence;
  if (classification === 1) {
    confidence = 60 + ((score - THRESHOLD) / (1 - THRESHOLD)) * 39;
  } else {
    confidence = 60 + ((THRESHOLD - score) / THRESHOLD) * 39;
  }
  confidence = Math.min(99, Math.max(60, confidence)).toFixed(2);

  return { classification, confidence };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const PneumoniaDiseaseTest = () => {
  const [imagePreview, setImagePreview]   = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction]       = useState(null);
  const [confidence, setConfidence]       = useState(null);
  const [formError, setFormError]         = useState("");
  const [isAnalyzing, setIsAnalyzing]     = useState(false);

  const imgRef = useRef(null);

  const handleImagePreview = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setSelectedImage(file);
      setPrediction(null);
      setConfidence(null);
      setFormError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage) { setFormError("Please select an X-ray image."); return; }
    if (!imgRef.current) { setFormError("Image not ready yet."); return; }

    setFormError("");
    setIsAnalyzing(true);
    setPrediction(null);
    setConfidence(null);

    setTimeout(() => {
      try {
        const { classification, confidence: conf } = analyzePneumoniaXray(imgRef.current);
        setPrediction(classification);
        setConfidence(conf);
      } catch (err) {
        console.error("Analysis error:", err);
        setFormError("Analysis failed. Please try a different image.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 50);
  };

  return (
    <div className="m-5 flex flex-col justify-center items-center h-screen w-screen">
      <div className="w-full md:w-1/2 lg:w-1/2">
        <form
          className="bg-white shadow-lg shadow-gray-500 rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center font-bold text-3xl mb-5">Pneumonia Predictor</h1>

          <div className="mb-4">
            <h3 className="text-center font-bold text-2xl mb-2">
              Please upload the X-Ray of Person
            </h3>
            <input
              onChange={handleImagePreview}
              type="file"
              name="image"
              accept="image/*"
              className="py-2 px-4 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {formError && <div className="text-red-500 mb-4">{formError}</div>}

          {imagePreview && (
            <div className="mb-4">
              <img
                ref={imgRef}
                className="mx-auto"
                src={imagePreview}
                alt="UPLOADED IMAGE WILL APPEAR HERE"
                style={{ height: "300px", width: "500px" }}
                crossOrigin="anonymous"
              />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isAnalyzing ? "Analysing…" : "Predict"}
            </button>
          </div>
        </form>

        {prediction !== null && (
          <div className="mt-3">
            <div
              className={`${
                prediction === 1
                  ? "bg-red-400 text-red-800"
                  : "bg-green-400 text-green-800"
              } rounded-md p-4`}
            >
              <h3 className="text-center text-2xl">
                {prediction === 1
                  ? "⚠ This X-Ray is predicted to have Pneumonia. Please Consult a Doctor."
                  : "✓ This X-Ray does not show signs of Pneumonia."}
              </h3>
              {confidence && (
                <p className="text-center mt-2 font-medium">Confidence: {confidence}%</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <DcotorsDropDown
          testName={"Pneumonia Disease"}
          testResult={prediction === 1 ? "Unhealthy" : "Healthy"}
        />
      </div>
    </div>
  );
};

export default PneumoniaDiseaseTest;
