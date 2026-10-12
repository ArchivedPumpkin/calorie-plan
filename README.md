# Calorie Plan

A daily calorie and macro tracker. Set a calorie target, pick a macro split, and log what you eat by searching a food database, scanning a nutrition label with your phone camera, or typing it in.

**Live app:** [calorie-plan.vercel.app](https://calorie-plan.vercel.app/)

---

## What it's for

Most calorie trackers make logging a meal slow, and logging fast is what keeps people consistent. Calorie Plan focuses on three quick ways to add food:

- **Search** a food like "banana" and pick it from a list of real nutrition data.
- **Scan** a nutrition label with your phone camera, and AI reads the numbers for you.
- **Type it in** yourself for homemade meals.

You then enter how many grams you ate, and the app works out the calories, protein, carbs and fat for that portion.

## How to use it

1. **Set your daily calorie target**, e.g. 2000 kcal.
2. **Choose a macro split:** moderate, lower or higher carb. This sets your daily protein, carbs and fat goals in grams.
3. **Add a meal:**
   - type a food into the search bar and pick a result,
   - tap **Scan label** and take a photo of a nutrition label, or
   - tap **Add manually** and enter the values from the packaging.
4. **Enter the amount you ate in grams.** Nutrition values are per 100g, and a live preview shows what will be logged.
5. **Track your day:** the ring shows calories eaten against your target, and the bars show progress for each macro.

> Your data isn't saved yet. Refreshing the page starts a new day. See [Limitations](#limitations-and-roadmap).

## Features

- Daily calorie target with a progress ring
- Three macro splits, with protein, carbs and fat goals calculated from your target
- Food search backed by the USDA FoodData Central database
- Nutrition label scanning with Google Gemini, which reads the label from a photo
- Manual entry for anything else
- Live per-portion preview: values are entered per 100g and scaled to the grams you ate
- Mobile-first layout tested from 320px phones up to desktop

---

## Tech stack

| Area | Technology |
|---|---|
| Frontend | [React 19](https://react.dev), [TypeScript](https://www.typescriptlang.org), [Vite](https://vite.dev) |
| Data fetching | [Apollo Client](https://www.apollographql.com/docs/react) (GraphQL) |
| Backend | [Node.js](https://nodejs.org), [Express 5](https://expressjs.com) |
| API | [GraphQL](https://graphql.org) with [Apollo Server](https://www.apollographql.com/docs/apollo-server) for food search, plus one REST endpoint for label scanning |
| AI | [Google Gemini](https://ai.google.dev) (`gemini-3.5-flash-lite`) via `@google/genai`, with structured JSON output |
| Food data | [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide) |
| Validation | [Zod](https://zod.dev) schemas for the AI response |
| UI | Plain CSS with design tokens, [lucide-react](https://lucide.dev) icons, [react-circular-progressbar](https://www.npmjs.com/package/react-circular-progressbar) |
| Hosting | [Vercel](https://vercel.com): static frontend plus the Express API as a serverless function |

## How it works

```
                 ┌──────────────────────────── Browser (React) ───────────────────────────┐
                 │  FoodSearch ── Apollo Client ──┐      ScanLabel ── resize photo ──┐     │
                 └────────────────────────────────┼───────────────────────────────────┼─────┘
                                                  │ POST /graphql                      │ POST /api/scan-label
                 ┌────────────────────────────────▼───────── Express ─────────────────▼─────┐
                 │  Apollo Server: searchFoods resolver       scanLabel route                │
                 │            │                                     │                        │
                 │     services/usda.js                    services/gemini.js                │
                 └────────────┼─────────────────────────────────────┼────────────────────────┘
                              ▼                                     ▼
                  USDA FoodData Central API              Google Gemini API
```

- **Food search** goes through GraphQL. The React app sends a `searchFoods(query: String!)` query, and the resolver calls the USDA API and turns its response into the app's own `Food` type (name, calories, protein, carbs and fat per 100g). The frontend never sees USDA's format.
- **Label scanning** resizes the photo in the browser first (to 1200px JPEG, which keeps uploads well under Vercel's 4.5 MB request limit), then posts it to `/api/scan-label`. Gemini returns JSON constrained by a Zod-derived schema, which the server validates again. If the photo has no readable label, the endpoint answers `422` and the app shows an error instead of filling the form with zeros.
- **API keys stay on the server.** The browser never talks to USDA or Gemini directly.

---

## Run it locally

### Prerequisites

- Node.js 20 or newer
- A free **Gemini API key** from [Google AI Studio](https://aistudio.google.com) (Get API key)
- A free **USDA API key** from [api.data.gov/signup](https://api.data.gov/signup)

### Setup

```bash
git clone https://github.com/ArchivedPumpkin/calorie-plan.git
cd calorie-plan
npm install
```

Create a `.env` file in the project root. It's already in `.gitignore`, so it won't be committed:

```env
GEMINI_API_KEY=your-gemini-key
USDA_API_KEY=your-usda-key
```

### Start

Run the backend and frontend in two terminals:

```bash
npm start      # Express + GraphQL API on http://localhost:8000
npm run dev    # Vite dev server on http://localhost:5173
```

Vite proxies `/graphql` and `/api` to port 8000, so the frontend uses the same relative URLs locally and in production.

You can explore the GraphQL API at **http://localhost:8000/graphql**, which opens Apollo Sandbox:

```graphql
query SearchFoods($text: String!) {
  searchFoods(query: $text, limit: 5) {
    name
    calories
    protein
    carbs
    fats
  }
}
```

with variables `{ "text": "banana" }`.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm start` | Start the Express API server |
| `npm run build` | Type-check and build the frontend into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
api/index.js            Vercel serverless entry point, re-exports the Express app
server/
  server.js             Express setup: mounts GraphQL and the REST route
  graphql/typeDefs.js   GraphQL schema (Food type, searchFoods query)
  graphql/resolvers.js  Resolvers, kept thin: they call services
  routes/scanLabel.js   POST /api/scan-label
  services/usda.js      USDA search + mapping to the Food type
  services/gemini.js    Gemini label extraction + Zod validation
src/
  main.tsx              App entry, Apollo Client setup
  App.tsx               Layout and shared state (target, macros, food log)
  Components/           CaloricDeficit, Macros, DisplayStats, FoodLog, FoodSearch, ScanLabel
vercel.json             Rewrites /graphql and /api/* to the serverless function
```

## Deploying

The app is deployed on Vercel from this repository, and every push to `main` redeploys it.

- Vercel builds the Vite frontend and serves `dist/` as static files.
- `api/index.js` turns the Express app into a serverless function, and `vercel.json` routes `/graphql` and `/api/*` to it.
- `GEMINI_API_KEY` and `USDA_API_KEY` are set under **Project → Settings → Environment Variables**.

## Limitations and roadmap

- **No saved data yet.** Everything lives in React state and resets on refresh. Next up is a database, with saving custom foods as a GraphQL mutation so they appear in search alongside USDA results.
- **Grams only.** Liquids measured in ml or dl aren't supported yet.
- **Free-tier API limits.** Gemini's free tier has a small daily quota, so scanning can be rate-limited.
- **AI extraction can be wrong.** Always check scanned values before adding the meal.
