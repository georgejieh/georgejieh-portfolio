# Deploying the MachineRead demo backend to Hugging Face Spaces

The `/machineread` page on this site is a static frontend. It calls the
MachineRead-Preview FastAPI backend hosted as a free Docker Space at
`https://coldashsage-machineread.hf.space`. This doc covers standing that up.

## 1. Create the Space

- huggingface.co → New Space → owner `ColdAshSage`, name `machineread`
- SDK: **Docker** (blank template), hardware: CPU basic (free), visibility: public
- The resulting API base URL is `https://coldashsage-machineread.hf.space`
  (owner and name, lowercased, joined with a dash). If you pick a different
  name, update `API_BASE` in `src/pages/machineread.astro`.

## 2. Add a Dockerfile to the Space repo

HF Spaces require the app to listen on port **7860**. Copy the backend from
MachineRead-Preview into the Space repo (or add the Space as a second git
remote) with this Dockerfile at the root:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY backend/ ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

EXPOSE 7860
CMD ["python", "-m", "uvicorn", "app.main:app", "--app-dir", "backend", "--host", "0.0.0.0", "--port", "7860"]
```

## 3. Enable CORS for the portfolio origin

The browser calls the API cross-origin from georgejieh.dev, so FastAPI must
allow it. In the backend app setup (where `FastAPI()` is created), make sure
CORSMiddleware includes:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://georgejieh.dev",
        "http://localhost:3000",   # local frontend dev
        "http://localhost:4321",   # local astro dev
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

If the backend already has CORS for localhost:3000, just append the
georgejieh.dev origin.

## 4. Verify

- `curl https://coldashsage-machineread.hf.space/health` → `{"status":"ok"}`
- Open georgejieh.dev/machineread and run an audit against any public site.
- Local testing without deploying: run the backend locally and open
  `/machineread?api=http://127.0.0.1:8000` — the page reads the `api` query
  param as an API base override.

## Notes

- Free Spaces sleep after ~48h of inactivity; first request wakes them in
  roughly 30-60s. The demo page already handles this: it polls `/health` for
  up to 90s with a "waking from sleep" status before submitting the audit.
- The Essentials tier is anonymous, rate-limited per IP, and SSRF-guarded, so
  exposing it publicly matches its design. No API keys or secrets are needed
  anywhere in this setup.
- Keep the Space's copy of the backend in sync with MachineRead-Preview
  releases; the audit contract is pinned by the OpenAPI schema in that repo.
