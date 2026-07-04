"""
Build a SQLite .db file from the Azure SQL schema for local prototyping /
offline preview. SQLite is used because it can be shipped as a single .db
file. Once you're on Azure, run the T-SQL script (aatreya_azure_sql_schema.sql)
against your Azure SQL Database — the field names/types match.

Usage:
    python3 build_sqlite.py

Output: /app/backend/database/aatreya_cms.db
"""
import os
import sqlite3
import uuid
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "aatreya_cms.db")

if os.path.exists(DB_PATH):
    os.remove(DB_PATH)

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def new_id():
    return str(uuid.uuid4())

conn = sqlite3.connect(DB_PATH)
conn.execute("PRAGMA foreign_keys = ON;")
cur = conn.cursor()

# --- DDL (SQLite-compatible; mirrors Azure SQL schema) ---
SCHEMA = """
CREATE TABLE AdminUsers (
    Id TEXT PRIMARY KEY,
    Mobile TEXT NOT NULL UNIQUE,
    Name TEXT NOT NULL,
    Email TEXT,
    Role TEXT NOT NULL DEFAULT 'admin' CHECK(Role IN ('admin','editor','manager','viewer')),
    PasswordHash TEXT NOT NULL,
    IsActive INTEGER NOT NULL DEFAULT 1,
    LastLoginAt TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);

CREATE TABLE HeroSlides (
    Id TEXT PRIMARY KEY,
    Heading TEXT NOT NULL,
    Subheading TEXT,
    Description TEXT,
    ButtonText TEXT,
    ButtonLink TEXT,
    BackgroundImage TEXT,
    Video TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);
CREATE INDEX IX_HeroSlides_Order ON HeroSlides(IsActive, SortOrder);

CREATE TABLE Services (
    Id TEXT PRIMARY KEY,
    Title TEXT NOT NULL,
    Slug TEXT UNIQUE,
    Icon TEXT,
    Image TEXT,
    Description TEXT NOT NULL,
    Features TEXT,
    ButtonText TEXT,
    ButtonLink TEXT,
    SeoTitle TEXT,
    SeoDescription TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);
CREATE INDEX IX_Services_Order ON Services(IsActive, SortOrder);

CREATE TABLE Projects (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Slug TEXT UNIQUE,
    Temple TEXT,
    District TEXT,
    State TEXT,
    Location TEXT,
    Logo TEXT,
    CoverImage TEXT,
    Gallery TEXT,
    WorkOrder TEXT,
    Status TEXT,
    Technologies TEXT,
    Features TEXT,
    Description TEXT,
    Category TEXT NOT NULL DEFAULT 'temple' CHECK(Category IN ('temple','government','private','corporate')),
    IsSpecial INTEGER NOT NULL DEFAULT 0,
    ProjectDate TEXT,
    Video TEXT,
    Pdf TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);
CREATE INDEX IX_Projects_Order ON Projects(IsActive, SortOrder);
CREATE INDEX IX_Projects_Category ON Projects(Category, IsActive);

CREATE TABLE Products (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Slug TEXT UNIQUE,
    Tagline TEXT,
    Description TEXT,
    Logo TEXT,
    Banner TEXT,
    Screenshots TEXT,
    Features TEXT,
    Modules TEXT,
    PlayStore TEXT,
    AppStore TEXT,
    DownloadUrl TEXT,
    Faq TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);

CREATE TABLE Testimonials (
    Id TEXT PRIMARY KEY,
    Temple TEXT NOT NULL,
    OfficerName TEXT NOT NULL,
    Designation TEXT,
    Photo TEXT,
    Review TEXT NOT NULL,
    Rating INTEGER NOT NULL DEFAULT 5 CHECK(Rating BETWEEN 1 AND 5),
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);

CREATE TABLE NewsPosts (
    Id TEXT PRIMARY KEY,
    Title TEXT NOT NULL,
    Slug TEXT UNIQUE,
    Category TEXT NOT NULL DEFAULT 'news' CHECK(Category IN ('news','blog','announcement','press-release')),
    CoverImage TEXT,
    Excerpt TEXT,
    Content TEXT,
    Tags TEXT,
    Author TEXT,
    Views INTEGER NOT NULL DEFAULT 0,
    PublishedAt TEXT,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);

CREATE TABLE Clients (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Logo TEXT,
    Category TEXT NOT NULL DEFAULT 'temple' CHECK(Category IN ('temple','government','private','corporate')),
    Website TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE Statistics (
    Id TEXT PRIMARY KEY,
    Label TEXT NOT NULL,
    Value TEXT NOT NULL,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE ContactSubmissions (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL,
    Phone TEXT,
    Organization TEXT,
    Subject TEXT,
    Message TEXT NOT NULL,
    IpAddress TEXT,
    UserAgent TEXT,
    EmailSent INTEGER NOT NULL DEFAULT 0,
    IsRead INTEGER NOT NULL DEFAULT 0,
    Replied INTEGER NOT NULL DEFAULT 0,
    RepliedBy TEXT,
    RepliedAt TEXT,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (RepliedBy) REFERENCES AdminUsers(Id) ON DELETE SET NULL
);

CREATE TABLE SiteSettings (
    Id TEXT PRIMARY KEY,
    Key TEXT NOT NULL UNIQUE DEFAULT 'site-settings',
    SiteTitle TEXT,
    Logo TEXT,
    Favicon TEXT,
    FooterText TEXT,
    ContactPhone TEXT,
    ContactEmail TEXT,
    ContactAddress TEXT,
    SocialLinks TEXT,
    SeoTitle TEXT,
    SeoDescription TEXT,
    SeoKeywords TEXT,
    OgImage TEXT,
    GoogleAnalyticsId TEXT,
    MetaPixelId TEXT,
    SmtpJson TEXT,
    UpdatedAt TEXT NOT NULL
);

CREATE TABLE Uploads (
    Id TEXT PRIMARY KEY,
    Filename TEXT NOT NULL,
    OriginalName TEXT,
    MimeType TEXT,
    SizeBytes INTEGER,
    Url TEXT NOT NULL,
    UploadedBy TEXT,
    UploadedAt TEXT NOT NULL,
    FOREIGN KEY (UploadedBy) REFERENCES AdminUsers(Id) ON DELETE SET NULL
);

CREATE TABLE JobOpenings (
    Id TEXT PRIMARY KEY,
    Title TEXT NOT NULL,
    Department TEXT,
    Location TEXT,
    EmploymentType TEXT,
    Experience TEXT,
    Salary TEXT,
    Description TEXT,
    SkillsJson TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT NOT NULL
);

CREATE TABLE JobApplications (
    Id TEXT PRIMARY KEY,
    JobId TEXT,
    FullName TEXT NOT NULL,
    Email TEXT NOT NULL,
    Phone TEXT,
    CoverLetter TEXT,
    ResumeUrl TEXT,
    Status TEXT NOT NULL DEFAULT 'new' CHECK(Status IN ('new','reviewing','shortlisted','rejected','hired')),
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (JobId) REFERENCES JobOpenings(Id) ON DELETE SET NULL
);

CREATE TABLE Downloads (
    Id TEXT PRIMARY KEY,
    Title TEXT NOT NULL,
    Category TEXT,
    Description TEXT,
    FileUrl TEXT NOT NULL,
    ThumbnailUrl TEXT,
    FileSize INTEGER,
    Downloads INTEGER NOT NULL DEFAULT 0,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE GalleryAlbums (
    Id TEXT PRIMARY KEY,
    Title TEXT NOT NULL,
    Slug TEXT UNIQUE,
    Description TEXT,
    CoverImage TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE GalleryItems (
    Id TEXT PRIMARY KEY,
    AlbumId TEXT NOT NULL,
    MediaType TEXT NOT NULL DEFAULT 'image' CHECK(MediaType IN ('image','video')),
    Url TEXT NOT NULL,
    Caption TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (AlbumId) REFERENCES GalleryAlbums(Id) ON DELETE CASCADE
);

CREATE TABLE Timeline (
    Id TEXT PRIMARY KEY,
    Year TEXT NOT NULL,
    Title TEXT NOT NULL,
    Description TEXT,
    Icon TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE Leadership (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Designation TEXT,
    Photo TEXT,
    Profile TEXT,
    SocialJson TEXT,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE AuditLogs (
    Id TEXT PRIMARY KEY,
    UserId TEXT,
    UserMobile TEXT,
    Action TEXT NOT NULL,
    EntityType TEXT,
    EntityId TEXT,
    Payload TEXT,
    IpAddress TEXT,
    UserAgent TEXT,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES AdminUsers(Id) ON DELETE SET NULL
);

CREATE TABLE LoginHistory (
    Id TEXT PRIMARY KEY,
    UserId TEXT,
    Mobile TEXT NOT NULL,
    Success INTEGER NOT NULL,
    IpAddress TEXT,
    UserAgent TEXT,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES AdminUsers(Id) ON DELETE SET NULL
);

CREATE TABLE NewsletterSubscribers (
    Id TEXT PRIMARY KEY,
    Email TEXT NOT NULL UNIQUE,
    Name TEXT,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE AnalyticsDaily (
    Id TEXT PRIMARY KEY,
    Date TEXT NOT NULL UNIQUE,
    Visitors INTEGER NOT NULL DEFAULT 0,
    PageViews INTEGER NOT NULL DEFAULT 0,
    Enquiries INTEGER NOT NULL DEFAULT 0
);
"""

cur.executescript(SCHEMA)

# --- Seed data ---
t = now_iso()

# Admin user (password: Aatreya@2026 — bcrypt hash placeholder)
cur.execute("""
INSERT INTO AdminUsers (Id, Mobile, Name, Email, Role, PasswordHash, CreatedAt, UpdatedAt)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
(new_id(), "8644297366", "Aatreya Admin", "info@aatreya.co.in", "admin",
 "$2b$12$REPLACE_WITH_BCRYPT_HASH", t, t))

# Site settings
cur.execute("""
INSERT INTO SiteSettings (Id, Key, SiteTitle, ContactPhone, ContactEmail, ContactAddress, SeoTitle, SeoDescription, UpdatedAt)
VALUES (?, 'site-settings', ?, ?, ?, ?, ?, ?, ?)""",
(new_id(), "Aatreya Infotech Systems LLP", "+91 86442 97366", "info@aatreya.co.in",
 "D. No. 2-105, Edlapalli, Tenali – 522211, Andhra Pradesh, India",
 "Aatreya Infotech Systems LLP — Digital Transformation Partner for Temples",
 "Government-registered Indian startup delivering enterprise digital solutions for temples, religious institutions, and public sector projects.",
 t))

# Statistics
stats = [("Clients","100+",1),("Temple Projects","50+",2),("Uptime","99.9%",3),("Support","24×7",4)]
for lbl, val, so in stats:
    cur.execute("INSERT INTO Statistics (Id, Label, Value, SortOrder) VALUES (?,?,?,?)",
                (new_id(), lbl, val, so))

# Timeline
timeline = [
    ("2021","Company Started","Aatreya Infotech Systems LLP established, Government-registered under MSME.",1),
    ("2022","First Temple Project","Dwaraka Tirumala — Free Annadanam Token System deployed.",2),
    ("2023","Expansion","Indrakeeladri — Vastra Prasadam digitization live.",3),
    ("2024","Cloud Platform","OmniCloud SaaS platform launched.",4),
    ("2025","Government Projects","PM visit at Srisailam — Police Digital ID Pass System.",5),
    ("2026","Temple ERP","Srisailam Brahmotsavam — full Temple ERP scale deployment.",6),
]
for y, ti, ds, so in timeline:
    cur.execute("INSERT INTO Timeline (Id, Year, Title, Description, SortOrder) VALUES (?,?,?,?,?)",
                (new_id(), y, ti, ds, so))

# Hero slide
cur.execute("""
INSERT INTO HeroSlides (Id, Heading, Subheading, Description, ButtonText, ButtonLink, BackgroundImage, SortOrder, CreatedAt, UpdatedAt)
VALUES (?,?,?,?,?,?,?,?,?,?)""",
(new_id(),
 "India's Trusted Digital Transformation Partner for Temples",
 "Technology with Devotion. Innovation with Integrity.",
 "Building Smart Temple Ecosystems with Secure, Scalable & Innovative Technology.",
 "Explore Solutions", "/services",
 "https://images.pexels.com/photos/35322805/pexels-photo-35322805.jpeg",
 1, t, t))

# Sample projects
projects = [
    ("Sri Venkateswara Swamy Temple","Dwaraka Tirumala","Eluru District","Andhra Pradesh",
     "Dwaraka Tirumala, Eluru District","Work Order — REV65-ENGG0ELEC(EMIS)/3/2022-E2",
     "Successfully Running Since 2022",
     '["Free Annadanam Token System","Photo Capture Ticketing","Counter Management","Live Dashboard","Reporting System"]',
     "temple", 0, 1),
    ("Sri Bhramaramba Mallikarjuna Swamy Temple","Srisailam","Kurnool","Andhra Pradesh",
     "Srisailam","RC No: SBMSD-ADMNOENG/82/2025-SAD(SBMSD)",
     "Successfully Executed during 2025 & 2026 Brahmotsavam",
     '["Digital ID Pass System","Vehicle Pass","Darshan Pass","Mobile Application","QR Verification","Live Dashboard","Staff Management"]',
     "temple", 0, 3),
    ("Hon'ble Prime Minister Visit","Srisailam","Kurnool","Andhra Pradesh",
     "Srisailam","Government of India — Special Deployment",
     "Successfully Completed",
     '["Police Digital ID Pass System","QR Security Passes","Staff Management","Vehicle Pass Management","Digital Verification","Live Dashboard"]',
     "government", 1, 6),
]
for name, temple, district, state, loc, wo, status, features, cat, special, so in projects:
    cur.execute("""
        INSERT INTO Projects (Id, Name, Temple, District, State, Location, WorkOrder, Status, Features, Category, IsSpecial, SortOrder, CreatedAt, UpdatedAt)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (new_id(), name, temple, district, state, loc, wo, status, features, cat, special, so, t, t))

conn.commit()

# Report
cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in cur.fetchall()]
print(f"OK — Created {DB_PATH}")
print(f"Tables: {len(tables)}")
for tn in tables:
    cur.execute(f"SELECT COUNT(*) FROM {tn}")
    print(f"  {tn}: {cur.fetchone()[0]} rows")

conn.close()
