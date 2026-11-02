export type Sex = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "heavy" | "athlete";

export type BodyStats = {
    sex: Sex;
    age: number;
    weightKg: number;
    heightCm: number;
    activity: ActivityLevel;
    bodyFatPercent?: number;
};

export const ACTIVITY_LEVELS: Record<ActivityLevel, { label: string; multiplier: number }> = {
    sedentary: { label: "Sedentary (office job)", multiplier: 1.2 },
    light: { label: "Light exercise (1–2 days/week)", multiplier: 1.375 },
    moderate: { label: "Moderate exercise (3–5 days/week)", multiplier: 1.55 },
    heavy: { label: "Heavy exercise (6–7 days/week)", multiplier: 1.725 },
    athlete: { label: "Athlete (2x per day)", multiplier: 1.9 },
};

// Roughly 0.5 kg per week either way.
export const GOAL_ADJUSTMENT_KCAL = 500;

/** Mifflin-St Jeor, or Katch-McArdle when body fat is known (uses lean mass). */
export function calculateBmr(stats: BodyStats): number {
    if (stats.bodyFatPercent) {
        const leanMassKg = stats.weightKg * (1 - stats.bodyFatPercent / 100);
        return 370 + 21.6 * leanMassKg;
    }
    const base = 10 * stats.weightKg + 6.25 * stats.heightCm - 5 * stats.age;
    return stats.sex === "male" ? base + 5 : base - 161;
}

export function calculateTdee(stats: BodyStats): number {
    return calculateBmr(stats) * ACTIVITY_LEVELS[stats.activity].multiplier;
}

export type GoalKey = "cut" | "maintain" | "bulk";

export function calculateGoals(tdee: number): Record<GoalKey, number> {
    return {
        cut: Math.round(tdee - GOAL_ADJUSTMENT_KCAL),
        maintain: Math.round(tdee),
        bulk: Math.round(tdee + GOAL_ADJUSTMENT_KCAL),
    };
}

export function calculateBmi(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
}

export function bmiCategory(bmi: number): string {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
}

/**
 * The four classic ideal-weight formulas, in kg. They are defined from inches
 * over 5 ft, so heights below 5 ft get the base value.
 */
export function calculateIdealWeights(sex: Sex, heightCm: number) {
    const inchesOver5ft = Math.max(0, heightCm / 2.54 - 60);
    const male = sex === "male";
    return {
        hamwi: (male ? 48 : 45.5) + (male ? 2.7 : 2.2) * inchesOver5ft,
        devine: (male ? 50 : 45.5) + 2.3 * inchesOver5ft,
        robinson: (male ? 52 : 49) + (male ? 1.9 : 1.7) * inchesOver5ft,
        miller: (male ? 56.2 : 53.1) + (male ? 1.41 : 1.36) * inchesOver5ft,
    };
}

/** Weight range (kg) that gives a BMI between 18.5 and 24.9. */
export function healthyWeightRange(heightCm: number): { min: number; max: number } {
    const heightM = heightCm / 100;
    return { min: 18.5 * heightM * heightM, max: 24.9 * heightM * heightM };
}

/**
 * Martin Berkhan's estimate of a man's natural muscular potential: height in cm
 * minus 100 is the maximum weight in kg at about 5% body fat. Not defined for women.
 */
export function maxMuscularPotential(heightCm: number): { bodyFatPercent: number; weightKg: number }[] {
    const leanAt5Percent = (heightCm - 100) * 0.95;
    return [5, 10, 15].map((bodyFatPercent) => ({
        bodyFatPercent,
        weightKg: leanAt5Percent / (1 - bodyFatPercent / 100),
    }));
}
