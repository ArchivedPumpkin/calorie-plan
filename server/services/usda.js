function getNutrient(food, nutrientId) {
  const nutrient = food.foodNutrients.find(
    (nutrient) => nutrient.nutrientId === nutrientId,
  );
  return nutrient?.value ?? 0;
}

export async function searchFoods(query, limit) {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        pageSize: limit,
        dataType: ["Survey (FNDDS)", "SR Legacy"],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`USDA API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.foods.map((food) => ({
    id: String(food.fdcId),
    name: food.description,
    calories: getNutrient(food, 1008),
    protein: getNutrient(food, 1003),
    carbs: getNutrient(food, 1005),
    fats: getNutrient(food, 1004),
  }));
}
