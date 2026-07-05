from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, UploadFile, File, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import asyncio
import secrets
import shutil
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Literal, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt as pyjwt
import resend

import sqldb


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# SQL Server tables (collection name -> Table)
admin_users = sqldb.Table('AdminUsers')
hero_slides_tbl = sqldb.Table('HeroSlides')
services_tbl = sqldb.Table('Services', json_fields={'features'})
projects_tbl = sqldb.Table('Projects', json_fields={'gallery', 'technologies', 'features'})
products_tbl = sqldb.Table('Products', json_fields={'screenshots', 'features', 'modules'})
testimonials_tbl = sqldb.Table('Testimonials')
news_tbl = sqldb.Table('NewsPosts', json_fields={'tags'})
clients_tbl = sqldb.Table('Clients')
recognitions_tbl = sqldb.Table('Recognitions')
statistics_tbl = sqldb.Table('[Statistics]')
contact_submissions = sqldb.Table('ContactSubmissions')
site_settings = sqldb.Table('SiteSettings', json_fields={'social_links'})

# Map the collection names used by the CRUD factory to Table instances.
TABLES: Dict[str, sqldb.Table] = {
    'hero_slides': hero_slides_tbl,
    'services': services_tbl,
    'projects': projects_tbl,
    'products': products_tbl,
    'testimonials': testimonials_tbl,
    'news': news_tbl,
    'clients': clients_tbl,
    'recognitions': recognitions_tbl,
    'statistics': statistics_tbl,
}

# Resend
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_TO_EMAIL = os.environ.get('CONTACT_TO_EMAIL', 'info@aatreya.co.in')
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Auth
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_ALG = 'HS256'
ACCESS_TOKEN_MINUTES = 60 * 24  # 1 day

# Uploads
UPLOADS_DIR = Path(os.environ.get('UPLOADS_DIR', str(ROOT_DIR / 'uploads')))
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Optional Azure Blob Storage for uploads (persists across App Service restarts/redeploys).
# When AZURE_STORAGE_CONNECTION_STRING is set, files are stored in Blob Storage instead
# of the local disk. The public URL scheme (/api/uploads/{name}) stays the same either way.
AZURE_STORAGE_CONNECTION_STRING = os.environ.get('AZURE_STORAGE_CONNECTION_STRING', '')
AZURE_STORAGE_CONTAINER = os.environ.get('AZURE_STORAGE_CONTAINER', 'uploads')
_blob_container = None
if AZURE_STORAGE_CONNECTION_STRING:
    from azure.storage.blob import BlobServiceClient, ContentSettings  # noqa: F401
    _blob_service = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
    _blob_container = _blob_service.get_container_client(AZURE_STORAGE_CONTAINER)
    try:
        _blob_container.create_container()
    except Exception:
        pass  # already exists

app = FastAPI(title="Aatreya Infotech Systems LLP API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ============ Helpers ============
def now_utc() -> datetime:
    return datetime.now(timezone.utc)

def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False

def create_access_token(user_id: str, mobile: str, role: str) -> str:
    payload = {
        'sub': user_id, 'mobile': mobile, 'role': role,
        'exp': now_utc() + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        'type': 'access',
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

async def get_current_admin(request: Request) -> dict:
    auth = request.headers.get('Authorization', '')
    token = None
    if auth.startswith('Bearer '):
        token = auth[7:]
    if not token:
        token = request.cookies.get('access_token')
    if not token:
        raise HTTPException(status_code=401, detail='Not authenticated')
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail='Invalid token')
    user = await admin_users.get({'id': payload.get('sub')})
    if not user:
        raise HTTPException(status_code=401, detail='User not found')
    user.pop('password_hash', None)
    return user

# ============ Models ============
class AdminUser(BaseModel):
    model_config = ConfigDict(extra='ignore')
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mobile: str
    name: str
    role: Literal['admin', 'editor', 'manager', 'viewer'] = 'admin'
    password_hash: str
    created_at: datetime = Field(default_factory=now_utc)

class LoginIn(BaseModel):
    mobile: str
    password: str

class AdminUserOut(BaseModel):
    id: str
    mobile: str
    name: str
    role: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: AdminUserOut

# ---------- Content Models ----------
class HeroSlideBase(BaseModel):
    heading: str
    subheading: Optional[str] = None
    description: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    background_image: Optional[str] = None
    video: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class HeroSlide(HeroSlideBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class ServiceBase(BaseModel):
    title: str
    icon: Optional[str] = None  # lucide icon name
    image: Optional[str] = None
    description: str
    features: List[str] = []
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class Service(ServiceBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class ProjectBase(BaseModel):
    name: str
    temple: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    location: Optional[str] = None
    logo: Optional[str] = None
    cover_image: Optional[str] = None
    gallery: List[str] = []
    work_order: Optional[str] = None
    status: Optional[str] = None
    technologies: List[str] = []
    features: List[str] = []
    description: Optional[str] = None
    category: Literal['temple', 'government', 'private', 'corporate'] = 'temple'
    is_special: bool = False
    sort_order: int = 0
    is_active: bool = True

class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class ProductBase(BaseModel):
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None
    banner: Optional[str] = None
    screenshots: List[str] = []
    features: List[str] = []
    modules: List[str] = []
    play_store: Optional[str] = None
    app_store: Optional[str] = None
    download_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class TestimonialBase(BaseModel):
    temple: str
    officer_name: str
    designation: Optional[str] = None
    photo: Optional[str] = None
    review: str
    rating: int = 5
    sort_order: int = 0
    is_active: bool = True

class Testimonial(TestimonialBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class NewsPostBase(BaseModel):
    title: str
    slug: Optional[str] = None
    category: Literal['news', 'blog', 'announcement', 'press-release'] = 'news'
    cover_image: Optional[str] = None
    excerpt: Optional[str] = None
    content: str = ''
    tags: List[str] = []
    author: Optional[str] = None
    published_at: Optional[datetime] = None
    is_active: bool = True

class NewsPost(NewsPostBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class ClientBase(BaseModel):
    name: str
    logo: Optional[str] = None
    category: Literal['temple', 'government', 'private', 'corporate'] = 'temple'
    website: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class Client(ClientBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)

class RecognitionBase(BaseModel):
    name: str
    label: Optional[str] = None
    sub: Optional[str] = None
    logo: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class Recognition(RecognitionBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class StatisticBase(BaseModel):
    label: str
    value: str
    sort_order: int = 0
    is_active: bool = True

class Statistic(StatisticBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class SettingsIn(BaseModel):
    site_title: Optional[str] = None
    logo: Optional[str] = None
    favicon: Optional[str] = None
    footer_text: Optional[str] = None
    social_links: Dict[str, str] = {}
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    contact_address: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    google_analytics_id: Optional[str] = None
    meta_pixel_id: Optional[str] = None

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    subject: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=now_utc)
    email_sent: bool = False
    read: bool = False
    replied: bool = False

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=32)
    organization: Optional[str] = Field(None, max_length=160)
    subject: Optional[str] = Field(None, max_length=180)
    message: str = Field(..., min_length=5, max_length=4000)


# ============ Email ============
def _build_html(sub: ContactCreate) -> str:
    return f"""
    <table width='100%' cellpadding='0' cellspacing='0' style='font-family:Arial,sans-serif;background:#060A14;padding:24px;'>
      <tr><td>
        <table width='620' align='center' cellpadding='0' cellspacing='0' style='background:#0A1128;border:1px solid rgba(212,175,55,0.25);border-radius:8px;padding:32px;color:#F8F9FA;'>
          <tr><td>
            <p style='margin:0 0 6px;color:#FF9933;letter-spacing:3px;font-size:11px;text-transform:uppercase;'>New Contact Enquiry</p>
            <h1 style='margin:0 0 24px;color:#D4AF37;font-size:26px;font-weight:400;'>Aatreya Infotech Systems LLP</h1>
            <table width='100%' cellpadding='8' cellspacing='0' style='border-collapse:collapse;color:#F8F9FA;font-size:14px;'>
              <tr><td width='140' style='color:#A0AEC0;'>Name</td><td>{sub.name}</td></tr>
              <tr><td style='color:#A0AEC0;'>Email</td><td>{sub.email}</td></tr>
              <tr><td style='color:#A0AEC0;'>Phone</td><td>{sub.phone or '—'}</td></tr>
              <tr><td style='color:#A0AEC0;'>Organization</td><td>{sub.organization or '—'}</td></tr>
              <tr><td style='color:#A0AEC0;'>Subject</td><td>{sub.subject or '—'}</td></tr>
            </table>
            <div style='margin-top:24px;padding:20px;background:#060A14;border-left:3px solid #D4AF37;color:#F8F9FA;font-size:14px;line-height:1.7;white-space:pre-wrap;'>{sub.message}</div>
            <p style='margin:28px 0 0;color:#A0AEC0;font-size:12px;'>Received via aatreya.co.in contact form.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """

async def _send_email_async(sub: ContactCreate) -> bool:
    if not RESEND_API_KEY:
        return False
    params = {
        "from": f"Aatreya Contact <{SENDER_EMAIL}>",
        "to": [CONTACT_TO_EMAIL],
        "reply_to": sub.email,
        "subject": f"[Website Enquiry] {sub.subject or sub.name}",
        "html": _build_html(sub),
    }
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        return True
    except Exception as e:
        logger.error(f"Resend send failed: {e}")
        return False

# ============ Health / Root ============
@api_router.get('/')
async def root():
    return {'message': 'Aatreya Infotech Systems LLP API', 'status': 'ok'}

@api_router.get('/health')
async def health():
    return {'status': 'healthy', 'email_configured': bool(RESEND_API_KEY)}

# ============ Auth ============
@api_router.post('/auth/login', response_model=TokenOut)
async def auth_login(payload: LoginIn):
    mobile = payload.mobile.strip()
    user = await admin_users.get({'mobile': mobile})
    if not user or not verify_password(payload.password, user.get('password_hash', '')):
        raise HTTPException(status_code=401, detail='Invalid mobile or password')
    token = create_access_token(user['id'], user['mobile'], user.get('role', 'admin'))
    return TokenOut(
        access_token=token,
        user=AdminUserOut(id=user['id'], mobile=user['mobile'], name=user['name'], role=user.get('role', 'admin')),
    )

@api_router.get('/auth/me', response_model=AdminUserOut)
async def auth_me(current=Depends(get_current_admin)):
    return AdminUserOut(id=current['id'], mobile=current['mobile'], name=current['name'], role=current.get('role', 'admin'))

# ============ Uploads ============
@api_router.post('/admin/uploads')
async def upload_file(file: UploadFile = File(...), current=Depends(get_current_admin)):
    ext = Path(file.filename or 'file').suffix.lower()
    safe_name = f"{uuid.uuid4().hex}{ext}"
    data = await file.read()
    if _blob_container is not None:
        from azure.storage.blob import ContentSettings
        content_type = file.content_type or 'application/octet-stream'
        await asyncio.to_thread(
            _blob_container.upload_blob,
            safe_name,
            data,
            overwrite=True,
            content_settings=ContentSettings(content_type=content_type),
        )
        size = len(data)
    else:
        dest = UPLOADS_DIR / safe_name
        with dest.open('wb') as f:
            f.write(data)
        size = dest.stat().st_size
    url = f"/api/uploads/{safe_name}"
    return {'filename': safe_name, 'url': url, 'size': size}

# ============ CRUD Factory ============
def make_crud(collection_name: str, model, base_model, path: str, public_filter: Optional[dict] = None):
    coll = TABLES[collection_name]

    # Admin list
    @api_router.get(f'/admin/{path}')
    async def admin_list(current=Depends(get_current_admin)):
        return await coll.find(order_by='sort_order', limit=1000)

    # Admin get
    @api_router.get(f'/admin/{path}/{{item_id}}')
    async def admin_get(item_id: str, current=Depends(get_current_admin)):
        doc = await coll.get({'id': item_id})
        if not doc:
            raise HTTPException(status_code=404, detail='Not found')
        return doc

    # Admin create
    @api_router.post(f'/admin/{path}')
    async def admin_create(payload: base_model, current=Depends(get_current_admin)):
        obj = model(**payload.model_dump())
        doc = obj.model_dump()
        await coll.insert(doc)
        return doc

    # Admin update
    @api_router.put(f'/admin/{path}/{{item_id}}')
    async def admin_update(item_id: str, payload: base_model, current=Depends(get_current_admin)):
        update = payload.model_dump()
        update['updated_at'] = now_utc()
        matched = await coll.update({'id': item_id}, update)
        if matched == 0:
            raise HTTPException(status_code=404, detail='Not found')
        return await coll.get({'id': item_id})

    # Admin delete
    @api_router.delete(f'/admin/{path}/{{item_id}}')
    async def admin_delete(item_id: str, current=Depends(get_current_admin)):
        deleted = await coll.delete({'id': item_id})
        if deleted == 0:
            raise HTTPException(status_code=404, detail='Not found')
        return {'ok': True}

    # Public list (only active)
    if public_filter is not None:
        @api_router.get(f'/public/{path}')
        async def public_list():
            return await coll.find(where=public_filter, order_by='sort_order', limit=1000)

# Register CRUD endpoints
make_crud('hero_slides', HeroSlide, HeroSlideBase, 'hero-slides', {'is_active': True})
make_crud('services', Service, ServiceBase, 'services', {'is_active': True})
make_crud('projects', Project, ProjectBase, 'projects', {'is_active': True})
make_crud('products', Product, ProductBase, 'products', {'is_active': True})
make_crud('testimonials', Testimonial, TestimonialBase, 'testimonials', {'is_active': True})
make_crud('news', NewsPost, NewsPostBase, 'news', {'is_active': True})
make_crud('clients', Client, ClientBase, 'clients', {'is_active': True})
make_crud('recognitions', Recognition, RecognitionBase, 'recognitions', {'is_active': True})
make_crud('statistics', Statistic, StatisticBase, 'statistics', {'is_active': True})


# ============ Contact ============
class ContactResponse(BaseModel):
    id: str
    email_sent: bool
    message: str

@api_router.post('/contact', response_model=ContactResponse)
async def submit_contact(payload: ContactCreate):
    try:
        email_sent = await _send_email_async(payload)
        record = ContactSubmission(**payload.model_dump(), email_sent=email_sent)
        doc = record.model_dump()
        await contact_submissions.insert(doc)
        return ContactResponse(id=record.id, email_sent=email_sent, message='Thank you. Our team will reach out shortly.')
    except HTTPException:
        raise
    except Exception as e:
        logger.exception('Contact submission failed')
        raise HTTPException(status_code=500, detail=f'Submission failed: {str(e)}')

@api_router.get('/admin/contact-submissions')
async def admin_contact_list(current=Depends(get_current_admin), limit: int = 500):
    return await contact_submissions.find(order_by='created_at', desc=True, limit=limit)

@api_router.patch('/admin/contact-submissions/{item_id}')
async def admin_contact_update(item_id: str, patch: Dict[str, Any], current=Depends(get_current_admin)):
    matched = await contact_submissions.update({'id': item_id}, patch)
    if matched == 0:
        raise HTTPException(status_code=404, detail='Not found')
    return await contact_submissions.get({'id': item_id})

@api_router.delete('/admin/contact-submissions/{item_id}')
async def admin_contact_delete(item_id: str, current=Depends(get_current_admin)):
    deleted = await contact_submissions.delete({'id': item_id})
    if deleted == 0:
        raise HTTPException(status_code=404, detail='Not found')
    return {'ok': True}

# ============ Settings (Singleton) ============
SETTINGS_KEY = 'site-settings'

@api_router.get('/public/settings')
async def public_settings():
    doc = await site_settings.get({'key': SETTINGS_KEY})
    if not doc:
        return {}
    return doc

@api_router.get('/admin/settings')
async def admin_settings_get(current=Depends(get_current_admin)):
    doc = await site_settings.get({'key': SETTINGS_KEY}) or {'key': SETTINGS_KEY}
    return doc

@api_router.put('/admin/settings')
async def admin_settings_put(payload: SettingsIn, current=Depends(get_current_admin)):
    update = payload.model_dump()
    update['updated_at'] = now_utc()
    await site_settings.upsert({'key': SETTINGS_KEY}, update)
    return await site_settings.get({'key': SETTINGS_KEY})

# ============ Dashboard ============
@api_router.get('/admin/dashboard')
async def admin_dashboard(current=Depends(get_current_admin)):
    projects = await projects_tbl.count()
    services = await services_tbl.count()
    products = await products_tbl.count()
    testimonials = await testimonials_tbl.count()
    news = await news_tbl.count()
    contacts = await contact_submissions.count()
    unread = await contact_submissions.count({'read': False})
    slides = await hero_slides_tbl.count()
    recent_contacts = await contact_submissions.find(order_by='created_at', desc=True, limit=6)
    return {
        'counts': {
            'projects': projects, 'services': services, 'products': products,
            'testimonials': testimonials, 'news': news, 'contacts': contacts,
            'unread_contacts': unread, 'hero_slides': slides,
        },
        'recent_contacts': recent_contacts,
    }

# ============ Startup: admin seed + indexes + static uploads ============
if _blob_container is not None:
    from fastapi.responses import StreamingResponse

    @api_router.get('/uploads/{name}')
    async def serve_upload(name: str):
        blob = _blob_container.get_blob_client(name)
        try:
            props = await asyncio.to_thread(blob.get_blob_properties)
            stream = await asyncio.to_thread(blob.download_blob)
            data = await asyncio.to_thread(stream.readall)
        except Exception:
            raise HTTPException(status_code=404, detail='Not found')
        content_type = (props.content_settings.content_type
                        if props.content_settings else None) or 'application/octet-stream'
        return StreamingResponse(iter([data]), media_type=content_type)
else:
    app.mount('/api/uploads', StaticFiles(directory=str(UPLOADS_DIR)), name='uploads')

@app.on_event('startup')
async def on_startup():
    try:
        await asyncio.to_thread(sqldb.check_connection)
    except Exception as e:
        logger.error(f'Database connection failed: {e}')
        raise

    admin_mobile = os.environ.get('ADMIN_MOBILE', '9999999999')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    admin_name = os.environ.get('ADMIN_NAME', 'Admin')
    existing = await admin_users.get({'mobile': admin_mobile})
    if not existing:
        u = AdminUser(mobile=admin_mobile, name=admin_name, role='admin', password_hash=hash_password(admin_password))
        await admin_users.insert(u.model_dump())
        logger.info(f'Seeded admin user with mobile {admin_mobile}')
    elif not verify_password(admin_password, existing.get('password_hash', '')):
        await admin_users.update({'mobile': admin_mobile}, {'password_hash': hash_password(admin_password)})
        logger.info(f'Updated admin password for {admin_mobile}')


@app.on_event('shutdown')
async def shutdown_db_client():
    pass


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=['*'],
    allow_headers=['*'],
)
