
# 📖 AnimePulse: Anime Catalog Web Application

AnimePulse is a modern, responsive web application designed for authenticated users to browse a public catalog of anime, manage their own personal watch list, and track their viewing progress and favorite titles.

This project is built using a custom **React/Express/PostgreSQL stack** and utilizes external APIs for data fetching.

## 🚀 Key Features

* **Public Catalog:** Browse a large, paginated catalog of anime pulled from the Jikan API (MyAnimeList data).
* **User Authentication:** Secure sign-in/sign-up powered by Supabase/custom integration.
* **Personal Watch List:** Add, remove, and update anime entries in a private list.
* **Favorite Toggling:** Easily mark anime as a favorite, visible on the detail and profile pages.
* **Responsive Design:** Built with Material UI (MUI) for a seamless experience on desktop and mobile devices.
* **Dark/Light Mode:** Toggle between color schemes using a custom context.

## 🛠️ Tech Stack

### Frontend (Client)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react`, `react-dom` | `^19.1.1` | UI Library and DOM integration |
| `@mui/material` | `^7.3.5` | Component library for responsive design |
| `react-router-dom` | `^7.9.6` | Client-side routing |
| `@supabase/supabase-js` | `^2.81.1` | Authentication and real-time database interface |
| **External API** | Jikan API | Source of public anime data |

### Backend (Server)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `express` | `^5.1.0` | Node.js web application framework (API creation) |
| `postgres` | `^3.4.7` | PostgreSQL database client |
| `cors` | `^2.8.5` | Middleware for handling cross-origin requests (CORS) |
| `dotenv` | `^17.2.3` | Loading environment variables from .env file |

## ⚙️ Setup and Installation

### 1. Prerequisites

* Node.js (LTS version recommended)
* PostgreSQL
* Git

### 2. Backend Setup (API)

1.  **Clone the repository:**
    ```bash
    git clone (https://github.com/Omor2004/CSE264FinalProject.git)
    cd anime-catalog-project
    ```
2.  **Navigate to the `server` directory:**
    ```bash
    cd server
    npm install
    ```
3.  **Configure environment variables:**
    Create a `.env` file in the `server` directory and add the following:
    ```
    # PostgreSQL Connection (used by app.js)
    PG_HOST=localhost
    PG_USER=[Your DB User]
    PG_PASSWORD=[Your DB Password]
    PG_DATABASE=animepulse_db
    ```
4.  **Set up the database schema:**
    You will need to run the SQL migration scripts to create the `users` and `users_anime_list` tables.

5.  **Run the Express API:**
    ```bash
    npm run dev
    ```
    The API should be running at `http://localhost:3000`.

### 3. Frontend Setup (Client)

1.  **Navigate to the `client` directory:**
    ```bash
    cd ../client
    npm install
    ```
2.  **Configure environment variables:**
    Create a `.env` file in the `client` directory and add:
    ```
    VITE_SUPABASE_URL=[Your Supabase Project URL]
    VITE_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
    ```
3.  **Run the React application:**
    ```bash
    npm run dev
    ```
    The app should open in your browser, typically at `http://localhost:5173`.
