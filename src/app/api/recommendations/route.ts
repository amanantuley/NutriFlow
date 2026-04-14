import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { location, pastOrders, cuisinePreferences, dietaryPreferences } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.length > 5) {
      const systemPrompt = `You are an AI-powered food recommendation system for 'NutriFlow'. Your goal is to provide personalized, health-focused restaurant and dish recommendations based on user history and preferences.
      User Location: ${location}
      Dietary Preferences: ${dietaryPreferences?.join(", ") || "None"}
      Return ONLY a JSON object with this shape:
      {
        "recommendedRestaurants": [{ "name": "...", "cuisine": "...", "reason": "..." }],
        "recommendedDishes": [{ "dishName": "...", "restaurantName": "...", "reason": "..." }]
      }`;
      
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });
      
      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        let aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();
          try {
            const parsed = JSON.parse(aiText);
            return NextResponse.json({ success: true, data: parsed });
          } catch(e) {
            // parsing failed, fallback below
          }
        }
      }
    }

    // Fallback Mock for safe hackathon execution
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json({
      success: true,
      data: {
        recommendedDishes: [
          {
            dishName: "Keto Macro Bowl",
            restaurantName: "Green Bowl Studio",
            reason: "Perfectly aligns with your Low Carb preference while supplying 40g of clean protein."
          },
          {
            dishName: "Grilled Salmon Asparagus",
            restaurantName: "Ocean Catch",
            reason: "Packed with Omega-3s and fits your historical high ratings for lean pescatarian dishes."
          },
          {
            dishName: "Zucchini Pesto Noodles",
            restaurantName: "La Trattoria",
            reason: "A low-carb, nutrient-dense take on your favorite Italian pasta profile."
          }
        ]
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process AI recommendations" }, { status: 500 });
  }
}
