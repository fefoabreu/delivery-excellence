#!/bin/bash
# Start Delivery Excellence — backend + frontend
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

BACKEND_PORT=8000
# 5173 is used by the OneWay project, so DE runs its frontend on a dedicated port.
FRONTEND_PORT=5188

echo "Starting Delivery Excellence..."

# Free up any stale processes on our ports so reloads are clean.
lsof -ti:$BACKEND_PORT  | xargs kill 2>/dev/null || true
lsof -ti:$FRONTEND_PORT | xargs kill 2>/dev/null || true
sleep 1

# ── Backend ──────────────────────────────────────────────────────────────
cd "$ROOT/backend"
source .venv/bin/activate

# Seed the QA tables on first run only (never clobbers later QA edits).
python - <<'PY'
from database import SessionLocal, engine
from models.models import Base, QAPortfolioMonitor
Base.metadata.create_all(bind=engine)
db = SessionLocal()
empty = db.query(QAPortfolioMonitor).count() == 0
db.close()
if empty:
    import seed_qa
    seed_qa.run()
else:
    print("QA tables already seeded — skipping.")
PY

uvicorn main:app --host 0.0.0.0 --port $BACKEND_PORT --reload &
BACKEND_PID=$!
echo "  ✓ Backend running on http://localhost:$BACKEND_PORT (PID $BACKEND_PID)"

# ── Frontend ─────────────────────────────────────────────────────────────
cd "$ROOT/frontend"
npm run dev -- --port $FRONTEND_PORT --strictPort &
FRONTEND_PID=$!
echo "  ✓ Frontend running on http://localhost:$FRONTEND_PORT (PID $FRONTEND_PID)"

echo ""
echo "  Open: http://localhost:$FRONTEND_PORT"
echo "  API docs: http://localhost:$BACKEND_PORT/docs"
echo ""
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "  ⚠  ANTHROPIC_API_KEY is not set — the AI agent (chat / SLW drafting / health analysis) will be disabled."
  echo "     Run: export ANTHROPIC_API_KEY=... before ./start.sh to enable it."
else
  echo "  ✓ ANTHROPIC_API_KEY detected — AI agent enabled."
fi
echo ""
echo "  Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
