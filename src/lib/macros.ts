export type MacroSplitKey = "moderate" | "lower" | "higher";

/** Percent of daily calories from each macro. */
export const MACRO_SPLITS: Record<MacroSplitKey, { label: string; protein: number; carbs: number; fats: number }> = {
    moderate: { label: "Moderate carb", protein: 30, carbs: 35, fats: 35 },
    lower: { label: "Lower carb", protein: 40, carbs: 20, fats: 40 },
    higher: { label: "Higher carb", protein: 30, carbs: 50, fats: 20 },
};

// Protein and carbs have 4 kcal per gram, fat has 9.
export function macroGrams(calories: number, split: MacroSplitKey) {
    const { protein, carbs, fats } = MACRO_SPLITS[split];
    return {
        protein: Math.round((calories * protein) / 100 / 4),
        carbs: Math.round((calories * carbs) / 100 / 4),
        fats: Math.round((calories * fats) / 100 / 9),
    };
}
