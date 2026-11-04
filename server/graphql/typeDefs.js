export const typeDefs = `
  type Food {
    id: ID!
    name: String!
    calories: Float!
    protein: Float!
    carbs: Float!
    fats: Float!
  }

  type FoodEntry {
    id: ID!
    date: String!
    meal: String!
    grams: Float!
    calories: Float!
    protein: Float!
    carbs: Float!
    fats: Float!
  }

  input FoodEntryInput {
    date: String!
    meal: String!
    grams: Float!
    calories: Float!
    protein: Float!
    carbs: Float!
    fats: Float!
  }

  type Profile {
    calorieTarget: Int!
    protein: Int!
    carbs: Int!
    fats: Int!
    birthDate: String
  }

  input ProfileInput {
    calorieTarget: Int!
    protein: Int!
    carbs: Int!
    fats: Int!
    birthDate: String
  }

  type Query {
    searchFoods(query: String!, limit: Int = 10): [Food!]!
    me: User
    foodEntries(date: String!): [FoodEntry!]!
    profile: Profile
  }

  type Mutation {
    addFoodEntry(input: FoodEntryInput!): FoodEntry!
    deleteFoodEntry(id: ID!): Boolean!
    saveProfile(input: ProfileInput!): Profile!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

`;
