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

    function submitFoodLog(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        const formData = new FormData(e.currentTarget)
        const meal = formData.get("meal") as string
        const grams = Number(formData.get("grams"))
        const calories = Number(formData.get("calories"))
        const protein = Number(formData.get("protein"))
        const carbs = Number(formData.get("carbs"))
        const fats = Number(formData.get("fats"))

        props.setFoodLog(prev => [...prev, { meal, grams, calories, protein, carbs, fats } ])
        props.setCaloricDeficit(prev => prev - calories)
        e.currentTarget.reset()
    }

    function removeFoodLogEntry(index:number) {
        props.setFoodLog(prev => prev.filter((_, i) => i !== index))
        props.setCaloricDeficit(prev => prev + props.foodLog[index].calories)   
    }

    const foodLogEntries = props.foodLog.filter(entry => entry.meal !== "").map((entry, index) => (
        <div key={index}>
            <p>Meal: {entry.meal}</p>
            <p>Grams: {entry.grams}</p>
            <p>Calories: {entry.calories}</p>
            <p>Protein: {entry.protein}</p>
            <p>Carbs: {entry.carbs}</p>
            <p>Fats: {entry.fats}</p>
            <button type="button" onClick={() => removeFoodLogEntry(index)}>Remove</button>
        </div>
    ))

    

  return (
    <>

    <div className="food-log">
        <div className="food-log-entries">
            {props.foodLog.some(entry => entry.meal !== "") && foodLogEntries }
        </div>

        <form onSubmit={submitFoodLog}>
          <label htmlFor="meal">Meal:</label>
            <input type="text" id="meal" name="meal" />
          <label htmlFor="grams">Grams:</label>
            <input type="number" id="grams" name="grams" />
          <label htmlFor="calories">Calories:</label>
            <input type="number" id="calories" name="calories" />
          <label htmlFor="protein">Protein:</label>
            <input type="number" id="protein" name="protein" />
          <label htmlFor="carbs">Carbs:</label>
            <input type="number" id="carbs" name="carbs" />
          <label htmlFor="fats">Fats:</label>
            <input type="number" id="fats" name="fats" />
          <button type="submit">Add</button>
        </form>
    </div>
    </>
  );
}