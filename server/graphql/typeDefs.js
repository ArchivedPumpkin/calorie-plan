export const typeDefs = `
  type Food {
    id: ID!
    name: String!
    calories: Float!
    protein: Float!
    carbs: Float!
    fats: Float!
  }

  type Query {
    hello: String!
    searchFoods(query: String!, limit: Int = 10): [Food!]!
    me: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

`;
