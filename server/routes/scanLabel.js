import express from "express";
import { scanLabel } from "../services/gemini.js";

const router = express.Router();

router.post("/scan-label", async (req, res) => {
  console.log("Received a request to scan a label");
  console.log("Request body:", req.body);

  try {
    const base64Data = req.body.file.split(",")[1];
    const { found, ...label } = await scanLabel(base64Data);

    if (!found) {
      return res
        .status(422)
        .json({ message: "Label not found or could not be extracted" });
    }

    res.json({ message: "Label scanned successfully", output: label });
  } catch (error) {
    console.error("Error scanning label:", error);
    res
      .status(500)
      .json({ message: "Error scanning label", error: error.message });
  }
});

export default router;
