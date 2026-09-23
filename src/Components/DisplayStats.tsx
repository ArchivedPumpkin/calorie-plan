import { Activity, Drumstick, Wheat, Droplets, TrendingUp } from "lucide-react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type DisplayStatsProps = {
  caloricDeficit: number;
  foodLog: {
    meal: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
};

export default function DisplayStats(props: DisplayStatsProps) {
// DisplayStats component shows the user's daily caloric deficit and macronutrient goals with progress bars.
// It receives the caloric deficit and macronutrient targets as props and displays them using HTML progress elements.
// The progress bars are initially set to 0 and will need to be updated dynamically based on user input or tracked consumption.

  // Update the progress bars based on the food log entries.

  const totalCalories = props.foodLog.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = props.foodLog.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = props.foodLog.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFats = props.foodLog.reduce((sum, entry) => sum + entry.fats, 0);

  // Clamped so an overshoot never draws the ring past a full turn.
  const caloriePercent = props.caloricDeficit > 0
    ? Math.min(1, totalCalories / props.caloricDeficit)
    : 0;

  return (
    <div>
      <div className="card-header">
        <div className="card-title">
          <Activity size={16} strokeWidth={2.25} />
          <h2>Daily Goals</h2>
        </div>
      </div>

      <div className="calorie-ring">
        <CircularProgressbarWithChildren
          value={caloriePercent * 100}
          strokeWidth={9}
          styles={buildStyles({
            pathColor: "var(--accent)",
            trailColor: "var(--surface-hi)",
            strokeLinecap: "round",
            pathTransitionDuration: 0.5,
          })}
        >
          <span className="calorie-ring-figure">{totalCalories}</span>
          <span className="calorie-ring-unit">of {props.caloricDeficit} kcal</span>
          <span className="calorie-ring-pct">
            <TrendingUp size={13} strokeWidth={2.75} />
            {Math.round(caloriePercent * 100)}%
          </span>
        </CircularProgressbarWithChildren>
      </div>

      <div className="stats-bars">
        <div className="stat-bar stat-bar--protein">
          <div className="stat-bar-header">
            <label htmlFor="protein" className="stat-bar-label">
              <Drumstick size={13} strokeWidth={2.5} />
              Protein
            </label>
            <span className="stat-bar-value">{totalProtein} / {props.macros.protein} g</span>
          </div>
          <progress id="protein" className="stat-bar-progress" value={totalProtein} max={props.macros.protein} />
        </div>
        <div className="stat-bar stat-bar--carbs">
          <div className="stat-bar-header">
            <label htmlFor="carbs" className="stat-bar-label">
              <Wheat size={13} strokeWidth={2.5} />
              Carbs
            </label>
            <span className="stat-bar-value">{totalCarbs} / {props.macros.carbs} g</span>
          </div>
          <progress id="carbs" className="stat-bar-progress" value={totalCarbs} max={props.macros.carbs} />
        </div>
        <div className="stat-bar stat-bar--fats">
          <div className="stat-bar-header">
            <label htmlFor="fats" className="stat-bar-label">
              <Droplets size={13} strokeWidth={2.5} />
              Fats
            </label>
            <span className="stat-bar-value">{totalFats} / {props.macros.fats} g</span>
          </div>
          <progress id="fats" className="stat-bar-progress" value={totalFats} max={props.macros.fats} />
        </div>
      </div>
    </div>
  );
}
