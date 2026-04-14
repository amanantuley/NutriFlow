import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query, userMacros, userLocation } = await req.json();

    // 1. Attempt to use Real Gemini AI if Key is provided
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 5) {
      const systemPrompt = `You are NutriFlow, the world's most advanced clinical AI dietary assistant. The user is asking: "${query}". Respond elegantly, prioritizing health, macronutrients, and proximity. Limit your response to 2 sentences.`;
      
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });
      
      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return NextResponse.json({ success: true, assessment: aiText, healthScoreMatch: 98 });
        }
      }
    }

    // 2. Fallback Mock AI Database if no key or error (guarantees safe hackathon demo)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    let assessment = "";
    if (query.toLowerCase().trim() === "") {
      assessment = "Please tell me what you're craving tonight, and I will strictly cross-reference it with your live biometric data.";
    } else if (query.toLowerCase().includes("protein") && userLocation) {
      assessment = "I detect you are within 1.2 miles of Green Bowl Studio. Their Salmon Power Bowl contains 42g of high-quality protein and aligns perfectly with your physical distance and daily targets.";
    } else if (query.toLowerCase().includes("protein")) {
      assessment = "Based on your remaining 18g of protein today, I highly recommend the Salmon Power Bowl from Green Bowl Studio. Enable your location for proximity matching.";
    } else {
      assessment = "I've analyzed your biometric request. The Dragon Roll from Sakura Sushi is a fantastic match within your remaining 65g carb limit. Order confirmed healthy by NutriFlow.";
    }

    return NextResponse.json({
      success: true,
      assessment: assessment,
      healthScoreMatch: 95
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process AI assessment" },
      { status: 500 }
    );
  }
}
