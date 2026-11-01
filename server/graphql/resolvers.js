import { GraphQLError } from "graphql";
import { searchFoods } from "../services/usda.js";
import {
  getFoodEntries,
  addFoodEntry,
  deleteFoodEntry,
} from "../services/foodLog.js";

function requireUser(context) {
  if (!context.user) {
    throw new GraphQLError("You must be logged in", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return context.user;
}

export const resolvers = {
  Query: {
    searchFoods: (parent, args) => searchFoods(args.query, args.limit),
    me: (parent, args, context) => requireUser(context),
    foodEntries: (parent, args, context) =>
      getFoodEntries(requireUser(context).id, args.date),
  },

  Mutation: {
    addFoodEntry: (parent, args, context) =>
      addFoodEntry(requireUser(context).id, args.input),
    deleteFoodEntry: (parent, args, context) =>
      deleteFoodEntry(requireUser(context).id, args.id),
  },
};
