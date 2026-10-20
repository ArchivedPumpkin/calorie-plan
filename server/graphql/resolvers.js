import { searchFoods } from "../services/usda.js";
import { GraphQLError } from "graphql";
export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",
    searchFoods: (parent, args) => searchFoods(args.query, args.limit),
    me: (parent, args, context) => {
      if (!context.user) {
        throw new GraphQLError("You must be logged in", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      return context.user;
    },
  },
};
