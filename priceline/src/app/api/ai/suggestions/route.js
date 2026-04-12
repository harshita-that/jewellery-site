import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productDescription } = await req.json();
  if (!productDescription)
    return NextResponse.json({ error: "Missing productDescription" }, { status: 400 });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a SaaS pricing page copywriter. Given this product description:

"${productDescription}"

Generate exactly this JSON (no markdown, no explanation, just raw JSON):
{
  "headlines": [
    "Headline option 1",
    "Headline option 2", 
    "Headline option 3"
  ],
  "subheadlines": [
    "Subheadline option 1",
    "Subheadline option 2",
    "Subheadline option 3"
  ],
  "featureSuggestions": [
    "Feature bullet 1",
    "Feature bullet 2",
    "Feature bullet 3",
    "Feature bullet 4",
    "Feature bullet 5"
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}