 #  Disaster Relief Dashboard
 
 A full‑stack disaster monitoring and relief allocation dashboard built with **Next.js 15**, **React 18**, **TypeScript**, **Tailwind CSS**, and a companion **Python ML pipeline** that scrapes news, detects disasters, deduplicates events, and predicts relief supply allocations.
 
 ## Features
 
 - **Global disaster overview** – Interactive map and dashboard cards showing current disasters and affected areas.
 - **ML‑driven supply planning** – Python pipeline that:
   - Scrapes disaster news articles.
   - Extracts disaster type, severity, and locations.
   - Deduplicates overlapping reports into unique events.
   - Predicts and allocates relief supplies for each disaster.
 - **Modern UI** – Responsive dashboard using Tailwind CSS and Radix/shadcn-style components.
 - **API layer & models** – Next.js API routes with Mongoose models for supplies and users.
 
 ## Tech Stack
 
 - **Frontend / Backend**
   - Next.js 15 (App Router)
   - React 18 + TypeScript
   - Tailwind CSS
   - Radix UI primitives & custom `components/ui` library
   - Mongoose / MongoDB for persistence
 - **ML Service (`mlService/`)**
   - Python 3
   - pandas, NumPy, scikit‑learn, XGBoost
   - spaCy, NLTK, newspaper3k, geopy
   - `schedule`, `python-dotenv`, and other utilities
 
 ## Project Structure
 
 High‑level layout of the main app (inside `NinjaHattori/`):
 
 - `app/`
   - `page.tsx` – Server component that reads `mlService/disaster_allocations_report.json` and passes processed data into the UI.
   - `dashboard/page.tsx` – Main dashboard with map, stats cards, and tabs.
   - `api/` – Next.js route handlers for articles, disasters, and supplies.
 - `components/`
   - Feature components like `home-client`, `disaster-map`, `news-scroller`, `priority-list`, `supply-overview`, etc.
   - `components/ui/` – Reusable UI primitives (button, card, dialog, form, tabs, etc.).
 - `mlService/`
   - Python ML pipeline and scripts such as `main_pipeline.py`, `main.py`, `relief_supply_manager.py`, `predict_disaster_allocations.py`, plus CSV/JSON artifacts.
 - `models/`
   - Mongoose models for supplies and users.
 - `lib/`
   - Shared utilities and server actions.
 - `middleware.ts`
   - Next.js middleware (e.g. auth / routing logic).
 - `styles/`, `tailwind.config.ts`, `postcss.config.mjs`
   - Styling config and global styles.
 
 ## Prerequisites
 
 - **Node.js** ≥ 18
 - **npm** or **pnpm**
 - **Python** ≥ 3.9 (for `mlService/`)
 - **MongoDB** instance (local or hosted) if you want persistence for models.
 - A **News API key** (or compatible provider) for the ML scraper:
   - Available to Python via `NEWS_API_KEY` in a `.env` file inside `mlService/`.
 
 ## Setup – Next.js App
 
 1. **Install dependencies**
 
    ```bash
    cd NinjaHattori
    # Use ONE of the following:
    npm install
    # or
    pnpm install
    ```
 
 2. **Configure environment variables for the Next.js app**
 
    Create a `.env.local` file in `NinjaHattori/` and add the variables required by your APIs, middleware, and helpers (see `helpers/getDataFromToken.ts`, `middleware.ts`, and `app/api/**` for exact names). Typical examples might look like:
 
    ```bash
    MONGODB_URI="mongodb://localhost:27017/ninja"
    JWT_SECRET="your-jwt-secret"
    NEXT_PUBLIC_SITE_URL="http://localhost:3000"
    ```
 
    Adjust these to match how you’ve configured MongoDB, auth, and email in your project.
 
 3. **Run the Next.js dev server**
 
    ```bash
    npm run dev
    # or
    pnpm dev
    ```
 
    Then open `http://localhost:3000` in your browser.
 
    - The home page reads `mlService/disaster_allocations_report.json`. If that file doesn’t exist yet, the UI will load with no disasters and safe default state.
 
 ## Setup – ML Service (`mlService/`)
 
 The ML service is responsible for generating `mlService/disaster_allocations_report.json`, which powers the dashboard.
 
 1. **Create a virtual environment & install Python dependencies**
 
    ```bash
    cd NinjaHattori/mlService
    python -m venv .venv
    .venv\Scripts\activate  # Windows
    # source .venv/bin/activate  # macOS / Linux
 
    pip install --upgrade pip
    pip install -r requirements.txt
    ```
 
 2. **Configure environment for the scraper**
 
    Create a `.env` file inside `mlService/`:
 
    ```bash
    NEWS_API_KEY="your-news-api-key"
    ```
 
 3. **Run the full pipeline (scrape → analyze → allocate supplies)**
 
    From within `mlService/`:
 
    ```bash
    python main_pipeline.py
    ```
 
    This will:
 
    - Fetch recent disaster news.
    - Process and deduplicate articles into unique disasters.
    - Predict supply allocations with `ReliefSupplyManager`.
    - Write `disaster_allocations_report.json` into `mlService/`.
 
    As long as this JSON file exists, the Next.js home page can display up‑to‑date disaster and allocation data.
 
 4. **Optional – Continuous updates**
 
    `main_pipeline.py` includes a scheduler that can run the pipeline periodically. Running it as above will:
 
    - Execute the pipeline once on startup.
    - Then continue to run it on a schedule (currently configured to run every hour) until you stop the process.
 
 ## NPM Scripts
 
 From `NinjaHattori/`:
 
 - `npm run dev` – Start the development server.
 - `npm run build` – Create a production build.
 - `npm start` – Run the production server.
 - `npm run lint` – Run Next.js linting.

