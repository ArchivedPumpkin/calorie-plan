import { db } from "../db/db.js";

// One document per user: their calorie target and macro grams.
const profiles = db.collection("profiles");

export async function getProfile(userId) {
  return profiles.findOne({ userId });
}

// Upsert: update the user's profile, or create it on the first save.
export async function saveProfile(userId, input) {
  return profiles.findOneAndUpdate(
    { userId },
    { $set: { ...input, updatedAt: new Date() } },
    { upsert: true, returnDocument: "after" },
  );
}
