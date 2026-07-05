#!/usr/bin/env bash
# Azure App Service (Linux, Python) startup script.
# Installs the Microsoft ODBC Driver 18 (required by pyodbc) on each cold start,
# then launches the FastAPI app with Gunicorn + Uvicorn workers.
set -e

if ! ls /opt/microsoft/msodbcsql18 >/dev/null 2>&1; then
  echo "Installing Microsoft ODBC Driver 18 for SQL Server..."
  export DEBIAN_FRONTEND=noninteractive
  apt-get update -y
  apt-get install -y curl gnupg apt-transport-https ca-certificates

  # Detect Debian version of the App Service image (11 or 12)
  DEBIAN_VER=$(grep VERSION_ID /etc/os-release | cut -d '"' -f2)

  curl -sSL https://packages.microsoft.com/keys/microsoft.asc \
    | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
  curl -sSL "https://packages.microsoft.com/config/debian/${DEBIAN_VER}/prod.list" \
    | tee /etc/apt/sources.list.d/mssql-release.list >/dev/null

  apt-get update -y
  ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc
  echo "ODBC driver installed."
fi

echo "Starting Gunicorn..."
exec gunicorn server:app \
  --workers 2 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 600
