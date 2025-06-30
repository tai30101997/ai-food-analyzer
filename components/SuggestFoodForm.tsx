"use client";

import { useState } from "react";
import axios from "axios";

interface SuggestedDish {
  dish: string;
  estimatedCalories: number;
  suitableFor: string[];
  image?: string;
  input?: string; // Optional, for debugging
}

export default function SuggestFoodForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SuggestedDish[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/suggest", { userQuery: query });

      const allMatches = res.data.result.match(/\[\s*\{[\s\S]*?\}\s*\]/g);

      console.log("Full response text:", res.data.result);
      console.log("All JSON array matches:", allMatches);

      let combinedResults: SuggestedDish[] = [];

      if (allMatches) {
        for (const match of allMatches) {
          try {
            const parsed = JSON.parse(match);
            if (Array.isArray(parsed)) {
              combinedResults = [...combinedResults, ...parsed];
            }
          } catch (err) {
            console.warn("❌ Failed to parse one of the JSON blocks:", match, err);
          }
        }
      }

      setResults(combinedResults);
    } catch (err) {
      console.error("Parse failed:", err);
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Food Suggestions</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. It's rainy and I want something spicy"
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleSuggest}
          className="bg-blue-600 text-white px-5 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Suggest"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {results.map((item, index) => (
          <>

            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-sm bg-white"
            >

              <img
                src={
                  item.image?.includes("google.com/search")
                    ? "/fallback-dish.jpeg"
                    : item.image || "/fallback-dish.jpeg"
                }
                alt={item.dish}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{item.dish}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  🔥 Calories: {item.estimatedCalories}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.suitableFor.map((diet, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                    >
                      {diet}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}