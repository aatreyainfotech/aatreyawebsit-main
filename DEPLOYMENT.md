# Aatreya — Azure Deployment Guide

Two resources:

| Part | Azure resource | URL |
|------|----------------|-----|
| Backend (FastAPI) | App Service (Linux, Python 3.11) | https://aatreyawebsit-main-dfdfbxcfahdddydv.centralindia-01.azurewebsites.net |
| Frontend (React) | Static Web App | https://zealous-sand-053b75500.7.azurestaticapps.net |
| Database | Azure SQL (`AatreyaCMS`) | feedbackserver2022.database.windows.net |
| Uploads | Azure Blob Storage | container: `uploads` |

Deploys happen automatically via GitHub Actions on push to `main`.

---

## 1. Azure SQL firewall
SQL Database → **feedbackserver2022** → **Networking / Set server firewall** →
enable **"Allow Azure services and resources to access this server"** → Save.

---

## 2. Storage Account (for uploads)
1. Create a Storage Account in resource group `feedback-rg` (e.g. `aatreyastorage`), region Central India.
2. After creation → **Access keys** → copy **Connection string**.
3. (The `uploads` container is created automatically by the backend on first run.)

Run the one-time migration of existing images (from this PC):
```powershell
cd "aatreyawebsit-main/backend"
# temporarily add AZURE_STORAGE_CONNECTION_STRING to backend/.env, then:
python database/migrate_uploads_to_blob.py
```

---

## 3. Backend App Service configuration
App Service **aatreyawebsit-main** → **Configuration**.

### General settings → Startup Command
```
bash /home/site/wwwroot/startup.sh
```

### Application settings (env vars) — add each:
| Name | Value |
|------|-------|
| `DB_SERVER` | `tcp:feedbackserver2022.database.windows.net,1433` |
| `DB_NAME` | `AatreyaCMS` |
| `DB_USER` | `Aatreyaadmin` |
| `DB_PASSWORD` | *(your SQL password)* |
| `DB_DRIVER` | `ODBC Driver 18 for SQL Server` |
| `DB_ENCRYPT` | `yes` |
| `DB_TRUST_CERT` | `yes` |
| `JWT_SECRET` | *(copy from backend/.env)* |
| `ADMIN_MOBILE` | `8644297366` |
| `ADMIN_NAME` | `Aatreya Admin` |
| `ADMIN_PASSWORD` | `Aatreya@2026` |
| `CORS_ORIGINS` | `https://zealous-sand-053b75500.7.azurestaticapps.net` |
| `AZURE_STORAGE_CONNECTION_STRING` | *(from Storage Account access keys)* |
| `AZURE_STORAGE_CONTAINER` | `uploads` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `WEBSITES_PORT` | `8000` |

Save (the app restarts).

---

## 4. GitHub secrets — already done automatically
Azure created these secrets for you when you set up CI/CD (no action needed):
- `AZUREAPPSERVICE_CLIENTID_...`, `AZUREAPPSERVICE_TENANTID_...`, `AZUREAPPSERVICE_SUBSCRIPTIONID_...` (backend, OIDC login)
- `AZURE_STATIC_WEB_APPS_API_TOKEN_ZEALOUS_SAND_053B75500` (frontend)

The workflows already reference these exact names. You do **not** need to add any secret manually.

---

## 5. Deploy
```powershell
git add .
git commit -m "Fix Azure deployment workflows + Blob uploads"
git push origin main
```
GitHub Actions runs both workflows. Watch progress in the repo's **Actions** tab.

---

## Notes
- Frontend build uses `REACT_APP_BACKEND_URL` set in the workflow (points at the App Service URL).
- Uploaded images now live in Blob Storage — they survive restarts/redeploys.
- The backend keeps working locally with disk uploads when `AZURE_STORAGE_CONNECTION_STRING` is unset.
