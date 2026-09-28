// Express server setup that will connect to AI for processing food label scans

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai";
import {z} from "zod"

dotenv.config()

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


const app = express()
app.use(express.json({ limit: "10mb" }))
app.use(cors())

const PORT = 8000



app.post('/api/scan-label', async (req, res) => {
    console.log("Received a request to scan a label")
    console.log("Request body:", req.body)

    const labelSchema = z.object( {
        meal: z.string(),
        grams: z.number(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number()
    })
    try {
        const base64Data = req.body.file.split(",")[1]

        const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: [
            { type: "text", text: "Extract macros from this nutrition label..." },
            { type: "image", data: base64Data, mime_type: "image/png" },
        ],
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: z.toJSONSchema(labelSchema)
        }
        });

        const parsedOutput = JSON.parse(interaction.output_text)
        const parsedSchmema = labelSchema.parse(parsedOutput)

        res.json({ message: "Label scanned successfully", output: parsedSchmema })

    } catch (error) {
        console.error("Error scanning label:", error)
        res.status(500).json({ message: "Error scanning label", error: error.message })
    }

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
