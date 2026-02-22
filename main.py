# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse
from pathlib import Path

from db import init_db, increment_vote, get_votes

app = FastAPI(title="Ghost Wallet Survey API")


# allow frontend html file access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Vote(BaseModel):
    type: str


@app.on_event("startup")
def startup():
    init_db()


BASE_DIR = Path(__file__).resolve().parent

# ---- Frontend files in project root ----
@app.get("/", include_in_schema=False)
def home():
    return FileResponse(BASE_DIR / "index.html")

@app.get("/styles.css", include_in_schema=False)
def styles():
    return FileResponse(BASE_DIR / "styles.css")

@app.get("/app.js", include_in_schema=False)
def app_js():
    return FileResponse(BASE_DIR / "app.js")

@app.get("/api.js", include_in_schema=False)
def api_js():
    return FileResponse(BASE_DIR / "api.js")

@app.post("/api/votes")
def add_vote(v: Vote):
    increment_vote(v.type)
    return {"ok": True}


@app.get("/api/votes")
def read_votes():
    return get_votes()