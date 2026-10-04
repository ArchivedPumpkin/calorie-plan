import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const labelSchema = z.object({
  meal: z.string(),
  grams: z.number(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  found: z.boolean(),
});

export async function scanLabel(base64Data) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash-lite",
    input: [
      {
        type: "text",
        text: "Extract macros from this nutrition label. Always give calories, protein, carbs and fats per 100g. Set grams to the serving size printed on the label, or 100 if there is none.",
      },
      {
        type: "text",
        text: "Set found to true if the label is successfully extracted. Otherwise, set it to false.",
      },
      { type: "image", data: base64Data, mime_type: "image/png" },
    ],
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema: z.toJSONSchema(labelSchema),
    },
  });

  return labelSchema.parse(JSON.parse(interaction.output_text));
}
