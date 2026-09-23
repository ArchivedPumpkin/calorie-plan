import React from "react";
import { Target, Pencil } from "lucide-react";

// This component should return a form for the user to input their desired caloric deficit in calories per day.

type CaloricDeficitProps = {
  caloricDeficit: number;
  setCaloricDeficit: (caloricDeficit: number) => void;
};

export default function CaloricDeficit(props: CaloricDeficitProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const caloricDeficit = Number(formData.get("caloricDeficit"));
    props.setCaloricDeficit(caloricDeficit);
  }

  return (
    <div>
      <div className="card-header">
        <div className="card-title">
          <Target size={16} strokeWidth={2.25} />
          <h2>Caloric Deficit</h2>
        </div>
      </div>
      {props.caloricDeficit !== 0 ? (
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
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="caloricDeficit">
              Desired caloric deficit (calories per day)
            </label>
            <input
              type="number"
              id="caloricDeficit"
              name="caloricDeficit"
              defaultValue={props.caloricDeficit}
              min={0}
              required
            />
          </div>
          <button type="submit">Save deficit</button>
        </form>
      )}
    </div>
  );
}
