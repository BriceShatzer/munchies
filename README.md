# Munchies Assessment Project  
- [Docs](https://github.com/Punchkick/code-assessment/blob/main/assessment.md) 
- [Figma](https://www.figma.com/design/263XJno7ii0uEaarJP9Ydw/Umain-Tech-Case)

## Getting Up and Running

**Prerequisites:** Node.js (v18+) and npm

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.




## Config.ts

Shared constants used across the app are defined in `config.ts` at the project root.

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `https://work-test-web-2024-eze6j4scpq-lz.a.run.app` | Base URL for the upstream API. Can be overridden via the `NEXT_PUBLIC_API_BASE_URL` environment variable. |
| `CACHE_TTL_SECONDS` | `300` (5 minutes) | How long API responses are cached before being re-fetched. |
| `DELIVERY_TIMES` | `0-10`, `10-30`, `30-60`, `60+` | The delivery time filter options shown in the UI. Each entry defines a `label`, `value`, and min/max `range` (in minutes). |
| `DELIVERY_TIME_RANGES` | *(derived)* | A lookup map generated from `DELIVERY_TIMES` that maps each `value` string to its `[min, max]` range. |


## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Starts the Next.js development server |
| `build` | `npm run build` | Creates a production build |
| `start` | `npm run start` | Runs the production server (requires `build` first) |
| `lint` | `npm run lint` | Runs ESLint |
| `test` | `npm run test` | Runs the Jest test suite |
| `test:watch` | `npm run test:watch` | Runs Jest in watch mode |

---

## Notes  

- **NO HOURS API** - the "Opens tomorrow at 12 pm" is the default and [hardcoded in RestaurantCard](](https://github.com/BriceShatzer/munchies/blob/8800e98c88a6b100d76b7dbfa6247c31c7b8f001/app/components/restaurant/RestaurantCard.tsx#L63) )   
- swagger docs about the price api is incomplete. Doesn't talk about getting all the available price options by calling `/price-range/`    
- We currently have to query for each restaurant's open status individually. Ideally, the open status would be included in the restaurant list response. Alternatively, the `.../api/open/{id}` endpoint could be upgraded to support an empty call (`.../api/open/`) that returns a collection of restaurant IDs with their corresponding open status.
- all the image files are massive


Things that I'd spend more time on:  
- digging deeper into the [font](https://stackoverflow.com/a/36412339/1608016)  
- there's currently no sort of rate limiting for anything anywhere
- do something about the image file size
- env or shared variables (`DEFAULT_TTL`, )




<!-- 
> **Discussion Topics for Follow-up:**
> - Why did you choose your specific architecture (separate apps vs full-stack framework)?
> - How did you implement the caching strategy?
> - How would you approach testing this proxy application?
> - What would you improve given more time?
> - How would you handle scaling this proxy to handle high traffic?
> - How would you structure the codebase for a team?
> - What production concerns would you have with this proxy setup?
-->


<br />
<br />



<details><summary><h2>create-next-app Default Readme</h2></summary>
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


<details>

