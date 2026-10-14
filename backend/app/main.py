import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / "backend" / ".env")

app = FastAPI(
    title="TN Schemes AI",
    description="Tamil Nadu government schemes assistant API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    language: str = Field(default="auto", pattern="^(auto|en|ta)$")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "tn-schemes-ai",
        "token_monitoring": "enabled_for_model_calls",
    }


@app.post("/api/chat")
def chat(request: ChatRequest):
    # Import lazily so health checks remain available even if an optional
    # model dependency is missing or misconfigured.
    try:
        from app.rag.generate_answer_optimized import answer_question_compact

        return answer_question_compact(
            request.question,
            language=request.language,
        )
    except Exception:
        # Do not expose secrets, provider responses, or stack traces to clients.
        return {
            "question": request.question,
            "answer": (
                "The assistant could not complete this request. Please try again "
                "later, and verify scheme details with the relevant official "
                "Tamil Nadu government department."
            ),
            "sources": [],
            "status": "generation_error",
            "model_configured": bool(os.getenv("OPENAI_API_KEY")),
            "usage": {
                "input_tokens": None,
                "output_tokens": None,
                "total_tokens": None,
                "model_calls": None,
                "latency_ms": None,
                "usage_available": False,
            },
        }
