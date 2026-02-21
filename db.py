# db.py
import sqlite3
from pathlib import Path

DB_PATH = Path("votes.db")


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS votes (
                type TEXT PRIMARY KEY,
                count INTEGER NOT NULL DEFAULT 0
            )
            """
        )
        conn.commit()


def increment_vote(vote_type: str) -> None:
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO votes(type, count)
            VALUES (?, 1)
            ON CONFLICT(type)
            DO UPDATE SET count = count + 1
            """,
            (vote_type,),
        )
        conn.commit()


def get_votes() -> dict:
    with get_conn() as conn:
        rows = conn.execute("SELECT type, count FROM votes").fetchall()

    return {row["type"]: row["count"] for row in rows}