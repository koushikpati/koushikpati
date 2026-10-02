import json
import logging
import time
import uuid
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from agent import ask_agent

# ---------------------------------------------------------------------------
# Logging setup — this is your "who is browsing" trail, correlates with LangSmith
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("portfolio-api")

DATA_DIR = Path(__file__).parent / "data"

# ---------------------------------------------------------------------------
# Rate limiter — keyed off IP. If behind Cloudflare, swap get_remote_address
# for a function reading the CF-Connecting-IP header instead.
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Portfolio API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# CORS — lock this down to your actual frontend domain(s). "*" on a POST
# endpoint that calls an LLM is an open invitation to abuse your API from
# any third-party site.
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "https://frontend-kp-4316.vercel.app/",  # <-- replace with your real domain
    "http://localhost:3000",              # local dev only — remove in prod if you want to be strict
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# ---------------------------------------------------------------------------
# Request logging middleware — gives you visitor visibility without login-gating
# ---------------------------------------------------------------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.time()
    client_ip = request.headers.get("cf-connecting-ip", request.client.host)
    user_agent = request.headers.get("user-agent", "unknown")

    response = await call_next(request)

    duration_ms = round((time.time() - start) * 1000, 2)
    logger.info(
        f"request_id={request_id} ip={client_ip} path={request.url.path} "
        f"method={request.method} status={response.status_code} "
        f"duration_ms={duration_ms} ua={user_agent!r}"
    )
    response.headers["X-Request-ID"] = request_id
    return response


# ---------------------------------------------------------------------------
# Request/response models with validation guards
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: str | None = None  # frontend can generate + persist this per visitor


class ChatResponse(BaseModel):
    reply: str
    session_id: str


@app.get("/")
def root():
    return {"status": "Portfolio API running"}


@app.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(request: Request, req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())

    # Basic guardrail: reject obvious prompt-injection / instruction-override
    # attempts before they hit the agent. Not bulletproof, but cheap and catches
    # the low-effort cases.
    lowered = req.message.lower()
    suspicious_markers = [
        "ignore previous instructions",
        "ignore all previous",
        "you are now",
        "system prompt",
        "disregard your instructions",
    ]
    if any(marker in lowered for marker in suspicious_markers):
        logger.warning(f"session={session_id} blocked suspicious message")
        raise HTTPException(status_code=400, detail="Message could not be processed.")

    try:
        reply = await ask_agent(req.message, session_id=session_id)
    except Exception:
        logger.exception(f"session={session_id} agent call failed")
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")

    return ChatResponse(reply=reply, session_id=session_id)


@app.get("/projects")
@limiter.limit("30/minute")
def projects(request: Request):
    with open(DATA_DIR / "projects.json") as f:
        return json.load(f)


@app.get("/resume")
@limiter.limit("30/minute")
def resume(request: Request):
    with open(DATA_DIR / "resume.json") as f:
        return json.load(f)