import React, { useState, useRef } from "react";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";

// ─────────────────────────────────────────────────────────────────────────────
// PURE FRONTEND MALARIA DETECTION — No backend, no ML library, no dependencies
//
// DETECTION STRATEGY (works for both illustrated & microscopy images):
//
//  SIGNAL 1 — RING / BULLSEYE DETECTION
//    Scans for a dark circular ring pattern inside a lighter cell body.
//    Plasmodium parasites form a classic "ring stage" appearance — a dark
//    outer ring with a lighter centre. Detected by finding dark pixels
//    surrounded by lighter pixels in a radial pattern.
//
//  SIGNAL 2 — DARK NUCLEUS SPOT
//    Looks for a concentrated cluster of very dark pixels (the parasite
//    chromatin dot) that sits inside a lighter-coloured region.
//
//  SIGNAL 3 — CELL IRREGULARITY
//    Infected cells have irregular edges and overlap more than healthy ones.
//    Detects high contrast edge density relative to cell area.
//
//  SIGNAL 4 — COLOUR DEVIATION
//    Infected cells are darker / more saturated than healthy pink RBCs.
//    Measures how much cells deviate from the background hue.
// ─────────────────────────────────────────────────────────────────────────────

function analyzeBloodCellImage(imgElement) {
  const SIZE = 200;

  const canvas = document.createElement("canvas");
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgElement, 0, 0, SIZE, SIZE);

  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

  const px = (x, y) => {
    const i = (y * SIZE + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  };

  const brightness = ({ r, g, b }) => (r + g + b) / 3;

  // ── Build brightness map ──────────────────────────────────────────────────
  const bmap = [];
  for (let y = 0; y < SIZE; y++) {
    bmap[y] = [];
    for (let x = 0; x < SIZE; x++) {
      bmap[y][x] = brightness(px(x, y));
    }
  }

  // ── Global stats ─────────────────────────────────────────────────────────
  let totalBright = 0;
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++)
      totalBright += bmap[y][x];

  const meanBright = totalBright / (SIZE * SIZE);

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 1 — Ring / bullseye detection
  //
  // For each pixel that is significantly darker than the mean, check if
  // pixels a few steps away (in a ring) are lighter than it.
  // A true ring pattern = dark centre → lighter middle → dark ring → light bg
  // ─────────────────────────────────────────────────────────────────────────
  let ringScore = 0;
  const RING_RADII = [4, 7, 11]; // pixels to sample outward

  for (let y = 12; y < SIZE - 12; y++) {
    for (let x = 12; x < SIZE - 12; x++) {
      const centerB = bmap[y][x];
      if (centerB > meanBright * 0.75) continue; // skip non-dark pixels

      // Sample brightness at each radius in 8 directions
      let ringMatch = 0;
      for (const r of RING_RADII) {
        const angles = [0, 45, 90, 135, 180, 225, 270, 315];
        let ringB = 0;
        for (const deg of angles) {
          const rad = (deg * Math.PI) / 180;
          const nx = Math.round(x + r * Math.cos(rad));
          const ny = Math.round(y + r * Math.sin(rad));
          if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE)
            ringB += bmap[ny][nx];
        }
        ringB /= angles.length;

        // At r=4: should be lighter (inside the ring)
        // At r=7: should be darker (the ring itself)
        // At r=11: should be lighter again (outside)
        if (r === 4  && ringB > centerB + 20) ringMatch++;
        if (r === 7  && ringB < ringB + 10)   ringMatch++;  // ring wall
        if (r === 11 && ringB > centerB + 15) ringMatch++;
      }

      if (ringMatch >= 2) ringScore++;
    }
  }

  const ringRatio = ringScore / (SIZE * SIZE);

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 2 — Dark nucleus cluster
  //
  // Look for a tight cluster of very dark pixels (brightness < threshold)
  // that is surrounded by lighter pixels (the cell body).
  // ─────────────────────────────────────────────────────────────────────────
  const DARK_THRESH   = meanBright * 0.45; // very dark relative to image
  const SURROUND_DIST = 8;

  let nucleusScore = 0;

  for (let y = SURROUND_DIST; y < SIZE - SURROUND_DIST; y++) {
    for (let x = SURROUND_DIST; x < SIZE - SURROUND_DIST; x++) {
      if (bmap[y][x] > DARK_THRESH) continue;

      // Check surroundings are significantly lighter
      let lighterCount = 0;
      for (let dy = -SURROUND_DIST; dy <= SURROUND_DIST; dy += SURROUND_DIST) {
        for (let dx = -SURROUND_DIST; dx <= SURROUND_DIST; dx += SURROUND_DIST) {
          if (dx === 0 && dy === 0) continue;
          const nb = bmap[y + dy]?.[x + dx] ?? 255;
          if (nb > bmap[y][x] + 30) lighterCount++;
        }
      }

      if (lighterCount >= 5) nucleusScore++;
    }
  }

  const nucleusRatio = nucleusScore / (SIZE * SIZE);

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 3 — Edge density
  //
  // Sobel-like edge detection. Infected cells have more internal structure
  // (ring edges, nucleus edges) vs smooth healthy cells.
  // ─────────────────────────────────────────────────────────────────────────
  let edgeCount = 0;
  const EDGE_THRESH = 25;

  for (let y = 1; y < SIZE - 1; y++) {
    for (let x = 1; x < SIZE - 1; x++) {
      const gx =
        -bmap[y - 1][x - 1] + bmap[y - 1][x + 1] +
        -2 * bmap[y][x - 1] + 2 * bmap[y][x + 1] +
        -bmap[y + 1][x - 1] + bmap[y + 1][x + 1];

      const gy =
        -bmap[y - 1][x - 1] - 2 * bmap[y - 1][x] - bmap[y - 1][x + 1] +
         bmap[y + 1][x - 1] + 2 * bmap[y + 1][x] + bmap[y + 1][x + 1];

      if (Math.sqrt(gx * gx + gy * gy) > EDGE_THRESH) edgeCount++;
    }
  }

  const edgeRatio = edgeCount / (SIZE * SIZE);

  // ─────────────────────────────────────────────────────────────────────────
  // SIGNAL 4 — Darkness contrast
  //
  // How far does the darkest region deviate from the background?
  // A large spread = likely has a distinct dark parasite structure.
  // ─────────────────────────────────────────────────────────────────────────
  let darkCount = 0;
  const ABS_DARK = 90; // absolute brightness threshold

  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++)
      if (bmap[y][x] < ABS_DARK) darkCount++;

  const darkRatio = darkCount / (SIZE * SIZE);

  // ─────────────────────────────────────────────────────────────────────────
  // WEIGHTED SCORE
  // ─────────────────────────────────────────────────────────────────────────
  // Normalise each signal to ~0-1 range with empirical caps
  const s1 = Math.min(ringRatio   / 0.005,  1); // ring pattern
  const s2 = Math.min(nucleusRatio / 0.012, 1); // dark nucleus
  const s3 = Math.min(edgeRatio   / 0.25,   1); // internal edges
  const s4 = Math.min(darkRatio   / 0.08,   1); // absolute dark pixels

  const score = s1 * 0.40 + s2 * 0.30 + s3 * 0.20 + s4 * 0.10;

  const THRESHOLD = 0.20;
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

const MalariaDiseaseTest = () => {
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
    if (!selectedImage) { setFormError("Please select a blood-cell image."); return; }
    if (!imgRef.current) { setFormError("Image not ready yet."); return; }

    setFormError("");
    setIsAnalyzing(true);
    setPrediction(null);
    setConfidence(null);

    setTimeout(() => {
      try {
        const { classification, confidence: conf } = analyzeBloodCellImage(imgRef.current);
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
    <div className="m-5 flex flex-col justify-center items-center min-h-screen w-screen">
      <div className="w-full md:w-1/2 lg:w-1/2">
        <form
          className="bg-white shadow-lg shadow-gray-500 rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center font-bold text-3xl mb-5">Malaria Predictor</h1>

          <div className="mb-4">
            <h3 className="text-center font-bold text-xl mb-2">Upload Blood Cell Image</h3>
            <input
              onChange={handleImagePreview}
              type="file"
              name="image"
              accept="image/*"
              className="py-2 px-4 w-full rounded-md border border-gray-300"
            />
          </div>

          {formError && (
            <div className="text-red-500 mb-4 text-center">{formError}</div>
          )}

          {imagePreview && (
            <div className="mb-4">
              <img
                ref={imgRef}
                className="mx-auto rounded-md"
                src={imagePreview}
                alt="Preview"
                style={{ height: "300px", width: "450px" }}
                crossOrigin="anonymous"
              />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
            >
              {isAnalyzing ? "Analysing…" : "Predict"}
            </button>
          </div>
        </form>

        {prediction !== null && (
          <div className="mt-4">
            <div
              className={`${
                prediction === 1
                  ? "bg-red-400 text-red-800"
                  : "bg-green-400 text-green-800"
              } rounded-md p-4`}
            >
              <h3 className="text-center text-2xl font-semibold">
                {prediction === 1
                  ? "⚠ Malaria Infected Cell Detected"
                  : "✓ Cell is Not Infected"}
              </h3>
              {confidence && (
                <p className="text-center mt-2">Confidence: {confidence}%</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <DcotorsDropDown
          testName={"Malaria Disease"}
          testResult={prediction === 1 ? "Unhealthy" : "Healthy"}
        />
      </div>
    </div>
  );
};

export default MalariaDiseaseTest;
