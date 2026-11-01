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

  type Query {
    searchFoods(query: String!, limit: Int = 10): [Food!]!
    me: User
    foodEntries(date: String!): [FoodEntry!]!
  }

  type Mutation {
    addFoodEntry(input: FoodEntryInput!): FoodEntry!
    deleteFoodEntry(id: ID!): Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

`;
