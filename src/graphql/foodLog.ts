import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";

export type FoodEntry = {
  id: string;
  date: string;
  meal: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type FoodEntryInput = Omit<FoodEntry, "id">;

// The user's local date as YYYY-MM-DD, so a meal at 11pm counts for their day.
export const today = () => new Date().toLocaleDateString("en-CA");

export const FOOD_ENTRIES: TypedDocumentNode<
  { foodEntries: FoodEntry[] },
  { date: string }
> = gql`
  query FoodEntries($date: String!) {
    foodEntries(date: $date) {
      id
      date
      meal
      grams
      calories
      protein
      carbs
      fats
    }
  }
`;

export const ADD_FOOD_ENTRY: TypedDocumentNode<
  { addFoodEntry: FoodEntry },
  { input: FoodEntryInput }
> = gql`
  mutation AddFoodEntry($input: FoodEntryInput!) {
    addFoodEntry(input: $input) {
      id
      date
      meal
      grams
      calories
      protein
      carbs
      fats
    }
  }
`;

export const DELETE_FOOD_ENTRY: TypedDocumentNode<
  { deleteFoodEntry: boolean },
  { id: string }
> = gql`
  mutation DeleteFoodEntry($id: ID!) {
    deleteFoodEntry(id: $id)
  }
`;
