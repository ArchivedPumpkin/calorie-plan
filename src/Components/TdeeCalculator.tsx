import React from "react";
import { Calculator, Flame, Scale, Dumbbell, HeartPulse, Target } from "lucide-react";
import {
    ACTIVITY_LEVELS,
    GOAL_ADJUSTMENT_KCAL,
    bmiCategory,
    calculateBmi,
    calculateBmr,
    calculateGoals,
    calculateIdealWeights,
    calculateTdee,
    healthyWeightRange,
    maxMuscularPotential,
    type ActivityLevel,
    type BodyStats,
    type GoalKey,
    type Sex,
} from "../lib/tdee";
import { macroGrams } from "../lib/macros";

type TdeeCalculatorProps = {
    onSelectGoal: (calories: number) => void;
};

const GOALS: { key: GoalKey; title: string; note: string }[] = [
    { key: "cut", title: "Lose weight", note: `−${GOAL_ADJUSTMENT_KCAL} kcal/day · about 0.5 kg a week` },
    { key: "maintain", title: "Maintain", note: "Stay at your current weight" },
    { key: "bulk", title: "Build muscle", note: `+${GOAL_ADJUSTMENT_KCAL} kcal/day · about 0.5 kg a week` },
];

const round1 = (n: number) => Math.round(n * 10) / 10;

export default function TdeeCalculator(props: TdeeCalculatorProps) {
    const [form, setForm] = React.useState({
        sex: "male" as Sex,
        age: "",
        weightKg: "",
        heightCm: "",
        activity: "moderate" as ActivityLevel,
        bodyFatPercent: "",
    });
    const [stats, setStats] = React.useState<BodyStats | null>(null);
    const [showManual, setShowManual] = React.useState(false);
    const [manualCalories, setManualCalories] = React.useState("");
    const resultsRef = React.useRef<HTMLElement>(null);
    const formPanelRef = React.useRef<HTMLElement>(null);
    // The form card's size just before the results appeared (full width).
    const formWidthBefore = React.useRef<number | null>(null);

    // Shrink the form card from full width to its column on the left. The layout
    // changes instantly; this animates from the old width to the new one.
    React.useLayoutEffect(() => {
        const panel = formPanelRef.current;
        const before = formWidthBefore.current;
        formWidthBefore.current = null;
        if (!panel || before === null) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const after = panel.getBoundingClientRect().width;
        if (Math.abs(before - after) > 1) {
            panel.animate(
                [{ width: `${before}px` }, { width: `${after}px` }],
                { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
            );
        }
    }, [stats]);

    // On narrow screens the results sit below the form, so bring them into view.
    React.useEffect(() => {
        if (stats && window.matchMedia("(max-width: 900px)").matches) {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [stats]);

    function handleManualSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        props.onSelectGoal(Number(manualCalories));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!stats && formPanelRef.current) {
            formWidthBefore.current = formPanelRef.current.getBoundingClientRect().width;
        }
        setStats({
            sex: form.sex,
            age: Number(form.age),
            weightKg: Number(form.weightKg),
            heightCm: Number(form.heightCm),
            activity: form.activity,
            bodyFatPercent: form.bodyFatPercent ? Number(form.bodyFatPercent) : undefined,
        });
    }

    const tdee = stats ? calculateTdee(stats) : 0;
    const goals = calculateGoals(tdee);

    return (
        <div className="tdee">
            <div className={`tdee-layout${stats ? " tdee-layout--results" : ""}`}>
                {/* Step 1: the inputs. Full width alone at first, then shrinks to the left when results appear. */}
                <section ref={formPanelRef} className="card tdee-panel tdee-panel--form">
                    <div className="tdee-welcome">
                        <h2 className="tdee-title">Let's find your daily calories</h2>
                        <p className="tdee-intro">
                            Tell us a little about yourself and we'll estimate how many calories you burn each day.
                            It takes about a minute.
                        </p>
                        {/* Only shown while the form is alone: what the calculator gives back. */}
                        <ul className="tdee-perks">
                            <li><Flame size={16} strokeWidth={2.5} /> Your maintenance calories</li>
                            <li><Target size={16} strokeWidth={2.5} /> Targets to lose, keep or gain weight</li>
                            <li><Dumbbell size={16} strokeWidth={2.5} /> A starting protein, carbs and fat split</li>
                            <li><HeartPulse size={16} strokeWidth={2.5} /> BMI, ideal weight and more</li>
                        </ul>
                    </div>

                    <div className="tdee-form-body">
                    <p className="tdee-step"><span>1</span> About you</p>

                    <form className="tdee-form" onSubmit={handleSubmit}>
                        <fieldset className="tdee-sex">
                            <legend>Sex</legend>
                            {(["male", "female"] as Sex[]).map(sex => (
                                <label key={sex} className={form.sex === sex ? "selected" : ""}>
                                    <input type="radio" name="sex" value={sex} checked={form.sex === sex} onChange={handleChange} />
                                    {sex === "male" ? "Male" : "Female"}
                                </label>
                            ))}
                        </fieldset>
                        <div className="form-row">
                            <label htmlFor="tdee-age">Age</label>
                            <input type="number" id="tdee-age" name="age" min={15} max={100} required inputMode="numeric" placeholder="30" value={form.age} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="tdee-weight">Weight (kg)</label>
                            <input type="number" id="tdee-weight" name="weightKg" min={30} max={300} step="any" required inputMode="decimal" placeholder="75" value={form.weightKg} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="tdee-height">Height (cm)</label>
                            <input type="number" id="tdee-height" name="heightCm" min={120} max={230} step="any" required inputMode="decimal" placeholder="175" value={form.heightCm} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label htmlFor="tdee-bodyfat">Body fat % <em>optional</em></label>
                            <input type="number" id="tdee-bodyfat" name="bodyFatPercent" min={3} max={60} step="any" inputMode="decimal" placeholder="—" value={form.bodyFatPercent} onChange={handleChange} />
                        </div>
                        <div className="form-row form-row--wide">
                            <label htmlFor="tdee-activity">How active are you?</label>
                            <select id="tdee-activity" name="activity" value={form.activity} onChange={handleChange}>
                                {(Object.keys(ACTIVITY_LEVELS) as ActivityLevel[]).map(level => (
                                    <option key={level} value={level}>{ACTIVITY_LEVELS[level].label}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="tdee-submit">
                            <Calculator size={15} strokeWidth={2.5} />
                            {stats ? "Recalculate" : "Calculate my calories"}
                        </button>
                    </form>

                    <div className="tdee-manual-area">
                        {showManual ? (
                            <form className="tdee-manual" onSubmit={handleManualSubmit}>
                                <div className="form-row">
                                    <label htmlFor="tdee-manual-calories">Your daily calories</label>
                                    <input type="number" id="tdee-manual-calories" min={800} max={10000} required inputMode="numeric" value={manualCalories} onChange={e => setManualCalories(e.target.value)} />
                                </div>
                                <button type="submit" className="btn-link">Set target</button>
                                <button type="button" className="tdee-link" onClick={() => setShowManual(false)}>
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <p className="tdee-manual-prompt">
                                Already know your number?{" "}
                                <button type="button" className="tdee-link" onClick={() => setShowManual(true)}>
                                    Enter it yourself
                                </button>
                            </p>
                        )}
                    </div>
                    </div>
                </section>

                {/* Step 2: results and goals, slides in after calculating. */}
                {stats && (
                <section ref={resultsRef} className="card tdee-panel tdee-panel--results" aria-live="polite">
                    <p className="tdee-step"><span>2</span> Pick your goal</p>

                        <>
                            <div className="tdee-headline">
                                <span className="tdee-headline-label">You burn about</span>
                                <strong>{goals.maintain.toLocaleString()} <small>kcal / day</small></strong>
                                <span className="tdee-headline-note">
                                    BMR {Math.round(calculateBmr(stats)).toLocaleString()} kcal ×{" "}
                                    {ACTIVITY_LEVELS[stats.activity].multiplier} for activity
                                    {stats.bodyFatPercent ? " · Katch-McArdle formula" : " · Mifflin-St Jeor formula"}
                                </span>
                            </div>

                            <div className="tdee-goals">
                                {GOALS.map(goal => {
                                    const calories = goals[goal.key];
                                    const grams = macroGrams(calories, "moderate");
                                    return (
                                        <div key={goal.key} className={`tdee-goal tdee-goal--${goal.key}`}>
                                            <span className="tdee-goal-title">{goal.title}</span>
                                            <strong className="tdee-goal-kcal">{calories.toLocaleString()} <small>kcal</small></strong>
                                            <span className="tdee-goal-note">{goal.note}</span>
                                            <div className="macro-chips">
                                                <span className="macro-chip macro-chip--protein">{grams.protein}g P</span>
                                                <span className="macro-chip macro-chip--carbs">{grams.carbs}g C</span>
                                                <span className="macro-chip macro-chip--fats">{grams.fats}g F</span>
                                            </div>
                                            <button type="button" className="tdee-goal-use" onClick={() => props.onSelectGoal(calories)}>
                                                Choose
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="tdee-footnote">Macros shown for a moderate-carb split. You can pick a different split next.</p>

                            <h3 className="tdee-subheading">Your body at a glance</h3>
                            <TdeeStats stats={stats} />
                        </>
                </section>
                )}
            </div>
        </div>
    );
}

function TdeeStats({ stats }: { stats: BodyStats }) {
    const bmi = calculateBmi(stats.weightKg, stats.heightCm);
    const ideal = calculateIdealWeights(stats.sex, stats.heightCm);
    const healthy = healthyWeightRange(stats.heightCm);

    return (
        <div className="tdee-stats">
            <section className="tdee-stat">
                <h4><HeartPulse size={14} strokeWidth={2.5} /> BMI</h4>
                <strong className="tdee-stat-value">{round1(bmi)}</strong>
                <span className="tdee-stat-note">{bmiCategory(bmi)}</span>
                <p className="tdee-stat-fine">Doesn't account for muscle, so it can overestimate for lifters.</p>
            </section>

            <section className="tdee-stat">
                <h4><Scale size={14} strokeWidth={2.5} /> Ideal weight</h4>
                <strong className="tdee-stat-value">{Math.round(healthy.min)}–{Math.round(healthy.max)} <small>kg</small></strong>
                <span className="tdee-stat-note">Healthy BMI range (18.5–24.9)</span>
                <dl className="tdee-stat-list">
                    <dt>G.J. Hamwi</dt><dd>{round1(ideal.hamwi)} kg</dd>
                    <dt>B.J. Devine</dt><dd>{round1(ideal.devine)} kg</dd>
                    <dt>J.D. Robinson</dt><dd>{round1(ideal.robinson)} kg</dd>
                    <dt>D.R. Miller</dt><dd>{round1(ideal.miller)} kg</dd>
                </dl>
            </section>

            <section className="tdee-stat">
                <h4><Dumbbell size={14} strokeWidth={2.5} /> Max muscular potential</h4>
                {stats.sex === "male" ? (
                    <>
                        <span className="tdee-stat-note">Estimated natural maximum (Martin Berkhan)</span>
                        <dl className="tdee-stat-list">
                            {maxMuscularPotential(stats.heightCm).map(row => (
                                <React.Fragment key={row.bodyFatPercent}>
                                    <dt>At {row.bodyFatPercent}% body fat</dt>
                                    <dd>{round1(row.weightKg)} kg</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    </>
                ) : (
                    <p className="tdee-stat-fine">This estimate (Martin Berkhan's formula) is only defined for men.</p>
                )}
            </section>

            <section className="tdee-stat">
                <h4><Flame size={14} strokeWidth={2.5} /> By activity level</h4>
                <span className="tdee-stat-note">Your maintenance calories</span>
                <dl className="tdee-stat-list">
                    {(Object.keys(ACTIVITY_LEVELS) as ActivityLevel[]).map(level => (
                        <React.Fragment key={level}>
                            <dt className={level === stats.activity ? "current" : ""}>{ACTIVITY_LEVELS[level].label.split(" (")[0]}</dt>
                            <dd className={level === stats.activity ? "current" : ""}>
                                {Math.round(calculateTdee({ ...stats, activity: level })).toLocaleString()} kcal
                            </dd>
                        </React.Fragment>
                    ))}
                </dl>
            </section>
        </div>
    );
}
