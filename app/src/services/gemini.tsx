// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI, Part } from "@google/genai";
// import mime from "mime";

export const gemini = async (prompt: string | File, schema?: object, systemInstruction?: object) => {
	const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });
	const config = {
		responseMimeType: "application/json",
		responseSchema: schema,
		systemInstruction: systemInstruction,
	};
	const model = "gemini-2.5-flash-preview-04-17";
	let parts: Part[];
	if (typeof prompt === "string") {
		parts = [{ text: prompt }];
	} else if (prompt instanceof File) {
		parts = [await fileToGenerativePart(prompt)];
	} else throw new Error("Invalid input type. Expected string or File.");
	const contents = [{ role: "user", parts }];
	try {
		const result = await ai.models.generateContent({ model, config, contents });
		if (result && result.candidates && result.candidates.length > 0) {
			const candidate = result.candidates[0];
			if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) return JSON.parse(candidate.content.parts[0].text || "{}");
		}
		console.error("No valid response text found from Gemini.");
		return null;
	} catch (error) {
		console.error("Error in Gemini API call:", error);
		return null;
	}
};

async function fileToGenerativePart(file: File): Promise<Part> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const base64 = buffer.toString("base64");
	return { inlineData: { data: base64, mimeType: file.type } };
}
