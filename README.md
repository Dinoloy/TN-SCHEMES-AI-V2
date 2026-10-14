# TN Schemes AI — validated source package

This package contains the Next.js frontend and FastAPI backend for the TN Scheme Guide prototype.

## Important current limitation

The `/api/chat` endpoint in `backend/app/main.py` deliberately returns a safe fallback message. A working scheme retrieval/index pipeline is **not connected**. `backend/app/rag/generate_answer_optimized.py` is a reference integration pattern and imports `backend/app/rag/retrieve.py`, which is not included in this package. Do not present AI answers as grounded in official scheme documents until retrieval, citations, and source freshness checks are implemented.

The five frontend catalogue entries are demo categories, not verified individual government schemes. Confirm all details against official department sources before launch.

## Setup on Windows

### Backend

From the project root in PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
Copy-Item backend\.env.example backend\.env
```

Edit `backend\.env` locally and set `OPENAI_API_KEY` only if/when the real RAG/LLM path is integrated. Never commit `backend\.env`.

Start the API from the project root:

```powershell
python -m uvicorn app.main:app --app-dir backend --reload --host 127.0.0.1 --port 8000
```

Check `http://127.0.0.1:8000/health`.

### Frontend

Open a second PowerShell terminal:

```powershell
Set-Location frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The local API URL is configured in `frontend/.env.local`.

## Tests and validation

Run backend unit tests from the backend directory:

```powershell
Set-Location backend
python -m pytest -q
```

The included token-budget tests passed in the validation environment (3 passed). TypeScript validation also passed (`tsc --noEmit`). A full Next.js production build could not be completed in the validation environment because the required platform-specific SWC binary was not cached and network access to download it was unavailable. Re-run `npm run build` locally after `npm install`.

## Security and repository hygiene

- `.env` and `.env.local` are intentionally not included.
- Use the `.env.example` files as templates.
- `node_modules`, `.next`, Python caches, virtual environments, and other generated files are intentionally excluded from this source package.
