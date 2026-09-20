import React, { useState } from "react";

type FoodEntry = {
  id: number;
  name: string;
  calories: number;
};

export default function FoodLog() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const calories = Number(formData.get("calories"));
    if (!name || !calories) return;

    setEntries((prev) => [...prev, { id: Date.now(), name, calories }]);
    form.reset();
  }

  function handleRemove(id: number) {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <div>
      <div className="card-header">
        <h2>Food Log</h2>
      </div>

      <form className="food-log-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Food</label>
          <input type="text" id="name" name="name" placeholder="e.g. Chicken salad" required />
        </div>
        <div className="form-row">
          <label htmlFor="calories">Calories</label>
          <input type="number" id="calories" name="calories" min={1} required />
        </div>
        <button type="submit">Add</button>
      </form>

      {entries.length === 0 ? (
        <p className="food-log-empty">No food logged yet today.</p>
      ) : (
        <>
          <ul className="food-log-list">
            {entries.map((entry) => (
              <li key={entry.id} className="food-log-item">
                <span className="food-name">{entry.name}</span>
                <span className="food-calories">{entry.calories} cal</span>
                <button
                  type="button"
                  className="food-log-remove"
                  aria-label={`Remove ${entry.name}`}
                  onClick={() => handleRemove(entry.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className="food-log-total">
            <span>Total</span>
            <span>{totalCalories} cal</span>
          </div>
        </>
      )}
    </div>
  );
}
