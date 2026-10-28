import { ObjectId } from "mongodb";
import { db } from "../db/db.js";

const entries = db.collection("foodEntries");

function toFoodEntry(doc) {
  const { _id, userId, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export async function getFoodEntries(userId, date) {
  const docs = await entries
    .find({ userId, date })
    .sort({ createdAt: 1 })
    .toArray();
  return docs.map(toFoodEntry);
}

export async function addFoodEntry(userId, input) {
  const doc = { ...input, userId, createdAt: new Date() };
  const result = await entries.insertOne(doc);
  return toFoodEntry({ ...doc, _id: result.insertedId });
}

export async function deleteFoodEntry(userId, id) {
  if (!ObjectId.isValid(id)) return false;
  const result = await entries.deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount === 1;
}
