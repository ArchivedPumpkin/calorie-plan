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
import TdeeCalculator from "./Components/TdeeCalculator";
import "./styles/index.css";
import AuthForm from "./Components/AuthForm";
import { authClient } from "./lib/auth-client";
import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { FOOD_ENTRIES, today } from "./graphql/foodLog";
import { PROFILE, SAVE_PROFILE } from "./graphql/profile";


type Macros = {
  protein: number;
  carbs: number;
  fats: number;
};

function App() {
  const { data: session, isPending } = authClient.useSession();
  const { data } = useQuery(FOOD_ENTRIES, { variables: { date: today() } });
  const foodLog = data?.foodEntries ?? [];
  const client = useApolloClient();

  // The calorie target and macros are saved per user, so they come from the server.
  const { data: profileData, loading: profileLoading } = useQuery(PROFILE, { skip: !session });
  const [saveProfile] = useMutation(SAVE_PROFILE, {
    refetchQueries: [PROFILE],
    awaitRefetchQueries: true,
  });
  const profile = profileData?.profile;
  const caloricDeficit = profile?.calorieTarget ?? 0;
  const macros: Macros = {
    protein: profile?.protein ?? 0,
    carbs: profile?.carbs ?? 0,
    fats: profile?.fats ?? 0,
  };
  // "Edit" reopens the calculator without wiping the saved target.
  const [editingTarget, setEditingTarget] = React.useState(false);

  async function handleSignOut() {
    await authClient.signOut();
    setEditingTarget(false);
    await client.clearStore();
  }


  if (isPending || (session && profileLoading)) {
    return <p className="app-loading">Loading…</p>;
  }
  if (!session) {
    return <AuthForm />;
  }

  // A new target means the old macro grams no longer fit, so the split is picked again.
  async function handleSelectGoal(calories: number, birthDate: string | null) {
    await saveProfile({
      variables: { input: { calorieTarget: calories, protein: 0, carbs: 0, fats: 0, birthDate } },
    });
    setEditingTarget(false);
  }

  function handleSelectMacros(grams: Macros) {
    saveProfile({
      variables: {
        input: { calorieTarget: caloricDeficit, ...grams, birthDate: profile?.birthDate ?? null },
      },
    });
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

      {caloricDeficit === 0 || editingTarget ? (
        <main className="app-onboarding">
          <TdeeCalculator
            onSelectGoal={handleSelectGoal}
            savedBirthDate={profile?.birthDate}
          />
        </main>
      ) : (
      <div className="app-layout">
        {/* Summary rail: stays in view while meals are logged on the right. */}
        <aside className="app-rail">
          <section className="card">
            <CaloricDeficit
              caloricDeficit={caloricDeficit}
              onEdit={() => setEditingTarget(true)}
            />
          </section>

          {(caloricDeficit !== 0 && Object.values(macros).every(value => value === 0)) && (
            <section className="card">
              <Macros
                caloricDeficit={caloricDeficit}
                macros={macros}
                onSelect={handleSelectMacros}
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
            <FoodLog foodLog={foodLog} />
          </section>
        </main>
      </div>
      )}
    </div>
  );
}

export default App;
