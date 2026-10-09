import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import scanLabelRouter from "./routes/scanLabel.js";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

app.use("/graphql", expressMiddleware(apollo));
app.use("/api", scanLabelRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
