This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## App Flow

1. **User Input**
   - Users can either:
     - Enter a text description of what they want to eat (e.g., "It's rainy and I want something spicy") using the **SuggestFoodForm** ([components/SuggestFoodForm.tsx](components/SuggestFoodForm.tsx)).
     - Upload a food image for analysis using the **UploadAnalyzeForm** ([components/UploadAnalyzeForm.tsx](components/UploadAnalyzeForm.tsx)).

2. **Food Suggestion (Text Query)**
   - The text query is sent to the `/api/suggest` endpoint ([src/app/api/suggest/route.ts](src/app/api/suggest/route.ts)).
   - The backend uses the `suggestFoodAgent` ([lib/agent/langchain/index.ts](lib/agent/langchain/index.ts)) to generate dish suggestions.
   - The response is parsed and displayed as a list of suggested dishes, including calories, dietary suitability, and images.

3. **Food Analysis (Image Upload)**
   - The uploaded image is previewed and then sent as a base64 string to `/api/detect/llava` ([src/app/api/detect/llava/route.ts](src/app/api/detect/llava/route.ts)).
   - The backend uses `detectFoodAgent` to recognize the dish name from the image.
   - The detected dish name is then sent to `/api/analyze` ([src/app/api/analyze/route.ts](src/app/api/analyze/route.ts)), which uses `analyzeFoodAgent` to analyze ingredients, calories, and dietary suitability.
   - The analysis result is displayed to the user.

4. **APIs and Prompts**
   - All AI/LLM logic and prompt templates are managed in [lib/agent/](lib/agent/) and [lib/agent/prompts/](lib/agent/prompts/).
   - Google Vision API credentials are managed via environment variables (see `.env` or `sample.env`).

5. **UI**
   - The main UI is rendered in [src/app/page.tsx](src/app/page.tsx), allowing users to switch between suggestion and analysis tabs.
   - Results are styled using Tailwind CSS ([src/app/globals.css](src/app/globals.css)).

6. **Environment & Deployment**
   - Environment variables are configured in `.env.local` or `.env.docker`.
   - The app can be run locally (`npm run dev`) or deployed using Docker (`docker-compose.dev.yml`, `Dockerfile`).


![image](https://github.com/user-attachments/assets/e4b90111-b3a4-4dee-ab8c-fa1dccb140ef)

