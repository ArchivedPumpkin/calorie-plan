import { searchFoods } from "../services/usda.js";
export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
    searchFoods: (parent, args) => searchFoods(args.query, args.limit),
  },
};
