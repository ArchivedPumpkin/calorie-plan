import { UtensilsCrossed, Salad, Plus, X } from "lucide-react";
import ScanLabel from "./ScanLabel";
import React from "react";

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

type ScannedLabel = {
    meal: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

type ScannedLabelResponse = {
    message: string;
    output: ScannedLabel;
}


export default function FoodLog(props: FoodLogProps) {

    const [file, setFile] = React.useState<File | null>(null)
    const [scannedLabel, setScannedLabel] = React.useState<(ScannedLabel | null)>(null)
    const [formState, setFormState] = React.useState({
        meal: "",
        grams: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
    })

    React.useEffect(() => {
        if (!file) return;

        async function processFile(file: File): Promise<void> {
            const reader = new FileReader()
            try {
                const readerResult = await new Promise((resolve, reject) => {
                    reader.onload = () => {resolve(reader.result)}
                    reader.onerror = (error) => {reject(error)}
                    reader.readAsDataURL(file)
                })
                console.log("Reader result:", readerResult)

                const post = fetch("http://localhost:8000/api/scan-label", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({file: readerResult})
                })

                const response = await post
                const data: ScannedLabelResponse = await response.json()
                console.log("Response data:", data)
                setScannedLabel(data.output)

            } catch (error) {
                console.error("Error reading file:", error)
            }
        }

        processFile(file)


    },[file])

    React.useEffect(() => {
        if(scannedLabel) {
            setFormState(scannedLabel)
        }
    }, [scannedLabel])

    console.log("Scanned label:", scannedLabel)

    function submitFoodLog(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        props.setFoodLog(prev => [...prev, formState ])
        props.setCaloricDeficit(prev => prev - formState.calories)
        setFormState({
            meal: "",
            grams: 0,
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
        })
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
            <span className="food-log-icon">
                <Salad size={17} strokeWidth={2.25} />
            </span>
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
                <X size={16} strokeWidth={2.5} />
            </button>
        </li>
    ))

    const totalCalories = loggedMeals.reduce((sum, entry) => sum + entry.calories, 0)

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormState(prevForm => (
            {
                ...prevForm,
                [name]: value,
            }
        ))
    }


  return (
    <div className="food-log">
        <div className="card-header">
            <div className="card-title">
                <UtensilsCrossed size={16} strokeWidth={2.25} />
                <h2>Food Log</h2>
            </div>
            <div className="card-header-actions">
                <ScanLabel 
                    file={file}
                    setFile={setFile}
                />
                {loggedMeals.length > 0 && (
                    <span className="card-header-meta">
                        {loggedMeals.length} {loggedMeals.length === 1 ? "meal" : "meals"}
                    </span>
                )}
            </div>
        </div>

        <form className="food-log-form" onSubmit={submitFoodLog}>
            <div className="form-row form-row--wide">
                <label htmlFor="meal">Meal</label>
                <input type="text" id="meal" name="meal" placeholder="e.g. Chicken &amp; rice" required value={formState.meal} onChange={handleInputChange}/>
            </div>
            <div className="form-row">
                <label htmlFor="grams">Grams</label>
                <input type="number" id="grams" name="grams" min={0} placeholder="0" value={formState.grams} onChange={handleInputChange} />
            </div>
            <div className="form-row">
                <label htmlFor="calories">Calories</label>
                <input type="number" id="calories" name="calories" min={0} placeholder="0" value={formState.calories} onChange={handleInputChange} />
            </div>
            <div className="form-row">
                <label htmlFor="protein">Protein</label>
                <input type="number" id="protein" name="protein" min={0} placeholder="0" value={formState.protein} onChange={handleInputChange} />
            </div>
            <div className="form-row">
                <label htmlFor="carbs">Carbs</label>
                <input type="number" id="carbs" name="carbs" min={0} placeholder="0" value={formState.carbs} onChange={handleInputChange} />
            </div>
            <div className="form-row">
                <label htmlFor="fats">Fats</label>
                <input type="number" id="fats" name="fats" min={0} placeholder="0" value={formState.fats} onChange={handleInputChange} />
            </div>
            <button type="submit">
                <Plus size={15} strokeWidth={3} />
                Add meal
            </button>
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
            <p className="food-log-empty">
                <UtensilsCrossed size={26} strokeWidth={1.75} />
                No meals logged yet — add your first one above.
            </p>
        )}
    </div>
  );
}
