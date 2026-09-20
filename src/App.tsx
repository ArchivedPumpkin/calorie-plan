// App plan:
// A calorie tracking app
// Setting up the basic structure of the app:
// Components:
// 1. Set caloric deficit and macros (Component: CaloricDeficit)
// 2. Log food intake (Component: FoodLog)

import CaloricDeficit from "./Components/CaloricDeficit";
import Macros from "./Components/Macros";
import React from "react";
import "./App.css";

function App() {
  const [caloricDeficit, setCaloricDeficit] = React.useState<number>(0);
  const [macros, setMacros] = React.useState<{
    protein: number;
    carbs: number;
    fats: number;
  }>({
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Calorie Plan</h1>
        <p className="app-subtitle">
          Set your deficit, pick your macro split, and log your meals.
        </p>
      </header>

      <main className="app-main">
        <section className="card">
          <CaloricDeficit
            caloricDeficit={caloricDeficit}
            setCaloricDeficit={setCaloricDeficit}
          />
        </section>

        {caloricDeficit !== 0 && (
          <section className="card">
            <Macros
              caloricDeficit={caloricDeficit}
              macros={macros}
              setMacros={setMacros}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
