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

  return (
    <div>
      <div className="card-header">
        <h2>Daily Goals</h2>
      </div>
      <div className="stats-bars">
        <div className="stat-bar">
          <div className="stat-bar-header">
            <label htmlFor="calories" className="stat-bar-label">Calories</label>
            <span className="stat-bar-value">{totalCalories} / {props.caloricDeficit} kcal</span>
          </div>
          <progress id="calories" className="stat-bar-progress" value={totalCalories} max={props.caloricDeficit} />
        </div>
        <div className="stat-bar">
          <div className="stat-bar-header">
            <label htmlFor="protein" className="stat-bar-label">Protein</label>
            <span className="stat-bar-value">{totalProtein} / {props.macros.protein} g</span>
          </div>
          <progress id="protein" className="stat-bar-progress" value={totalProtein} max={props.macros.protein} />
        </div>
        <div className="stat-bar">
          <div className="stat-bar-header">
            <label htmlFor="carbs" className="stat-bar-label">Carbs</label>
            <span className="stat-bar-value">{totalCarbs} / {props.macros.carbs} g</span>
          </div>
          <progress id="carbs" className="stat-bar-progress" value={totalCarbs} max={props.macros.carbs} />
        </div>
        <div className="stat-bar">
          <div className="stat-bar-header">
            <label htmlFor="fats" className="stat-bar-label">Fats</label>
            <span className="stat-bar-value">{totalFats} / {props.macros.fats} g</span>
          </div>
          <progress id="fats" className="stat-bar-progress" value={totalFats} max={props.macros.fats} />
        </div>
      </div>
    </div>
  );
}