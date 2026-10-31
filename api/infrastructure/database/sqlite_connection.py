import sqlite3
from typing import Generator
from infrastructure.config import settings

def get_connection() -> sqlite3.Connection:
    """Cria e retorna uma conexão com o banco SQLite com Row habilitado."""
    conn = sqlite3.connect(str(settings.DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_database() -> None:
    """Cria as tabelas necessárias caso não existam."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS consultation_bookings (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL CHECK(length(full_name) BETWEEN 2 AND 120),
        email TEXT NOT NULL CHECK(length(email) BETWEEN 5 AND 254 AND email LIKE '%_@_%.__%'),
        phone TEXT NOT NULL CHECK(length(phone) BETWEEN 8 AND 30),
        objective TEXT NOT NULL CHECK(length(objective) BETWEEN 5 AND 1000),
        investor_profile TEXT CHECK(investor_profile IN ('conservative', 'moderate', 'aggressive')),
        preferred_date TEXT NOT NULL,
        preferred_period TEXT NOT NULL CHECK(preferred_period IN ('morning', 'afternoon', 'evening')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    """)
    conn.commit()
    conn.close()

