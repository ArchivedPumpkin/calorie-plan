type FoodLogProps = {
  caloricDeficit: number;
  setCaloricDeficit: React.Dispatch<React.SetStateAction<number>>;

  foodLog: {
    meal: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[];
  setFoodLog: React.Dispatch<React.SetStateAction<{
    meal: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }[]>>;
};



export default function FoodLog(props: FoodLogProps) {

    function submitFoodLog(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        const form = e.currentTarget
        const formData = new FormData(form)
        const meal = formData.get("meal") as string
        const grams = Number(formData.get("grams"))
        const calories = Number(formData.get("calories"))
        const protein = Number(formData.get("protein"))
        const carbs = Number(formData.get("carbs"))
        const fats = Number(formData.get("fats"))

        props.setFoodLog(prev => [...prev, { meal, grams, calories, protein, carbs, fats } ])
        props.setCaloricDeficit(prev => prev - calories)
        form.reset()
    }

    function removeFoodLogEntry(index:number) {
        props.setFoodLog(prev => prev.filter((_, i) => i !== index))
        props.setCaloricDeficit(prev => prev + props.foodLog[index].calories)   
    }

    const loggedMeals = props.foodLog.filter(entry => entry.meal !== "")

    const foodLogEntries = props.foodLog.map((entry, index) => [entry, index] as const)
        .filter(([entry]) => entry.meal !== "")
        .map(([entry, index]) => (
        <li className="food-log-item" key={index}>
            <div className="food-log-main">
                <span className="food-name">{entry.meal}</span>
                <span className="food-calories">{entry.grams}g &middot; {entry.calories} kcal</span>
            </div>
            <div className="macro-chips">
                <span className="macro-chip macro-chip--protein">{entry.protein}g P</span>
                <span className="macro-chip macro-chip--carbs">{entry.carbs}g C</span>
                <span className="macro-chip macro-chip--fats">{entry.fats}g F</span>
            </div>
            <button
                type="button"
                className="food-log-remove"
                aria-label={`Remove ${entry.meal}`}
                onClick={() => removeFoodLogEntry(index)}
            >
                &times;
            </button>
        </li>
    ))

    const totalCalories = loggedMeals.reduce((sum, entry) => sum + entry.calories, 0)

  return (
    <div className="food-log">
        <div className="card-header">
            <h2>Food Log</h2>
            {loggedMeals.length > 0 && (
                <span className="card-header-meta">
                    {loggedMeals.length} {loggedMeals.length === 1 ? "meal" : "meals"}
                </span>
            )}
        </div>

        <form className="food-log-form" onSubmit={submitFoodLog}>
            <div className="form-row form-row--wide">
                <label htmlFor="meal">Meal</label>
                <input type="text" id="meal" name="meal" placeholder="e.g. Chicken &amp; rice" required />
            </div>
            <div className="form-row">
                <label htmlFor="grams">Grams</label>
                <input type="number" id="grams" name="grams" min={0} placeholder="0" />
            </div>
            <div className="form-row">
                <label htmlFor="calories">Calories</label>
                <input type="number" id="calories" name="calories" min={0} placeholder="0" />
            </div>
            <div className="form-row">
                <label htmlFor="protein">Protein</label>
                <input type="number" id="protein" name="protein" min={0} placeholder="0" />
            </div>
            <div className="form-row">
                <label htmlFor="carbs">Carbs</label>
                <input type="number" id="carbs" name="carbs" min={0} placeholder="0" />
            </div>
            <div className="form-row">
                <label htmlFor="fats">Fats</label>
                <input type="number" id="fats" name="fats" min={0} placeholder="0" />
            </div>
            <button type="submit">Add meal</button>
        </form>

        {loggedMeals.length > 0 ? (
            <>
                <ul className="food-log-list">
                    {foodLogEntries}
                </ul>
                <div className="food-log-total">
                    <span>Total logged</span>
                    <span>{totalCalories} kcal</span>
                </div>
            </>
        ) : (
            <p className="food-log-empty">No meals logged yet — add your first one above.</p>
        )}
    </div>
  );
}
