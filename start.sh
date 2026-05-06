#!/bin/bash
# Start Delivery Excellence — backend + frontend
echo "Starting Delivery Excellence..."

# Backend
cd "$(dirname "$0")/backend"
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "  ✓ Backend running on http://localhost:8000 (PID $BACKEND_PID)"

# Frontend
cd "../frontend"
npm run dev &
FRONTEND_PID=$!
echo "  ✓ Frontend running on http://localhost:5173 (PID $FRONTEND_PID)"

echo ""
echo "  Open: http://localhost:5173"
echo "  API docs: http://localhost:8000/docs"
echo ""
echo "  Set ANTHROPIC_API_KEY in your environment to enable the AI agent."
echo ""
echo "  Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
