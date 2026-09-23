

import { useState } from "react";
import { ChartPie, Check } from "lucide-react";

type MacrosProps = {
  setMacros: React.Dispatch<
    React.SetStateAction<{ protein: number; carbs: number; fats: number }>
  >;
  caloricDeficit: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
};


type CarbsOption = {
  moderate: { protein: number; carbs: number; fat: number };
  lower: { protein: number; carbs: number; fat: number };
  higher: { protein: number; carbs: number; fat: number };
};


export default function Macros(props: MacrosProps) {

  // 1. we split into 3 options the user can choose: moderate cards, lower carbs, and higher carbs.
  // moderate carbs: 30/35/35
  // lower carbs: 40/40/20
  // higher carbs: 30/20/50
  // we display 3 cards, user selects one and we set the props by updating the protein, carbs, and fat values accordingly.

  const carbsOptions: CarbsOption = {
    moderate: { protein: 30, carbs: 35, fat: 35 },
    lower: { protein: 40, carbs: 40, fat: 20 },
    higher: { protein: 30, carbs: 20, fat: 50 }
  }

  const [selected, setSelected] = useState<keyof CarbsOption | null>(null);

  function handleSelect(name: keyof CarbsOption, option: CarbsOption[keyof CarbsOption]) {
    setSelected(name);
    props.setMacros({ protein: gramsFromPercent(option.protein, 4), carbs: gramsFromPercent(option.carbs, 4), fats: gramsFromPercent(option.fat, 9) });
  }

  // protein/carbs are 4 calories per gram, fat is 9 calories per gram
  function gramsFromPercent(percent: number, caloriesPerGram: number) {
    return Math.round((props.caloricDeficit * (percent / 100)) / caloriesPerGram);
  }

  const carbsCard = Object.entries(carbsOptions).map(([name, option]) => (
    <button
      key={name}
      type="button"
      className={`macro-card${selected === name ? " selected" : ""}`}
      onClick={() => handleSelect(name as keyof CarbsOption, option)}
    >
      <div className="macro-card-badge">
        <span>
          {name[0].toUpperCase() + name.slice(1)} Carb ({option.protein}/{option.carbs}/{option.fat})
        </span>
        <Check className="macro-card-check" size={14} strokeWidth={3} />
      </div>
      <div className="macro-card-body">
        <div className="macro-stat">
          <strong>{gramsFromPercent(option.protein, 4)}g</strong>
          <span>protein</span>
        </div>
        <div className="macro-stat">
          <strong>{gramsFromPercent(option.fat, 9)}g</strong>
          <span>fats</span>
        </div>
        <div className="macro-stat">
          <strong>{gramsFromPercent(option.carbs, 4)}g</strong>
          <span>carbs</span>
        </div>
      </div>
    </button>
  ))

  return (
    <div>
      <div className="card-header">
        <div className="card-title">
          <ChartPie size={16} strokeWidth={2.25} />
          <h2>Macro Split</h2>
        </div>
      </div>
      <div className="macro-cards">
        {carbsCard}
      </div>
    </div>
  );
}