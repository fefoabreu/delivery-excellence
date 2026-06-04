"""
Seed the Quality Assurance (AI-QA) tables from the canonical
quality-assurance.json dataset.

This is idempotent: it clears the QA tables and reloads them, so re-running
re-syncs the DB to the JSON. The JSON keys map 1:1 to the model columns.
"""
import json
from pathlib import Path
from database import SessionLocal, engine
from models.models import (
    Base,
    QAPortfolioMonitor,
    QACheckpoint,
    QAGetToGreen,
    QAKnowledgeNetwork,
    QAClientPortal,
    QASingleton,
)

Base.metadata.create_all(bind=engine)

DATA_DIR = Path(__file__).resolve().parents[1] / "frontend" / "public" / "mock-data"

# json top-level key  ->  model handling the list rows
LIST_MODELS = {
    "portfolio_monitor": QAPortfolioMonitor,
    "checkpoints": QACheckpoint,
    "get_to_green": QAGetToGreen,
    "knowledge_network": QAKnowledgeNetwork,
    "client_portal": QAClientPortal,
}

# json top-level key  ->  stored as a single QASingleton row under this key
SINGLETON_KEYS = ["health_reviews", "qa_evals"]


def run():
    data = json.load(open(DATA_DIR / "quality-assurance.json"))
    db = SessionLocal()
    try:
        # Clear existing QA rows so the seed is idempotent.
        for model in LIST_MODELS.values():
            db.query(model).delete()
        db.query(QASingleton).delete()
        db.commit()

        counts = {}
        for key, model in LIST_MODELS.items():
            rows = data.get(key, [])
            for row in rows:
                db.add(model(**row))
            counts[key] = len(rows)

        for key in SINGLETON_KEYS:
            db.add(QASingleton(key=key, data=data.get(key)))
            counts[key] = 1

        db.commit()

        total = sum(counts.values())
        print("Seeded QA tables:")
        for k, n in counts.items():
            print(f"  {k:<22} {n}")
        print(f"  {'TOTAL':<22} {total}")
    finally:
        db.close()


if __name__ == "__main__":
    run()
