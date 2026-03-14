import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router({ mergeParams: true });

const pythonScriptPathForSymptoms = path.join(__dirname, "..", "symptoms.py");
const symptomsModel = path.join(__dirname, "..", "aimodels", "svc.pkl");

router.post("/symptoms", (req, res) => {
  let responseSent = false;
  try {
    const data = req.body.data;
    console.log({ dataInString: JSON.stringify({ data }) });

    const pythonProcess = spawn("python", [
      pythonScriptPathForSymptoms,
      "--loads",
      symptomsModel,
      JSON.stringify({ data }),
    ]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      errorOutput += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Raw stdout from Python:", output);
      console.log("Raw stderr from Python:", errorOutput);

      if (responseSent) return;

      if (code !== 0) {
        // Python crashed
        responseSent = true;
        return res.status(500).json({
          message: "Python script failed",
          error: errorOutput || "Unknown error",
        });
      }

      try {
        const prediction = JSON.parse(output.trim());
        console.log("Parsed prediction:", prediction);
        responseSent = true;
        return res.json({ data: prediction });
      } catch (err) {
        console.error("Failed to parse Python output as JSON:", err);
        console.error("Output was:", output);
        responseSent = true;
        return res.status(500).json({
          message: "Failed to parse prediction from Python",
          rawOutput: output,
        });
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ message: "Python process could not be started" });
      }
    });
  } catch (error) {
    console.error("Error in /symptoms route:", error);
    if (!responseSent) {
      responseSent = true;
      return res.status(500).send("Internal Server Error");
    }
  }
});

export default router;
