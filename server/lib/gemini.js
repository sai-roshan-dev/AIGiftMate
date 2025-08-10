// ✅ Added for Unsplash API integration
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

import Product from '../models/Product.js'; // Import the Product model

// A simple function to generate a unique hash from a string.
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// New helper to extract first valid JSON array substring and parse it
function extractFirstJsonArray(text) {
  const start = text.indexOf('[');
  if (start === -1) {
    console.warn("[extractFirstJsonArray] No '[' found in text.");
    return null;
  }

  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') depth--;

    if (depth === 0) {
      const jsonStr = text.substring(start, i + 1);
      try {
        return JSON.parse(jsonStr);
      } catch (error) {
        console.error("[extractFirstJsonArray] JSON parse error:", error);
        console.log("[extractFirstJsonArray] JSON string tried:", jsonStr);
        return null;
      }
    }
  }

  console.warn("[extractFirstJsonArray] No matching closing ']' found.");
  return null;
}

// Improved helper function to robustly extract JSON array from text response using extractFirstJsonArray.
function parseTextToGifts(text) {
  console.log("[parseTextToGifts] Raw Gemini text length:", text.length);

  const giftsArray = extractFirstJsonArray(text);

  if (!giftsArray) {
    console.warn("[parseTextToGifts] No valid JSON array found in Gemini response.");
    return [];
  }

  if (!Array.isArray(giftsArray)) {
    console.warn("[parseTextToGifts] Extracted JSON is not an array.");
    return [];
  }

  return giftsArray.map((gift, index) => ({
    id: `gemini_gift_${index}-${hashCode(gift.name || "gift")}`,
    name: gift.name?.trim() || "Unknown Gift",
    description: gift.description?.trim() || "",
    price: gift.approximatePrice || 0,
    category: gift.category?.trim() || "Misc",
    reason: gift.reason?.trim() || "",
    imageSearchQuery: gift.imageSearchQuery?.trim() || `${gift.name || "gift"} ${gift.category || ""} gift`
  }));
}

// Unsplash API image fetch fallback
const getGiftImageUrl = async (gift) => {
  const query = gift?.imageSearchQuery || (gift?.name + " " + gift?.category + " gift") || "gift";
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.error("[getGiftImageUrl] UNSPLASH_ACCESS_KEY is not set in environment variables!");
    return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800";
  }

  try {
    console.log(`[getGiftImageUrl] Searching Unsplash for: "${query}"`);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&orientation=squarish&per_page=3`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from Unsplash: ${response.statusText}`);
    }

    const data = await response.json();
    const results = data.results;

    if (results && results.length > 0) {
      console.log(`[getGiftImageUrl] Found ${results.length} images, using first one.`);
      return results[0].urls.small;
    } else {
      console.warn("[getGiftImageUrl] No results found on Unsplash, using fallback image.");
      return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800";
    }
  } catch (error) {
    console.error("[getGiftImageUrl] Unsplash error:", error.message);
    return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800";
  }
};

// Fetch all products from MongoDB
export async function fetchProductsFromDb() {
  try {
    console.log('[fetchProductsFromDb] Fetching products from MongoDB...');
    const products = await Product.find({});
    console.log(`[fetchProductsFromDb] Fetched ${products.length} products from MongoDB.`);
    return products;
  } catch (error) {
    console.error(`[fetchProductsFromDb] Error fetching products from DB: ${error.message}. Returning empty array.`);
    return [];
  }
}

// Helper function for strict name and category matching
function findStrictMatch(products, geminiNameLower, geminiCategoryLower) {
  return products.find(p => {
    if (!p.name || !p.category) return false;
    return (
      p.name.toLowerCase() === geminiNameLower &&
      p.category.toLowerCase() === geminiCategoryLower
    );
  }) || null;
}

// Main function to generate gift recommendations using Gemini and enrich with product data.
export async function generateGiftRecommendations(surveyData) {
  console.log("[generateGiftRecommendations] Starting recommendation generation...");

  try {
    const prompt = `
You are an expert gift recommender specializing in personalized, practical gifts. Based on the following recipient details, generate exactly 8 unique and thoughtful gift recommendations. Each gift should be a common, purchasable item readily available on popular online stores or local markets.

Recipient details:
- Age: ${surveyData.age}
- Gender: ${surveyData.gender}
- Relationship: ${surveyData.relationship}
- Occasion: ${surveyData.occasion}
- Interests: ${surveyData.interests.join(", ")}
- Personality traits: ${surveyData.personality.join(", ")}
- Budget: ₹${surveyData.budget[0]}
- Additional Info: ${surveyData.additionalInfo || "None"}

Requirements for each gift recommendation (as a JSON object):
{
  "name": string,               // Gift name/title
  "description": string,        // Brief description highlighting its relevance
  "approximatePrice": number,   // Estimated price in INR, not exceeding the budget
  "category": string,           // Gift category (e.g., Electronics, Apparel, Books, Home Decor)
  "reason": string,             // Why this gift suits the recipient
  "imageSearchQuery": string    // A precise keyword phrase optimized for image search APIs like Unsplash, e.g. "black leather wallet product" or "wireless noise cancelling headphones gadget mainly focusing on product images only.,Include words like "product", "isolated", "studio shot", "on white background", and exclude any references to people."
}

Constraints:
- Only suggest practical, commonly purchasable gifts relevant to the recipient.
- Avoid exotic, rare, or unavailable items.
- Ensure the approximatePrice does not exceed the specified budget.
- Provide diverse gift categories to cover varied interests.
- Output ONLY a JSON array of 8 gift objects with no extra text, explanation, or formatting.
-The "imageSearchQuery" should be a concise, precise phrase that will return relevant product images from image search APIs (like Unsplash). Include product type, key descriptors (color, style), and words like "product" or "gift" if helpful , avoid generic terms like "gift" or "item" alone and Avoid queries that might return images with persons or lifestyle shots.

Example response format (do not include this example in your output):

[
  {
    "name": "Noise Cancelling Headphones",
    "description": "Wireless over-ear headphones that block external noise, ideal for someone who loves music and travels frequently.",
    "approximatePrice": 3500,
    "category": "Electronics",
    "reason": "Perfect for enhancing their music experience and reducing travel stress.",
    "imageSearchQuery": "wireless noise cancelling headphones"
  },
  {
    "name": "Classic Leather Wallet",
    "description": "A durable and stylish leather wallet with multiple compartments.",
    "approximatePrice": 1200,
    "category": "Accessories",
    "reason": "A practical everyday essential that suits their personality.",
    "imageSearchQuery": "classic leather wallet"
  },
  {
    "name": "Fitness Tracker Watch",
    "description": "A lightweight fitness tracker that monitors steps, heart rate, and sleep patterns.",
    "approximatePrice": 2500,
    "category": "Electronics",
    "reason": "Great for health-conscious individuals aiming to track their fitness goals.",
    "imageSearchQuery": "fitness tracker watch product isolated on white background"
  }, {
    "name": "Classic Teddy Bear",
    "description": "A soft, cuddly teddy bear perfect for gifting to children or loved ones on special occasions.",
    "approximatePrice": 700,
    "category": "Toys & Gifts",
    "reason": "A timeless gift that brings comfort and joy, suitable for all ages.",
    "imageSearchQuery": "classic teddy bear product isolated studio shot"
  },{
    "name": "Personalized Coffee Mug",
    "description": "A ceramic coffee mug customized with the recipient's name or a special message.",
    "approximatePrice": 350,
    "category": "Kitchenware",
    "reason": "Adds a personal touch to their daily coffee routine.",
    "imageSearchQuery": "personalized coffee mug product isolated on white background"
  },{
    "name": "Aromatic Scented Candles Set",
    "description": "A set of beautifully scented candles to create a relaxing ambiance at home.",
    "approximatePrice": 900,
    "category": "Home Decor",
    "reason": "Perfect for those who enjoy calm and cozy environments.",
    "imageSearchQuery": "scented candles set product isolated studio shot"
  },
  // 2 more gift objects...
]

Generate the JSON array of 8 gifts .
`;


    console.log("[generateGiftRecommendations] Calling Gemini API for recommendations...");
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set in environment variables!");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiResult = await geminiResponse.json();
    const geminiText = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!geminiText) {
      throw new Error("No text generated from Gemini API");
    }

    console.log("[generateGiftRecommendations] Gemini API response received.");
    console.log("[Gemini Raw Text]:", geminiText);

    // Parse JSON string response into gift objects
    const geminiGifts = parseTextToGifts(geminiText);

    console.log("[generateGiftRecommendations] Gifts parsed from Gemini API:", geminiGifts.map(g => ({ name: g.name, category: g.category })));

    console.log("[generateGiftRecommendations] Fetching products from MongoDB...");
    const allProducts = await fetchProductsFromDb();

    if (!allProducts.length) {
      console.warn("[generateGiftRecommendations] No products fetched from DB.");
    }

    // Clone products list for matching removal to avoid duplicates
    const availableProducts = [...allProducts];

    console.log("[generateGiftRecommendations] Matching and enriching gifts with product data...");
    const enrichedGifts = await Promise.all(geminiGifts.map(async (geminiGift) => {
      let matchedProduct = null;
      let matchSource = 'None';
      const geminiCategoryLower = geminiGift.category.toLowerCase();
      const geminiNameLower = geminiGift.name.toLowerCase();
      let isCatalogMatch = false;

      console.log(`\n[Matching] Attempting to match: "${geminiGift.name}" (Category: "${geminiGift.category}")`);

      // --- Attempt to match from MongoDB ---
      matchedProduct = findStrictMatch(availableProducts, geminiNameLower, geminiCategoryLower);

      if (matchedProduct) {
        // Remove matched product from available list to avoid duplicates
        const index = availableProducts.findIndex(p => (p.id === matchedProduct.id || p.name === matchedProduct.name));
        if (index !== -1) availableProducts.splice(index, 1);

        matchSource = `MongoDB (exact_name_category)`;
        isCatalogMatch = true;
        console.log(`  [Match] Found in MongoDB: ${matchedProduct.name} (${matchedProduct.category})`);
      } else {
        console.log(`  [Match] No strict match found in MongoDB for: "${geminiGift.name}"`);
      }

      // Determine image URL
      let finalImageUrl = null;

      if (isCatalogMatch && matchedProduct) {
        if (typeof matchedProduct.imageUrl === 'string' && matchedProduct.imageUrl.length > 0) {
          finalImageUrl = matchedProduct.imageUrl;
          console.log(`  [Image] Using catalog image from DB for matched product: ${matchedProduct.name}`);
        } else {
          console.warn(`  [Image] Matched product found but no valid image URL: ${matchedProduct.name}. Fetching Unsplash image as fallback.`);
          finalImageUrl = await getGiftImageUrl(geminiGift);
        }
      } else {
        finalImageUrl = await getGiftImageUrl(geminiGift);
      }

      console.log(`  [Result] Match Source: ${matchSource}`);
      console.log(`  [Result] Is Catalog Match: ${isCatalogMatch}`);
      console.log(`  [Result] Assigned Image URL: ${finalImageUrl}`);

      return {
        ...geminiGift,
        imageUrl: finalImageUrl,
        isCatalogMatch
      };
    }));

    console.log("[generateGiftRecommendations] Completed gift enrichment.");
    return enrichedGifts;

  } catch (error) {
    console.error("❌ [generateGiftRecommendations] Error:", error);
    throw error;
  }
}
