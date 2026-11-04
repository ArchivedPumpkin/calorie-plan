import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";

export type Profile = {
  calorieTarget: number;
  protein: number;
  carbs: number;
  fats: number;
  // YYYY-MM-DD; the age is worked out from it, so it never goes stale.
  birthDate: string | null;
};

// null until the user saves a target for the first time.
export const PROFILE: TypedDocumentNode<{ profile: Profile | null }> = gql`
  query Profile {
    profile {
      calorieTarget
      protein
      carbs
      fats
      birthDate
    }
  }
`;

export const SAVE_PROFILE: TypedDocumentNode<
  { saveProfile: Profile },
  { input: Profile }
> = gql`
  mutation SaveProfile($input: ProfileInput!) {
    saveProfile(input: $input) {
      calorieTarget
      protein
      carbs
      fats
      birthDate
    }
  }
`;
