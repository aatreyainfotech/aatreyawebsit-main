"""
SQL Server data-access layer for the Aatreya CMS backend.

Replaces the previous MongoDB (motor) layer. Provides a small async-friendly
`Table` abstraction that maps between the Python snake_case field names used by
the API models and the PascalCase columns of the Azure SQL / SQL Server schema
(see database/aatreya_azure_sql_schema.sql).

pyodbc is synchronous, so blocking calls are executed in a worker thread via
`asyncio.to_thread` to keep the FastAPI endpoints non-blocking.
"""
from __future__ import annotations

import os
import re
import json
import asyncio
from datetime import datetime, date, timezone
from typing import Any, Dict, List, Optional

import pyodbc

# Fields that are stored as BIT in SQL and used as booleans in the API.
BOOL_FIELDS = {
    'is_active', 'is_special', 'read', 'email_sent', 'replied', 'success',
}

# Fields that are DATETIME2 in SQL and (de)serialised as ISO strings in the API.
DATETIME_FIELDS = {
    'created_at', 'updated_at', 'published_at', 'replied_at',
    'last_login_at', 'uploaded_at',
}

_PASCAL_BOUNDARY = re.compile(r'(?<!^)(?=[A-Z])')


def _snake_to_pascal(name: str) -> str:
    return ''.join(part.capitalize() for part in name.split('_'))


def _pascal_to_snake(name: str) -> str:
    return _PASCAL_BOUNDARY.sub('_', name).lower()


def build_conn_str() -> str:
    server = os.environ.get('DB_SERVER', 'localhost\\SQLEXPRESS')
    database = os.environ.get('DB_NAME', 'AatreyaCMS')
    user = os.environ.get('DB_USER')
    password = os.environ.get('DB_PASSWORD')
    driver = os.environ.get('DB_DRIVER', 'ODBC Driver 18 for SQL Server')
    encrypt = os.environ.get('DB_ENCRYPT', 'yes')
    trust_cert = os.environ.get('DB_TRUST_CERT', 'yes')

    parts = [
        f"DRIVER={{{driver}}}",
        f"SERVER={server}",
        f"DATABASE={database}",
        f"Encrypt={encrypt}",
        f"TrustServerCertificate={trust_cert}",
    ]
    if user:
        parts.append(f"UID={user}")
        parts.append(f"PWD={password}")
    else:
        parts.append("Trusted_Connection=yes")
    return ";".join(parts) + ";"


def _connect() -> pyodbc.Connection:
    return pyodbc.connect(build_conn_str(), autocommit=True)


def check_connection() -> None:
    """Raise if the database is unreachable."""
    conn = _connect()
    try:
        conn.cursor().execute("SELECT 1")
    finally:
        conn.close()


def execute_sql(sql: str, params: Optional[list] = None) -> None:
    """Execute a statement that returns no rows (DDL / migrations)."""
    conn = _connect()
    try:
        conn.cursor().execute(sql, params or [])
    finally:
        conn.close()


def _prep_value(value: Any) -> Any:
    if isinstance(value, (list, dict)):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, bool):
        return 1 if value else 0
    if isinstance(value, datetime):
        if value.tzinfo is not None:
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value
    return value


class Table:
    def __init__(self, table_name: str, json_fields: Optional[set] = None):
        self.table = table_name
        self._raw_name = table_name.strip('[]')
        self.json_fields = json_fields or set()
        self._columns: Optional[set] = None

    # -------- column introspection --------
    def _get_columns(self, cur) -> set:
        if self._columns is None:
            cur.execute(
                "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?",
                self._raw_name,
            )
            self._columns = {row[0] for row in cur.fetchall()}
        return self._columns

    def _valid_col(self, cols: set, field: str) -> Optional[str]:
        pascal = _snake_to_pascal(field)
        return pascal if pascal in cols else None

    # -------- row mapping --------
    def _row_to_dict(self, cursor, row) -> Dict[str, Any]:
        result: Dict[str, Any] = {}
        for column, value in zip([c[0] for c in cursor.description], row):
            field = _pascal_to_snake(column)
            if isinstance(value, datetime):
                value = value.isoformat()
            elif isinstance(value, date):
                value = value.isoformat()
            elif field in self.json_fields and isinstance(value, str):
                try:
                    value = json.loads(value)
                except (ValueError, TypeError):
                    pass
            elif field in BOOL_FIELDS and value is not None:
                value = bool(value)
            result[field] = value
        return result

    def _where_clause(self, cols: set, where: Optional[Dict[str, Any]]):
        if not where:
            return '', []
        clauses, params = [], []
        for key, value in where.items():
            col = self._valid_col(cols, key)
            if col is None:
                continue
            clauses.append(f"[{col}] = ?")
            params.append(_prep_value(value))
        if not clauses:
            return '', []
        return ' WHERE ' + ' AND '.join(clauses), params

    # -------- sync core --------
    def _find_sync(self, where=None, order_by=None, desc=False, limit=None):
        conn = _connect()
        try:
            cur = conn.cursor()
            cols = self._get_columns(cur)
            top = f"TOP ({int(limit)}) " if limit else ""
            sql = f"SELECT {top}* FROM {self.table}"
            clause, params = self._where_clause(cols, where)
            sql += clause
            order_col = self._valid_col(cols, order_by) if order_by else None
            if order_col:
                sql += f" ORDER BY [{order_col}] {'DESC' if desc else 'ASC'}"
            cur.execute(sql, params)
            rows = cur.fetchall()
            return [self._row_to_dict(cur, r) for r in rows]
        finally:
            conn.close()

    def _get_sync(self, where):
        rows = self._find_sync(where=where, limit=1)
        return rows[0] if rows else None

    def _insert_sync(self, doc: Dict[str, Any]):
        conn = _connect()
        try:
            cur = conn.cursor()
            cols = self._get_columns(cur)
            columns, placeholders, params = [], [], []
            for field, value in doc.items():
                col = self._valid_col(cols, field)
                if col is None:
                    continue
                columns.append(f"[{col}]")
                placeholders.append('?')
                params.append(_prep_value(value))
            sql = (
                f"INSERT INTO {self.table} ({', '.join(columns)}) "
                f"VALUES ({', '.join(placeholders)})"
            )
            cur.execute(sql, params)
            return doc
        finally:
            conn.close()

    def _update_sync(self, where: Dict[str, Any], patch: Dict[str, Any]) -> int:
        conn = _connect()
        try:
            cur = conn.cursor()
            cols = self._get_columns(cur)
            sets, params = [], []
            for field, value in patch.items():
                col = self._valid_col(cols, field)
                if col is None:
                    continue
                sets.append(f"[{col}] = ?")
                params.append(_prep_value(value))
            if not sets:
                return 0
            clause, where_params = self._where_clause(cols, where)
            sql = f"UPDATE {self.table} SET {', '.join(sets)}{clause}"
            cur.execute(sql, params + where_params)
            return cur.rowcount
        finally:
            conn.close()

    def _delete_sync(self, where: Dict[str, Any]) -> int:
        conn = _connect()
        try:
            cur = conn.cursor()
            cols = self._get_columns(cur)
            clause, params = self._where_clause(cols, where)
            sql = f"DELETE FROM {self.table}{clause}"
            cur.execute(sql, params)
            return cur.rowcount
        finally:
            conn.close()

    def _count_sync(self, where=None) -> int:
        conn = _connect()
        try:
            cur = conn.cursor()
            cols = self._get_columns(cur)
            clause, params = self._where_clause(cols, where)
            cur.execute(f"SELECT COUNT(*) FROM {self.table}{clause}", params)
            return int(cur.fetchone()[0])
        finally:
            conn.close()

    # -------- async wrappers --------
    async def find(self, where=None, order_by=None, desc=False, limit=None) -> List[dict]:
        return await asyncio.to_thread(self._find_sync, where, order_by, desc, limit)

    async def get(self, where: Dict[str, Any]) -> Optional[dict]:
        return await asyncio.to_thread(self._get_sync, where)

    async def insert(self, doc: Dict[str, Any]) -> dict:
        return await asyncio.to_thread(self._insert_sync, doc)

    async def update(self, where: Dict[str, Any], patch: Dict[str, Any]) -> int:
        return await asyncio.to_thread(self._update_sync, where, patch)

    async def upsert(self, where: Dict[str, Any], doc: Dict[str, Any]) -> int:
        matched = await self.update(where, doc)
        if matched == 0:
            await self.insert({**where, **doc})
            return 1
        return matched

    async def delete(self, where: Dict[str, Any]) -> int:
        return await asyncio.to_thread(self._delete_sync, where)

    async def count(self, where=None) -> int:
        return await asyncio.to_thread(self._count_sync, where)
