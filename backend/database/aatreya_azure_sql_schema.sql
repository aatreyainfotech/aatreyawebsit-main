/* =====================================================================
   Aatreya Infotech Systems LLP — CMS Database Schema
   Target: Microsoft Azure SQL Database  (SQL Server 2019+ compatible)
   Version: 1.0
   Created: 04 December 2025
   Author:  Aatreya Infotech Systems LLP
   ---------------------------------------------------------------------
   Notes:
     * All primary keys are UNIQUEIDENTIFIER (equivalent of Mongo _id / UUID).
     * Timestamps are DATETIME2(3) in UTC.
     * Bit flag "IsActive" controls visibility on the public website.
     * "SortOrder" controls the order of records on the public site.
     * Character sets: use CI/AS collation (default) or a UTF-8 collation
       (Azure SQL: `Latin1_General_100_CI_AS_SC_UTF8`) if you want to store
       Telugu / Devanagari characters directly. Uncomment CREATE DATABASE line.
   ===================================================================== */

-- OPTIONAL: create a new database (skip if you already have one)
-- CREATE DATABASE AatreyaCMS
-- COLLATE Latin1_General_100_CI_AS_SC_UTF8;
-- GO
-- USE AatreyaCMS;
-- GO

/* ============================ 1. Admin Users ========================= */
IF OBJECT_ID('dbo.AdminUsers', 'U') IS NOT NULL DROP TABLE dbo.AdminUsers;
GO
CREATE TABLE dbo.AdminUsers (
    Id              UNIQUEIDENTIFIER    NOT NULL CONSTRAINT DF_AdminUsers_Id DEFAULT NEWID(),
    Mobile          NVARCHAR(20)        NOT NULL,
    Name            NVARCHAR(120)       NOT NULL,
    Email           NVARCHAR(160)       NULL,
    Role            NVARCHAR(20)        NOT NULL CONSTRAINT DF_AdminUsers_Role DEFAULT 'admin',
    PasswordHash    NVARCHAR(255)       NOT NULL,
    IsActive        BIT                 NOT NULL CONSTRAINT DF_AdminUsers_IsActive DEFAULT 1,
    LastLoginAt     DATETIME2(3)        NULL,
    CreatedAt       DATETIME2(3)        NOT NULL CONSTRAINT DF_AdminUsers_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2(3)        NOT NULL CONSTRAINT DF_AdminUsers_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AdminUsers PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_AdminUsers_Mobile UNIQUE (Mobile),
    CONSTRAINT CK_AdminUsers_Role CHECK (Role IN ('admin', 'editor', 'manager', 'viewer'))
);
GO


/* ============================ 2. Hero Slides ========================= */
IF OBJECT_ID('dbo.HeroSlides', 'U') IS NOT NULL DROP TABLE dbo.HeroSlides;
GO
CREATE TABLE dbo.HeroSlides (
    Id               UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_HeroSlides_Id DEFAULT NEWID(),
    Heading          NVARCHAR(240)      NOT NULL,
    Subheading       NVARCHAR(240)      NULL,
    Description      NVARCHAR(1000)     NULL,
    ButtonText       NVARCHAR(80)       NULL,
    ButtonLink       NVARCHAR(500)      NULL,
    BackgroundImage  NVARCHAR(500)      NULL,
    Video            NVARCHAR(500)      NULL,
    SortOrder        INT                NOT NULL CONSTRAINT DF_HeroSlides_SortOrder DEFAULT 0,
    IsActive         BIT                NOT NULL CONSTRAINT DF_HeroSlides_IsActive DEFAULT 1,
    CreatedAt        DATETIME2(3)       NOT NULL CONSTRAINT DF_HeroSlides_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt        DATETIME2(3)       NOT NULL CONSTRAINT DF_HeroSlides_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_HeroSlides PRIMARY KEY CLUSTERED (Id)
);
CREATE INDEX IX_HeroSlides_Order ON dbo.HeroSlides (IsActive, SortOrder);
GO


/* ============================ 3. Services ============================ */
IF OBJECT_ID('dbo.Services', 'U') IS NOT NULL DROP TABLE dbo.Services;
GO
CREATE TABLE dbo.Services (
    Id                UNIQUEIDENTIFIER  NOT NULL CONSTRAINT DF_Services_Id DEFAULT NEWID(),
    Title             NVARCHAR(200)     NOT NULL,
    Slug              NVARCHAR(200)     NULL,
    Icon              NVARCHAR(80)      NULL,       -- Lucide icon name (e.g. QrCode)
    Image             NVARCHAR(500)     NULL,
    Description       NVARCHAR(MAX)     NOT NULL,
    Features          NVARCHAR(MAX)     NULL,       -- JSON array of strings
    ButtonText        NVARCHAR(80)      NULL,
    ButtonLink        NVARCHAR(500)     NULL,
    SeoTitle          NVARCHAR(160)     NULL,
    SeoDescription    NVARCHAR(320)     NULL,
    SortOrder         INT               NOT NULL CONSTRAINT DF_Services_SortOrder DEFAULT 0,
    IsActive          BIT               NOT NULL CONSTRAINT DF_Services_IsActive DEFAULT 1,
    CreatedAt         DATETIME2(3)      NOT NULL CONSTRAINT DF_Services_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt         DATETIME2(3)      NOT NULL CONSTRAINT DF_Services_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Services PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_Services_Slug UNIQUE (Slug),
    CONSTRAINT CK_Services_Features CHECK (Features IS NULL OR ISJSON(Features) = 1)
);
CREATE INDEX IX_Services_Order ON dbo.Services (IsActive, SortOrder);
GO


/* ============================ 4. Projects ============================ */
IF OBJECT_ID('dbo.Projects', 'U') IS NOT NULL DROP TABLE dbo.Projects;
GO
CREATE TABLE dbo.Projects (
    Id             UNIQUEIDENTIFIER  NOT NULL CONSTRAINT DF_Projects_Id DEFAULT NEWID(),
    Name           NVARCHAR(240)     NOT NULL,
    Slug           NVARCHAR(240)     NULL,
    Temple         NVARCHAR(240)     NULL,
    District       NVARCHAR(120)     NULL,
    [State]        NVARCHAR(120)     NULL,
    Location       NVARCHAR(240)     NULL,
    Logo           NVARCHAR(500)     NULL,
    CoverImage     NVARCHAR(500)     NULL,
    Gallery        NVARCHAR(MAX)     NULL,        -- JSON array of image URLs
    WorkOrder      NVARCHAR(240)     NULL,
    [Status]       NVARCHAR(240)     NULL,
    Technologies   NVARCHAR(MAX)     NULL,        -- JSON array
    Features       NVARCHAR(MAX)     NULL,        -- JSON array
    [Description]  NVARCHAR(MAX)     NULL,
    Category       NVARCHAR(20)      NOT NULL CONSTRAINT DF_Projects_Category DEFAULT 'temple',
    IsSpecial      BIT               NOT NULL CONSTRAINT DF_Projects_IsSpecial DEFAULT 0,
    ProjectDate    DATE              NULL,
    Video          NVARCHAR(500)     NULL,
    Pdf            NVARCHAR(500)     NULL,
    SortOrder      INT               NOT NULL CONSTRAINT DF_Projects_SortOrder DEFAULT 0,
    IsActive       BIT               NOT NULL CONSTRAINT DF_Projects_IsActive DEFAULT 1,
    CreatedAt      DATETIME2(3)      NOT NULL CONSTRAINT DF_Projects_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2(3)      NOT NULL CONSTRAINT DF_Projects_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Projects PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_Projects_Slug UNIQUE (Slug),
    CONSTRAINT CK_Projects_Category CHECK (Category IN ('temple', 'government', 'private', 'corporate')),
    CONSTRAINT CK_Projects_Gallery CHECK (Gallery IS NULL OR ISJSON(Gallery) = 1),
    CONSTRAINT CK_Projects_Technologies CHECK (Technologies IS NULL OR ISJSON(Technologies) = 1),
    CONSTRAINT CK_Projects_Features CHECK (Features IS NULL OR ISJSON(Features) = 1)
);
CREATE INDEX IX_Projects_Order ON dbo.Projects (IsActive, SortOrder);
CREATE INDEX IX_Projects_Category ON dbo.Projects (Category, IsActive);
GO


/* ============================ 5. Products ============================ */
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
GO
CREATE TABLE dbo.Products (
    Id             UNIQUEIDENTIFIER  NOT NULL CONSTRAINT DF_Products_Id DEFAULT NEWID(),
    Name           NVARCHAR(200)     NOT NULL,
    Slug           NVARCHAR(200)     NULL,
    Tagline        NVARCHAR(300)     NULL,
    [Description]  NVARCHAR(MAX)     NULL,
    Logo           NVARCHAR(500)     NULL,
    Banner         NVARCHAR(500)     NULL,
    Screenshots    NVARCHAR(MAX)     NULL,        -- JSON array
    Features       NVARCHAR(MAX)     NULL,        -- JSON array
    Modules        NVARCHAR(MAX)     NULL,        -- JSON array
    PlayStore      NVARCHAR(500)     NULL,
    AppStore       NVARCHAR(500)     NULL,
    DownloadUrl    NVARCHAR(500)     NULL,
    Faq            NVARCHAR(MAX)     NULL,        -- JSON array of { q, a }
    SortOrder      INT               NOT NULL CONSTRAINT DF_Products_SortOrder DEFAULT 0,
    IsActive       BIT               NOT NULL CONSTRAINT DF_Products_IsActive DEFAULT 1,
    CreatedAt      DATETIME2(3)      NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2(3)      NOT NULL CONSTRAINT DF_Products_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Products PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_Products_Slug UNIQUE (Slug),
    CONSTRAINT CK_Products_Screenshots CHECK (Screenshots IS NULL OR ISJSON(Screenshots) = 1),
    CONSTRAINT CK_Products_Features CHECK (Features IS NULL OR ISJSON(Features) = 1),
    CONSTRAINT CK_Products_Modules CHECK (Modules IS NULL OR ISJSON(Modules) = 1),
    CONSTRAINT CK_Products_Faq CHECK (Faq IS NULL OR ISJSON(Faq) = 1)
);
CREATE INDEX IX_Products_Order ON dbo.Products (IsActive, SortOrder);
GO


/* ============================ 6. Testimonials ======================== */
IF OBJECT_ID('dbo.Testimonials', 'U') IS NOT NULL DROP TABLE dbo.Testimonials;
GO
CREATE TABLE dbo.Testimonials (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_Testimonials_Id DEFAULT NEWID(),
    Temple        NVARCHAR(240)      NOT NULL,
    OfficerName   NVARCHAR(160)      NOT NULL,
    Designation   NVARCHAR(160)      NULL,
    Photo         NVARCHAR(500)      NULL,
    Review        NVARCHAR(MAX)      NOT NULL,
    Rating        TINYINT            NOT NULL CONSTRAINT DF_Testimonials_Rating DEFAULT 5,
    SortOrder     INT                NOT NULL CONSTRAINT DF_Testimonials_SortOrder DEFAULT 0,
    IsActive      BIT                NOT NULL CONSTRAINT DF_Testimonials_IsActive DEFAULT 1,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_Testimonials_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_Testimonials_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Testimonials PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT CK_Testimonials_Rating CHECK (Rating BETWEEN 1 AND 5)
);
CREATE INDEX IX_Testimonials_Order ON dbo.Testimonials (IsActive, SortOrder);
GO


/* ============================ 7. News & Blog ========================= */
IF OBJECT_ID('dbo.NewsPosts', 'U') IS NOT NULL DROP TABLE dbo.NewsPosts;
GO
CREATE TABLE dbo.NewsPosts (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_NewsPosts_Id DEFAULT NEWID(),
    Title         NVARCHAR(300)      NOT NULL,
    Slug          NVARCHAR(300)      NULL,
    Category      NVARCHAR(30)       NOT NULL CONSTRAINT DF_NewsPosts_Category DEFAULT 'news',
    CoverImage    NVARCHAR(500)      NULL,
    Excerpt       NVARCHAR(800)      NULL,
    [Content]     NVARCHAR(MAX)      NULL,
    Tags          NVARCHAR(MAX)      NULL,        -- JSON array
    Author        NVARCHAR(160)      NULL,
    Views         INT                NOT NULL CONSTRAINT DF_NewsPosts_Views DEFAULT 0,
    PublishedAt   DATETIME2(3)       NULL,
    IsActive      BIT                NOT NULL CONSTRAINT DF_NewsPosts_IsActive DEFAULT 1,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_NewsPosts_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_NewsPosts_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_NewsPosts PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_NewsPosts_Slug UNIQUE (Slug),
    CONSTRAINT CK_NewsPosts_Category CHECK (Category IN ('news', 'blog', 'announcement', 'press-release')),
    CONSTRAINT CK_NewsPosts_Tags CHECK (Tags IS NULL OR ISJSON(Tags) = 1)
);
CREATE INDEX IX_NewsPosts_Published ON dbo.NewsPosts (IsActive, PublishedAt DESC);
CREATE INDEX IX_NewsPosts_Category ON dbo.NewsPosts (Category, IsActive);
GO


/* ============================ 8. Clients ============================= */
IF OBJECT_ID('dbo.Clients', 'U') IS NOT NULL DROP TABLE dbo.Clients;
GO
CREATE TABLE dbo.Clients (
    Id          UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_Clients_Id DEFAULT NEWID(),
    Name        NVARCHAR(240)      NOT NULL,
    Logo        NVARCHAR(500)      NULL,
    Category    NVARCHAR(20)       NOT NULL CONSTRAINT DF_Clients_Category DEFAULT 'temple',
    Website     NVARCHAR(500)      NULL,
    SortOrder   INT                NOT NULL CONSTRAINT DF_Clients_SortOrder DEFAULT 0,
    IsActive    BIT                NOT NULL CONSTRAINT DF_Clients_IsActive DEFAULT 1,
    CreatedAt   DATETIME2(3)       NOT NULL CONSTRAINT DF_Clients_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Clients PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT CK_Clients_Category CHECK (Category IN ('temple', 'government', 'private', 'corporate'))
);
CREATE INDEX IX_Clients_Order ON dbo.Clients (IsActive, SortOrder);
GO


/* ============================ 9. Statistics ========================== */
IF OBJECT_ID('dbo.Statistics', 'U') IS NOT NULL DROP TABLE dbo.[Statistics];
GO
CREATE TABLE dbo.[Statistics] (
    Id          UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_Statistics_Id DEFAULT NEWID(),
    [Label]     NVARCHAR(200)      NOT NULL,
    [Value]     NVARCHAR(80)       NOT NULL,
    SortOrder   INT                NOT NULL CONSTRAINT DF_Statistics_SortOrder DEFAULT 0,
    IsActive    BIT                NOT NULL CONSTRAINT DF_Statistics_IsActive DEFAULT 1,
    CONSTRAINT PK_Statistics PRIMARY KEY CLUSTERED (Id)
);
GO


/* =========================== 10. Contact Submissions ================= */
IF OBJECT_ID('dbo.ContactSubmissions', 'U') IS NOT NULL DROP TABLE dbo.ContactSubmissions;
GO
CREATE TABLE dbo.ContactSubmissions (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_ContactSubmissions_Id DEFAULT NEWID(),
    Name          NVARCHAR(160)      NOT NULL,
    Email         NVARCHAR(200)      NOT NULL,
    Phone         NVARCHAR(40)       NULL,
    Organization  NVARCHAR(240)      NULL,
    Subject       NVARCHAR(240)      NULL,
    [Message]     NVARCHAR(MAX)      NOT NULL,
    IpAddress     NVARCHAR(64)       NULL,
    UserAgent     NVARCHAR(500)      NULL,
    EmailSent     BIT                NOT NULL CONSTRAINT DF_ContactSubmissions_EmailSent DEFAULT 0,
    [Read]        BIT                NOT NULL CONSTRAINT DF_ContactSubmissions_Read DEFAULT 0,
    Replied       BIT                NOT NULL CONSTRAINT DF_ContactSubmissions_Replied DEFAULT 0,
    RepliedBy     UNIQUEIDENTIFIER   NULL,
    RepliedAt     DATETIME2(3)       NULL,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_ContactSubmissions_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_ContactSubmissions PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_ContactSubmissions_RepliedBy FOREIGN KEY (RepliedBy) REFERENCES dbo.AdminUsers(Id) ON DELETE SET NULL
);
CREATE INDEX IX_ContactSubmissions_Created ON dbo.ContactSubmissions (CreatedAt DESC);
CREATE INDEX IX_ContactSubmissions_Read ON dbo.ContactSubmissions ([Read], CreatedAt DESC);
GO


/* =========================== 11. Site Settings (singleton) =========== */
IF OBJECT_ID('dbo.SiteSettings', 'U') IS NOT NULL DROP TABLE dbo.SiteSettings;
GO
CREATE TABLE dbo.SiteSettings (
    Id                UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_SiteSettings_Id DEFAULT NEWID(),
    [Key]             NVARCHAR(40)       NOT NULL CONSTRAINT DF_SiteSettings_Key DEFAULT 'site-settings',
    SiteTitle         NVARCHAR(240)      NULL,
    Logo              NVARCHAR(500)      NULL,
    Favicon           NVARCHAR(500)      NULL,
    FooterText        NVARCHAR(MAX)      NULL,
    ContactPhone      NVARCHAR(40)       NULL,
    ContactEmail      NVARCHAR(200)      NULL,
    ContactAddress    NVARCHAR(500)      NULL,
    SocialLinks       NVARCHAR(MAX)      NULL,       -- JSON object
    SeoTitle          NVARCHAR(240)      NULL,
    SeoDescription    NVARCHAR(500)      NULL,
    SeoKeywords       NVARCHAR(500)      NULL,
    OgImage           NVARCHAR(500)      NULL,
    GoogleAnalyticsId NVARCHAR(80)       NULL,
    MetaPixelId       NVARCHAR(80)       NULL,
    SmtpJson          NVARCHAR(MAX)      NULL,       -- JSON object for SMTP config
    UpdatedAt         DATETIME2(3)       NOT NULL CONSTRAINT DF_SiteSettings_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_SiteSettings PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_SiteSettings_Key UNIQUE ([Key]),
    CONSTRAINT CK_SiteSettings_SocialLinks CHECK (SocialLinks IS NULL OR ISJSON(SocialLinks) = 1),
    CONSTRAINT CK_SiteSettings_SmtpJson CHECK (SmtpJson IS NULL OR ISJSON(SmtpJson) = 1)
);
GO


/* =========================== 12. Uploads ============================= */
IF OBJECT_ID('dbo.Uploads', 'U') IS NOT NULL DROP TABLE dbo.Uploads;
GO
CREATE TABLE dbo.Uploads (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_Uploads_Id DEFAULT NEWID(),
    Filename      NVARCHAR(240)      NOT NULL,
    OriginalName  NVARCHAR(240)      NULL,
    MimeType      NVARCHAR(120)      NULL,
    SizeBytes     BIGINT             NULL,
    Url           NVARCHAR(500)      NOT NULL,
    UploadedBy    UNIQUEIDENTIFIER   NULL,
    UploadedAt    DATETIME2(3)       NOT NULL CONSTRAINT DF_Uploads_UploadedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Uploads PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_Uploads_UploadedBy FOREIGN KEY (UploadedBy) REFERENCES dbo.AdminUsers(Id) ON DELETE SET NULL
);
CREATE INDEX IX_Uploads_UploadedAt ON dbo.Uploads (UploadedAt DESC);
GO


/* =========================== 13. Careers ============================= */
IF OBJECT_ID('dbo.JobOpenings', 'U') IS NOT NULL DROP TABLE dbo.JobOpenings;
GO
CREATE TABLE dbo.JobOpenings (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_JobOpenings_Id DEFAULT NEWID(),
    Title         NVARCHAR(240)      NOT NULL,
    Department    NVARCHAR(120)      NULL,
    Location      NVARCHAR(240)      NULL,
    EmploymentType NVARCHAR(40)      NULL,           -- Full-time / Part-time / Contract
    Experience    NVARCHAR(80)       NULL,
    Salary        NVARCHAR(120)      NULL,
    [Description] NVARCHAR(MAX)      NULL,
    SkillsJson    NVARCHAR(MAX)      NULL,           -- JSON array
    SortOrder     INT                NOT NULL CONSTRAINT DF_JobOpenings_SortOrder DEFAULT 0,
    IsActive      BIT                NOT NULL CONSTRAINT DF_JobOpenings_IsActive DEFAULT 1,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_JobOpenings_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_JobOpenings_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_JobOpenings PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT CK_JobOpenings_Skills CHECK (SkillsJson IS NULL OR ISJSON(SkillsJson) = 1)
);
GO

IF OBJECT_ID('dbo.JobApplications', 'U') IS NOT NULL DROP TABLE dbo.JobApplications;
GO
CREATE TABLE dbo.JobApplications (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_JobApplications_Id DEFAULT NEWID(),
    JobId         UNIQUEIDENTIFIER   NULL,
    FullName      NVARCHAR(160)      NOT NULL,
    Email         NVARCHAR(200)      NOT NULL,
    Phone         NVARCHAR(40)       NULL,
    CoverLetter   NVARCHAR(MAX)      NULL,
    ResumeUrl     NVARCHAR(500)      NULL,
    [Status]      NVARCHAR(40)       NOT NULL CONSTRAINT DF_JobApplications_Status DEFAULT 'new',
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_JobApplications_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_JobApplications PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_JobApplications_JobId FOREIGN KEY (JobId) REFERENCES dbo.JobOpenings(Id) ON DELETE SET NULL,
    CONSTRAINT CK_JobApplications_Status CHECK ([Status] IN ('new', 'reviewing', 'shortlisted', 'rejected', 'hired'))
);
CREATE INDEX IX_JobApplications_Job ON dbo.JobApplications (JobId, CreatedAt DESC);
GO


/* =========================== 14. Downloads =========================== */
IF OBJECT_ID('dbo.Downloads', 'U') IS NOT NULL DROP TABLE dbo.Downloads;
GO
CREATE TABLE dbo.Downloads (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_Downloads_Id DEFAULT NEWID(),
    Title         NVARCHAR(240)      NOT NULL,
    Category      NVARCHAR(60)       NULL,          -- brochure, presentation, apk, manual, profile
    [Description] NVARCHAR(1000)     NULL,
    FileUrl       NVARCHAR(500)      NOT NULL,
    ThumbnailUrl  NVARCHAR(500)      NULL,
    FileSize      BIGINT             NULL,
    Downloads     INT                NOT NULL CONSTRAINT DF_Downloads_Downloads DEFAULT 0,
    SortOrder     INT                NOT NULL CONSTRAINT DF_Downloads_SortOrder DEFAULT 0,
    IsActive      BIT                NOT NULL CONSTRAINT DF_Downloads_IsActive DEFAULT 1,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_Downloads_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Downloads PRIMARY KEY CLUSTERED (Id)
);
GO


/* =========================== 15. Gallery ============================= */
IF OBJECT_ID('dbo.GalleryAlbums', 'U') IS NOT NULL DROP TABLE dbo.GalleryAlbums;
GO
CREATE TABLE dbo.GalleryAlbums (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_GalleryAlbums_Id DEFAULT NEWID(),
    Title         NVARCHAR(240)      NOT NULL,
    Slug          NVARCHAR(240)      NULL,
    [Description] NVARCHAR(1000)     NULL,
    CoverImage    NVARCHAR(500)      NULL,
    SortOrder     INT                NOT NULL CONSTRAINT DF_GalleryAlbums_SortOrder DEFAULT 0,
    IsActive      BIT                NOT NULL CONSTRAINT DF_GalleryAlbums_IsActive DEFAULT 1,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_GalleryAlbums_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_GalleryAlbums PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_GalleryAlbums_Slug UNIQUE (Slug)
);
GO

IF OBJECT_ID('dbo.GalleryItems', 'U') IS NOT NULL DROP TABLE dbo.GalleryItems;
GO
CREATE TABLE dbo.GalleryItems (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_GalleryItems_Id DEFAULT NEWID(),
    AlbumId       UNIQUEIDENTIFIER   NOT NULL,
    MediaType     NVARCHAR(20)       NOT NULL CONSTRAINT DF_GalleryItems_MediaType DEFAULT 'image',
    Url           NVARCHAR(500)      NOT NULL,
    Caption       NVARCHAR(240)      NULL,
    SortOrder     INT                NOT NULL CONSTRAINT DF_GalleryItems_SortOrder DEFAULT 0,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_GalleryItems_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_GalleryItems PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_GalleryItems_AlbumId FOREIGN KEY (AlbumId) REFERENCES dbo.GalleryAlbums(Id) ON DELETE CASCADE,
    CONSTRAINT CK_GalleryItems_MediaType CHECK (MediaType IN ('image', 'video'))
);
CREATE INDEX IX_GalleryItems_Album ON dbo.GalleryItems (AlbumId, SortOrder);
GO


/* =========================== 16. Timeline / Milestones =============== */
IF OBJECT_ID('dbo.Timeline', 'U') IS NOT NULL DROP TABLE dbo.Timeline;
GO
CREATE TABLE dbo.Timeline (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_Timeline_Id DEFAULT NEWID(),
    [Year]        NVARCHAR(20)       NOT NULL,      -- '2021', '2022' etc.
    Title         NVARCHAR(240)      NOT NULL,
    [Description] NVARCHAR(1000)     NULL,
    Icon          NVARCHAR(80)       NULL,
    SortOrder     INT                NOT NULL CONSTRAINT DF_Timeline_SortOrder DEFAULT 0,
    IsActive      BIT                NOT NULL CONSTRAINT DF_Timeline_IsActive DEFAULT 1,
    CONSTRAINT PK_Timeline PRIMARY KEY CLUSTERED (Id)
);
GO


/* =========================== 17. Leadership / Team =================== */
IF OBJECT_ID('dbo.Leadership', 'U') IS NOT NULL DROP TABLE dbo.Leadership;
GO
CREATE TABLE dbo.Leadership (
    Id            UNIQUEIDENTIFIER   NOT NULL CONSTRAINT DF_Leadership_Id DEFAULT NEWID(),
    Name          NVARCHAR(160)      NOT NULL,
    Designation   NVARCHAR(160)      NULL,
    Photo         NVARCHAR(500)      NULL,
    Profile       NVARCHAR(MAX)      NULL,
    SocialJson    NVARCHAR(MAX)      NULL,          -- JSON object { linkedin, twitter, ... }
    SortOrder     INT                NOT NULL CONSTRAINT DF_Leadership_SortOrder DEFAULT 0,
    IsActive      BIT                NOT NULL CONSTRAINT DF_Leadership_IsActive DEFAULT 1,
    CreatedAt     DATETIME2(3)       NOT NULL CONSTRAINT DF_Leadership_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_Leadership PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT CK_Leadership_Social CHECK (SocialJson IS NULL OR ISJSON(SocialJson) = 1)
);
GO


/* =========================== 18. Audit Logs ========================== */
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NOT NULL DROP TABLE dbo.AuditLogs;
GO
CREATE TABLE dbo.AuditLogs (
    Id           UNIQUEIDENTIFIER  NOT NULL CONSTRAINT DF_AuditLogs_Id DEFAULT NEWID(),
    UserId       UNIQUEIDENTIFIER  NULL,
    UserMobile   NVARCHAR(20)      NULL,
    [Action]     NVARCHAR(80)      NOT NULL,        -- e.g. 'projects.create'
    EntityType   NVARCHAR(80)      NULL,
    EntityId     NVARCHAR(80)      NULL,
    Payload      NVARCHAR(MAX)     NULL,            -- JSON
    IpAddress    NVARCHAR(64)      NULL,
    UserAgent    NVARCHAR(500)     NULL,
    CreatedAt    DATETIME2(3)      NOT NULL CONSTRAINT DF_AuditLogs_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AuditLogs PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_AuditLogs_UserId FOREIGN KEY (UserId) REFERENCES dbo.AdminUsers(Id) ON DELETE SET NULL,
    CONSTRAINT CK_AuditLogs_Payload CHECK (Payload IS NULL OR ISJSON(Payload) = 1)
);
CREATE INDEX IX_AuditLogs_CreatedAt ON dbo.AuditLogs (CreatedAt DESC);
CREATE INDEX IX_AuditLogs_Entity ON dbo.AuditLogs (EntityType, EntityId);
GO


/* =========================== 19. Login History ======================= */
IF OBJECT_ID('dbo.LoginHistory', 'U') IS NOT NULL DROP TABLE dbo.LoginHistory;
GO
CREATE TABLE dbo.LoginHistory (
    Id           UNIQUEIDENTIFIER  NOT NULL CONSTRAINT DF_LoginHistory_Id DEFAULT NEWID(),
    UserId       UNIQUEIDENTIFIER  NULL,
    Mobile       NVARCHAR(20)      NOT NULL,
    Success      BIT               NOT NULL,
    IpAddress    NVARCHAR(64)      NULL,
    UserAgent    NVARCHAR(500)     NULL,
    CreatedAt    DATETIME2(3)      NOT NULL CONSTRAINT DF_LoginHistory_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_LoginHistory PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT FK_LoginHistory_UserId FOREIGN KEY (UserId) REFERENCES dbo.AdminUsers(Id) ON DELETE SET NULL
);
CREATE INDEX IX_LoginHistory_Mobile ON dbo.LoginHistory (Mobile, CreatedAt DESC);
GO


/* =========================== 20. Newsletter Subscribers ============== */
IF OBJECT_ID('dbo.NewsletterSubscribers', 'U') IS NOT NULL DROP TABLE dbo.NewsletterSubscribers;
GO
CREATE TABLE dbo.NewsletterSubscribers (
    Id           UNIQUEIDENTIFIER  NOT NULL CONSTRAINT DF_NewsletterSubscribers_Id DEFAULT NEWID(),
    Email        NVARCHAR(200)     NOT NULL,
    Name         NVARCHAR(120)     NULL,
    IsActive     BIT               NOT NULL CONSTRAINT DF_NewsletterSubscribers_IsActive DEFAULT 1,
    CreatedAt    DATETIME2(3)      NOT NULL CONSTRAINT DF_NewsletterSubscribers_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_NewsletterSubscribers PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_NewsletterSubscribers_Email UNIQUE (Email)
);
GO


/* =========================== 21. Website Analytics (aggregated) ====== */
IF OBJECT_ID('dbo.AnalyticsDaily', 'U') IS NOT NULL DROP TABLE dbo.AnalyticsDaily;
GO
CREATE TABLE dbo.AnalyticsDaily (
    Id             UNIQUEIDENTIFIER NOT NULL CONSTRAINT DF_AnalyticsDaily_Id DEFAULT NEWID(),
    [Date]         DATE             NOT NULL,
    Visitors       INT              NOT NULL CONSTRAINT DF_AnalyticsDaily_Visitors DEFAULT 0,
    PageViews      INT              NOT NULL CONSTRAINT DF_AnalyticsDaily_PageViews DEFAULT 0,
    Enquiries      INT              NOT NULL CONSTRAINT DF_AnalyticsDaily_Enquiries DEFAULT 0,
    CONSTRAINT PK_AnalyticsDaily PRIMARY KEY CLUSTERED (Id),
    CONSTRAINT UQ_AnalyticsDaily_Date UNIQUE ([Date])
);
GO


/* ===============================================================
   SEED DATA — initial admin, statistics, hero, and starter content
   =============================================================== */

-- Admin (change password after first login!)
IF NOT EXISTS (SELECT 1 FROM dbo.AdminUsers WHERE Mobile = '8644297366')
INSERT INTO dbo.AdminUsers (Mobile, Name, Email, Role, PasswordHash)
VALUES ('8644297366', 'Aatreya Admin', 'info@aatreya.co.in', 'admin',
        '$2b$12$REPLACE_WITH_BCRYPT_HASH_OF_YOUR_PASSWORD');
GO

-- Site Settings singleton
IF NOT EXISTS (SELECT 1 FROM dbo.SiteSettings WHERE [Key] = 'site-settings')
INSERT INTO dbo.SiteSettings ([Key], SiteTitle, ContactPhone, ContactEmail, ContactAddress, SeoTitle, SeoDescription)
VALUES (
    'site-settings',
    'Aatreya Infotech Systems LLP',
    '+91 86442 97366',
    'info@aatreya.co.in',
    'D. No. 2-105, Edlapalli, Tenali – 522211, Andhra Pradesh, India',
    'Aatreya Infotech Systems LLP — Digital Transformation Partner for Temples',
    'Government-registered Indian startup delivering enterprise digital solutions for temples, religious institutions, and public sector projects.'
);
GO

-- Statistics
INSERT INTO dbo.[Statistics] ([Label], [Value], SortOrder) VALUES
('Clients', '100+', 1),
('Temple Projects', '50+', 2),
('Uptime', '99.9%', 3),
('Support', '24×7', 4);
GO

-- Timeline
INSERT INTO dbo.Timeline ([Year], Title, [Description], SortOrder) VALUES
('2021', 'Company Started', 'Aatreya Infotech Systems LLP established, Government-registered under MSME.', 1),
('2022', 'First Temple Project', 'Dwaraka Tirumala — Free Annadanam Token System deployed.', 2),
('2023', 'Expansion', 'Indrakeeladri — Vastra Prasadam digitization live.', 3),
('2024', 'Cloud Platform', 'OmniCloud SaaS platform launched.', 4),
('2025', 'Government Projects', 'PM visit at Srisailam — Police Digital ID Pass System.', 5),
('2026', 'Temple ERP', 'Srisailam Brahmotsavam — full Temple ERP scale deployment.', 6);
GO

-- Sample Hero Slide
INSERT INTO dbo.HeroSlides (Heading, Subheading, Description, ButtonText, ButtonLink, BackgroundImage, SortOrder)
VALUES (
    'India''s Trusted Digital Transformation Partner for Temples',
    'Technology with Devotion. Innovation with Integrity.',
    'Building Smart Temple Ecosystems with Secure, Scalable & Innovative Technology.',
    'Explore Solutions',
    '/services',
    'https://images.pexels.com/photos/35322805/pexels-photo-35322805.jpeg',
    1
);
GO


/* ===============================================================
   USEFUL VIEWS
   =============================================================== */

CREATE OR ALTER VIEW dbo.vw_PublicProjects AS
SELECT Id, Name, Slug, Temple, District, [State], Location, Logo, CoverImage, Gallery,
       WorkOrder, [Status], Technologies, Features, [Description], Category, IsSpecial,
       ProjectDate, Video, SortOrder
FROM dbo.Projects
WHERE IsActive = 1;
GO

CREATE OR ALTER VIEW dbo.vw_PublicServices AS
SELECT Id, Title, Slug, Icon, Image, Description, Features, ButtonText, ButtonLink, SortOrder
FROM dbo.Services
WHERE IsActive = 1;
GO

CREATE OR ALTER VIEW dbo.vw_PublicHeroSlides AS
SELECT Id, Heading, Subheading, Description, ButtonText, ButtonLink,
       BackgroundImage, Video, SortOrder
FROM dbo.HeroSlides
WHERE IsActive = 1;
GO

CREATE OR ALTER VIEW dbo.vw_DashboardCounts AS
SELECT
    (SELECT COUNT(*) FROM dbo.Projects)                                    AS Projects,
    (SELECT COUNT(*) FROM dbo.Services)                                    AS Services,
    (SELECT COUNT(*) FROM dbo.Products)                                    AS Products,
    (SELECT COUNT(*) FROM dbo.Testimonials)                                AS Testimonials,
    (SELECT COUNT(*) FROM dbo.NewsPosts)                                   AS NewsPosts,
    (SELECT COUNT(*) FROM dbo.HeroSlides)                                  AS HeroSlides,
    (SELECT COUNT(*) FROM dbo.Clients)                                     AS Clients,
    (SELECT COUNT(*) FROM dbo.ContactSubmissions)                          AS ContactSubmissions,
    (SELECT COUNT(*) FROM dbo.ContactSubmissions WHERE [Read] = 0)         AS UnreadEnquiries;
GO


/* End of schema */
