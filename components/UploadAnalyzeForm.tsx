"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";

interface AnalysisResult {
  ingredients: string[];
  estimatedCalories: number;
  suitableFor: string[];
}
const maxFileSize = 10 * 1024 * 1024; // 10MB
export default function UploadAnalyzeForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dishName, setDishName] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are accepted!");
      return;
    }

    if (file.size > maxFileSize) {
      setError("Image must be smaller than 10MB!");
      return;
    }
    setError("");
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setLoading(true);
    setResult(null);
    setDishName("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const detectRes = await axios.post("/api/detect/llava", {
          base64Image: base64,
        });

        const label = detectRes.data.label;
        if (!label) {
          setError("Could not recognize the dish from the image.");
          setLoading(false);
          return;
        }

        setDishName(label);

        const analyzeRes = await axios.post("/api/analyze", {
          dishName: "Phở Gà",
        });

        const analyzeData = analyzeRes.data;
        if (!analyzeData || !analyzeData.result) {
          setError("Failed to analyze the dish.");
          setLoading(false);
          return;
        }
        const jsonMatch = analyzeData.result.match(/\{[\s\S]*\}/);
        const parsed: AnalysisResult = jsonMatch
          ? JSON.parse(jsonMatch[0])
          : null;
        setResult(parsed);
      };

      reader.readAsDataURL(imageFile);
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred during analysis.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Analyze Dish from Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Preview"
          width={400}
          height={300}
          className="mb-4 rounded"
        />
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleAnalyze}
        disabled={loading || !imageFile}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {dishName && (
        <p className="mt-4 text-sm text-gray-600">
          🧠 Detected Dish: <strong>{dishName}</strong>
        </p>
      )}

      {result && (
        <div className="mt-6 bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-2">{dishName}</h3>
          <p className="text-gray-700 mb-2">
            🔥 Estimated Calories:{" "}
            <span className="font-semibold text-blue-600">
              {result.estimatedCalories}
            </span>
          </p>
          <div className="mb-2">
            <span className="font-semibold">🍽 Ingredients:</span>{" "}
            {result.ingredients.join(", ")}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {result.suitableFor.map((diet, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
              >
                {diet}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}