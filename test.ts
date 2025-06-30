function extractJsonFromMarkdown(text: string): {
  markdown: string;
  json: Record<string, any> | null;
} {
  const match = text.match(/```json\n([\s\S]*?)```/);
  const jsonStr = match?.[1];
  const cleanedText = text.replace(match?.[0] || "", "").trim();

  let parsed = null;
  try {
    parsed = jsonStr ? JSON.parse(jsonStr) : null;
  } catch (_) { }

  return {
    markdown: cleanedText,
    json: parsed,
  };
}
console.log(extractJsonFromMarkdown("**Cơm chiên**\n\n**Nguyên liệu chính:**\n\n* Cơm (gạo trắng): 1 cup\n* Dầu ăn (dầu mè hoặc dầu olive): 2-3 muỗng\n* Gia vị (muối, hạt tiêu): vừa đủ\n* Thể (thịt bò, gà, hoặc hải sản): 100g\n* Rau củ (xà lách, cần tây, etc.): tùy chọn\n\n**Tổng lượng calo:**\nKhoảng 400-500 calo (tùy thuộc vào loại thịt và dầu ăn sử dụng)\n\n**Phù hợp với chế độ ăn:**\n\n* **Eat Clean**: Có thể phù hợp vì món cơm chiên này không chứa nhiều chất béo và đường, chỉ cần chú ý đến lựa chọn nguyên liệu và lượng dầu ăn sử dụng.\n* **Keto**: Có thể phù hợp vì món cơm chiên này có thể được thực hiện với loại dầu ăn giàu chất béo (dầu mè) và lượng calo tương đối cao. Tuy nhiên, cần phải kiểm soát lượng carbohydrate trong món ăn để đảm bảo rằng nó vẫn nằm trong phạm vi Keto.\n* **Low Carb**: Không phù hợp vì món cơm chiên này chứa nhiều carbohydrate từ gạo trắng.\n\n**Kết quả trả về:**\n```json\n{ \n  \"ingredients\": [\"Cơm\", \"Dầu ăn\", \"Gia vị\", \"Thể\", \"Rau củ\"],\n  \"estimatedCalories\": 450,\n  \"suitableFor\": [\"Eat Clean\", \"Keto\"]\n}\n"));


