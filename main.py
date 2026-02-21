# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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


@app.post("/api/votes")
def add_vote(v: Vote):
    increment_vote(v.type)
    return {"ok": True}


@app.get("/api/votes")
def read_votes():
    return get_votes()