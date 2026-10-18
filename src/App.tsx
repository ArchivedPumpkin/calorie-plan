// App plan:
// A calorie tracking app
// Setting up the basic structure of the app:
// Components:
// 1. Set caloric deficit and macros (Component: CaloricDeficit)
// 2. Log food intake (Component: FoodLog)
import React from "react";
import { Zap, LogOut } from "lucide-react";
import CaloricDeficit from "./Components/CaloricDeficit";
import Macros from "./Components/Macros";
import DisplayStats from "./Components/DisplayStats";
import FoodLog from "./Components/FoodLog";
import "./styles/index.css";
import AuthForm from "./Components/AuthForm";
import { authClient } from "./lib/auth-client";


type Macros = {
  protein: number;
  carbs: number;
  fats: number;
};

type FoodLogEntry = {
  meal: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

function App() {
  const { data: session, isPending } = authClient.useSession();
  const [caloricDeficit, setCaloricDeficit] = React.useState<number>(0);
  const [macros, setMacros] = React.useState<Macros>({
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [foodLog, setFoodLog] = React.useState<FoodLogEntry[]>([
    {
      meal: "",
      grams: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  ])

  async function handleSignOut() {
    await authClient.signOut();
    setCaloricDeficit(0);
    setMacros({ protein: 0, carbs: 0, fats: 0 });
    setFoodLog([]);
  }


  if (isPending) {
    return <p className="app-loading">Loading…</p>;
  }
  if (!session) {
    return <AuthForm />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-bar">
          <p className="app-eyebrow">
            <Zap size={13} strokeWidth={2.5} fill="currentColor" />
            Daily tracker
          </p>
          <div className="app-account">
            <span className="app-account-name">{session.user.name}</span>
            <button type="button" className="btn-link" onClick={handleSignOut}>
              <LogOut size={13} strokeWidth={2.5} />
              Sign out
            </button>
          </div>
        </div>
        <h1>Calorie Plan</h1>
        <p className="app-subtitle">
          Set your deficit, pick your macro split, and log your meals.
        </p>
      </header>

      <div className="app-layout">
        {/* Summary rail: stays in view while meals are logged on the right. */}
        <aside className="app-rail">
          <section className="card">
            <CaloricDeficit
              caloricDeficit={caloricDeficit}
              setCaloricDeficit={setCaloricDeficit}
            />
          </section>

          {(caloricDeficit !== 0 && Object.values(macros).every(value => value === 0)) && (
            <section className="card">
              <Macros
                caloricDeficit={caloricDeficit}
                macros={macros}
                setMacros={setMacros}
              />
            </section>
          )}

          {caloricDeficit !== 0 &&
            (macros.protein !== 0 || macros.carbs !== 0 || macros.fats !== 0) && (
              <section className="card">
                <DisplayStats
                  caloricDeficit={caloricDeficit}
                  macros={macros}
                  foodLog={foodLog}
                />
              </section>
            )}
        </aside>

        <main className="app-main">
          <section className="card">
            <FoodLog
              foodLog={foodLog}
              setFoodLog={setFoodLog}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
