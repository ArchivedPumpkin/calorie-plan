import { Target, Pencil } from "lucide-react";

type CaloricDeficitProps = {
  caloricDeficit: number;
  setCaloricDeficit: (caloricDeficit: number) => void;
};

// Shown once a target is set; "Edit" clears it, which brings back the calculator.
export default function CaloricDeficit(props: CaloricDeficitProps) {
  return (
    <div>
      <div className="card-header">
        <div className="card-title">
          <Target size={16} strokeWidth={2.25} />
          <h2>Caloric Deficit</h2>
        </div>
      </div>
      <div className="form-actions">
        <div className="summary-value">
          <strong>{props.caloricDeficit}</strong>
          <span>calories per day</span>
        </div>
        <button
          type="button"
          className="btn-link"
          onClick={() => props.setCaloricDeficit(0)}
        >
          <Pencil size={12} strokeWidth={2.5} />
          Edit
        </button>
      </div>
    </div>
  );
}
