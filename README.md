# Portfolio

An AI-powered personal portfolio website. The **Next.js** frontend presents my work, and a **Python** backend runs an AI agent (powered by Claude and connected through an MCP server) that can answer questions about my projects, skills, and experience using the data in `backend/data`.

**Live demo:** https://yourname.vercel.app
**API:** https://portfolio-api.onrender.com

## Features

- Modern, responsive portfolio UI built with Next.js and TypeScript
- AI agent that answers questions about me and my work
- MCP (Model Context Protocol) server exposing portfolio data as tools for the agent
- Simple one-command backend startup with `start.sh`

## Tech Stack

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Frontend   | Next.js, React, TypeScript, Tailwind CSS          |
| Backend    | Python, FastAPI (`main.py`)                       |
| AI         | Anthropic Claude, agent (`agent.py`) + MCP server (`mcp_server.py`) |
| Hosting    | Vercel (frontend), Render (backend)               |

## Project Structure

```
portfolio/
├── backend/
│   ├── data/              # Portfolio data used by the agent
│   ├── agent.py           # AI agent logic
│   ├── main.py            # API server entry point
│   ├── mcp_server.py      # MCP server exposing portfolio tools
│   ├── requirements.txt   # Python dependencies
│   └── start.sh           # Script to start the backend
├── frontend/
│   ├── app/               # Next.js app router pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Helpers and utilities
│   ├── public/            # Static assets
│   ├── next.config.ts
│   └── package.json
├── .env                   # Backend environment variables (not committed)
└── README.md
```

## Getting Started (Local)

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [Python](https://www.python.org/) 3.10 or later
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Configure environment variables

**Backend**: create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=sk-your-key-here
```

**Frontend**: create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> Never commit `.env` or `.env.local`. Both should be listed in `.gitignore`.

### 3. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
bash start.sh
```

Or run the API server directly:

```bash
uvicorn main:app --reload --port 8000
```

### 4. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts (Frontend)

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the development server    |
| `npm run build` | Create a production build       |
| `npm run start` | Run the production build        |
| `npm run lint`  | Lint the codebase with ESLint   |

## Deployment

The backend is hosted on **Render** and the frontend on **Vercel**, both on free tiers. Deploy the backend first, because the frontend needs its URL.

### Backend → Render

1. Push this repository to GitHub.
2. Go to [render.com](https://render.com/) → **New** → **Web Service**.
3. Connect your GitHub repo and configure:

   | Setting          | Value                                  |
   | ---------------- | -------------------------------------- |
   | Root Directory   | `backend`                              |
   | Runtime          | Python 3                               |
   | Build Command    | `pip install -r requirements.txt`      |
   | Start Command    | `bash start.sh`                        |

4. Under **Environment Variables**, add:

   ```
   ANTHROPIC_API_KEY=sk-...
   ```

5. Click **Deploy**. You'll get a URL like `https://portfolio-api.onrender.com`.

**Notes:**

- `start.sh` must bind to the port Render provides, for example: `uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}`.
- Update the CORS settings in `main.py` to allow your Vercel domain (e.g. `https://yourname.vercel.app`).
- On the free tier, the service spins down after about 15 minutes of inactivity, so the first request after idle can take 30-60 seconds.

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com/) → **Add New** → **Project** and import the same GitHub repo.
2. Set **Root Directory** to `frontend` (Vercel auto-detects Next.js).
3. Add an environment variable:

   ```
   NEXT_PUBLIC_API_URL=https://portfolio-api.onrender.com
   ```

4. Click **Deploy**. You'll get a URL like `https://yourname.vercel.app`.

> This project uses Next.js, so frontend variables must start with `NEXT_PUBLIC_` (not `VITE_`) to be available in the browser. Redeploy after changing environment variables.

## Customizing

- Update the files in `backend/data/` with your own bio, projects, skills, and experience.
- Edit the components in `frontend/components/` and pages in `frontend/app/` to change the look and content.

## Contributing

This is a personal project, but suggestions and issues are welcome. Feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-name](https://linkedin.com/in/your-name)
- Email: your.email@example.com
