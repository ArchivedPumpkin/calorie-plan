import { useState } from "react";
import { ChartPie, Check } from "lucide-react";
import { MACRO_SPLITS, macroGrams, type MacroSplitKey } from "../lib/macros";

type MacrosProps = {
  onSelect: (macros: { protein: number; carbs: number; fats: number }) => void;
  caloricDeficit: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
};

export default function Macros(props: MacrosProps) {
  const [selected, setSelected] = useState<MacroSplitKey | null>(null);

  function handleSelect(key: MacroSplitKey) {
    setSelected(key);
    props.onSelect(macroGrams(props.caloricDeficit, key));
  }

  const carbsCard = (Object.keys(MACRO_SPLITS) as MacroSplitKey[]).map((key) => {
    const split = MACRO_SPLITS[key];
    const grams = macroGrams(props.caloricDeficit, key);
    return (
      <button
        key={key}
        type="button"
        className={`macro-card${selected === key ? " selected" : ""}`}
        onClick={() => handleSelect(key)}
      >
        <div className="macro-card-badge">
          <span>
            {split.label} ({split.protein}/{split.carbs}/{split.fats})
          </span>
          <Check className="macro-card-check" size={14} strokeWidth={3} />
        </div>
        <div className="macro-card-body">
          <div className="macro-stat">
            <strong>{grams.protein}g</strong>
            <span>protein</span>
          </div>
          <div className="macro-stat">
            <strong>{grams.carbs}g</strong>
            <span>carbs</span>
          </div>
          <div className="macro-stat">
            <strong>{grams.fats}g</strong>
            <span>fats</span>
          </div>
        </div>
      </button>
    );
  });

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
