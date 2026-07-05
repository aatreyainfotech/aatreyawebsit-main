"""
One-time migration: upload all files in backend/uploads/ to Azure Blob Storage.

Usage (PowerShell), after setting the connection string in backend/.env:
    cd backend
    python database/migrate_uploads_to_blob.py

Requires env vars (read from backend/.env):
    AZURE_STORAGE_CONNECTION_STRING   (required)
    AZURE_STORAGE_CONTAINER           (optional, default: uploads)
"""
import os
import mimetypes
from pathlib import Path

from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient, ContentSettings

ROOT_DIR = Path(__file__).resolve().parent.parent  # backend/
load_dotenv(ROOT_DIR / ".env")

conn = os.environ.get("AZURE_STORAGE_CONNECTION_STRING", "")
container_name = os.environ.get("AZURE_STORAGE_CONTAINER", "uploads")
uploads_dir = Path(os.environ.get("UPLOADS_DIR", str(ROOT_DIR / "uploads")))

if not conn:
    raise SystemExit("AZURE_STORAGE_CONNECTION_STRING is not set in backend/.env")

service = BlobServiceClient.from_connection_string(conn)
container = service.get_container_client(container_name)
try:
    container.create_container()
    print(f"Created container '{container_name}'.")
except Exception:
    print(f"Container '{container_name}' already exists.")

if not uploads_dir.exists():
    raise SystemExit(f"Uploads directory not found: {uploads_dir}")

files = [p for p in uploads_dir.iterdir() if p.is_file()]
print(f"Found {len(files)} file(s) to migrate from {uploads_dir}")

uploaded = 0
for path in files:
    content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    with path.open("rb") as f:
        container.upload_blob(
            path.name,
            f,
            overwrite=True,
            content_settings=ContentSettings(content_type=content_type),
        )
    uploaded += 1
    print(f"  uploaded {path.name}")

print(f"Done. Migrated {uploaded} file(s) to blob container '{container_name}'.")
