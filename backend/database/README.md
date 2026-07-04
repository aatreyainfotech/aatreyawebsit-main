# Aatreya CMS — Database Schema (Azure SQL + SQLite .db)

This folder contains the complete database schema for the Aatreya CMS, ready for **Microsoft Azure SQL Database** deployment.

## Files

| File | Purpose |
|---|---|
| `aatreya_azure_sql_schema.sql` | **Primary schema** — production-grade T-SQL for Azure SQL Database (SQL Server 2019+). Run this on your Azure SQL server. |
| `build_sqlite.py` | Python script that builds a portable `.db` file mirroring the same schema. |
| `aatreya_cms.db` | **SQLite database file** (generated). Open with any SQLite tool (DB Browser for SQLite, DBeaver, VS Code SQLite extension). |
| `README.md` | This file. |

## Tables (23 total)

### Core content (CMS-managed)
1. **AdminUsers** — mobile + bcrypt password, role (admin/editor/manager/viewer)
2. **HeroSlides** — homepage carousel (image/video/heading/CTA)
3. **Services** — enterprise service catalogue
4. **Projects** — temple/government/private portfolio (with work order, modules, gallery, category)
5. **Products** — product suite (screenshots, features, Play/App store links, FAQ)
6. **Testimonials** — officer name, designation, photo, review, rating
7. **NewsPosts** — news / blog / press-release / announcement
8. **Clients** — client logos by category
9. **Statistics** — homepage numbers
10. **Timeline** — company milestones by year
11. **Leadership** — team/leadership profiles

### Enquiries & communication
12. **ContactSubmissions** — public contact form entries with read/replied/replied-by tracking
13. **NewsletterSubscribers** — newsletter opt-ins

### Careers
14. **JobOpenings** — open positions
15. **JobApplications** — applications received (with resume URL and status)

### Assets & downloads
16. **Uploads** — file upload registry (image / PDF / APK)
17. **Downloads** — public downloads (brochures, presentations, manuals, APKs)
18. **GalleryAlbums** — media gallery grouping
19. **GalleryItems** — images / videos inside an album

### Governance & analytics
20. **SiteSettings** — single-row global settings (branding, SEO, GA, Meta Pixel, SMTP)
21. **AuditLogs** — admin activity log (who did what)
22. **LoginHistory** — successful & failed login attempts
23. **AnalyticsDaily** — daily aggregated visitors / page views / enquiries

## Conventions

- **Primary keys**: `UNIQUEIDENTIFIER` (Azure SQL) / `TEXT UUID` (SQLite). Matches the current MongoDB UUID `id` field so records are portable.
- **Timestamps**: `DATETIME2(3)` in UTC (Azure) / ISO 8601 string (SQLite).
- **JSON columns**: `NVARCHAR(MAX)` with `ISJSON()` CHECK constraints (Azure). Store list/object fields (features, modules, gallery, social links, SMTP config) as JSON.
- **Publishing flag**: every content table has `IsActive BIT` — set to 0 to hide from public site without deleting.
- **Ordering**: every content table has `SortOrder INT` for admin-controlled arrangement.
- **Enums**: enforced with `CHECK` constraints (e.g. `Category IN ('temple','government','private','corporate')`).

## Views included

- `vw_PublicProjects`, `vw_PublicServices`, `vw_PublicHeroSlides` — convenience views that filter `IsActive = 1`. Use these as the public API source.
- `vw_DashboardCounts` — single-row view for admin dashboard counts.

## How to deploy on Azure SQL

1. Provision an Azure SQL Database (Basic / Standard / General Purpose tier is fine to start).
2. Connect via Azure Data Studio / SSMS / `sqlcmd` with your admin credentials.
3. Optionally: `CREATE DATABASE AatreyaCMS COLLATE Latin1_General_100_CI_AS_SC_UTF8;` (uncomment inside the .sql).
4. Run the entire `aatreya_azure_sql_schema.sql` file.
5. **Update the admin password hash**: seed row uses a placeholder. Generate a bcrypt hash of your chosen password (e.g. via `bcrypt.hashpw`) and update the `AdminUsers` seed row before or after import.

## How to open the SQLite `.db`

- **VS Code**: install the "SQLite" extension, right-click `aatreya_cms.db` → Open Database.
- **DB Browser for SQLite** (free, GUI): https://sqlitebrowser.org — File → Open Database.
- **DBeaver / TablePlus**: point to the `.db` file with the SQLite driver.
- **Command line**: `sqlite3 aatreya_cms.db` then `.tables` / `.schema`.

## Migrating from MongoDB → Azure SQL later

The current live CMS uses MongoDB. Field names and types are aligned with this schema so migration is a straightforward ETL:

- Mongo `id` → SQL `Id` (UUID string, stored as `UNIQUEIDENTIFIER`)
- Mongo `created_at` / `updated_at` (ISO strings) → SQL `CreatedAt` / `UpdatedAt` (`DATETIME2`)
- Mongo array fields (`features`, `gallery`, `technologies`, `social_links`) → SQL JSON in `NVARCHAR(MAX)`
- Mongo boolean → SQL `BIT` (0/1)

You can run a one-time Python script that reads from MongoDB via Motor and inserts via `pyodbc` / `aioodbc` into Azure SQL, preserving IDs.
