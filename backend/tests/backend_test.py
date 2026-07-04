"""Backend API tests for Aatreya CMS."""
import os
import io
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_MOBILE = "8644297366"
ADMIN_PASSWORD = "Aatreya@2026"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"mobile": ADMIN_MOBILE, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data and data["user"]["mobile"] == ADMIN_MOBILE
    return data["access_token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# --- Health ---
def test_health():
    r = requests.get(f"{API}/health", timeout=15)
    assert r.status_code == 200


# --- Auth ---
def test_login_wrong_password():
    r = requests.post(f"{API}/auth/login", json={"mobile": ADMIN_MOBILE, "password": "wrong"}, timeout=15)
    assert r.status_code == 401


def test_auth_me_no_token():
    r = requests.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 401


def test_auth_me_with_token(auth_headers):
    r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["mobile"] == ADMIN_MOBILE
    assert "id" in data and "role" in data


# --- CRUD Factory tests ---
CRUD_CASES = [
    ("hero-slides", {"heading": "TEST_Hero", "subheading": "sub", "is_active": True}, {"heading": "TEST_Hero_upd"}),
    ("services", {"title": "TEST_Svc", "description": "desc", "features": ["a", "b"], "is_active": True}, {"title": "TEST_Svc_upd"}),
    ("projects", {"name": "TEST_Proj", "category": "temple", "is_active": True}, {"name": "TEST_Proj_upd"}),
    ("products", {"name": "TEST_Prod", "is_active": True}, {"name": "TEST_Prod_upd"}),
    ("testimonials", {"temple": "TEST_T", "officer_name": "TEST_O", "review": "great", "rating": 5, "is_active": True}, {"review": "updated"}),
    ("news", {"title": "TEST_News", "category": "news", "content": "body", "is_active": True}, {"title": "TEST_News_upd"}),
    ("clients", {"name": "TEST_Client", "category": "temple", "is_active": True}, {"name": "TEST_Client_upd"}),
    ("statistics", {"label": "TEST_Stat", "value": "100", "is_active": True}, {"value": "200"}),
]


@pytest.mark.parametrize("path,payload,update", CRUD_CASES)
def test_crud_cycle(auth_headers, path, payload, update):
    # unauthorized create
    r = requests.post(f"{API}/admin/{path}", json=payload, timeout=15)
    assert r.status_code == 401

    # create
    r = requests.post(f"{API}/admin/{path}", headers=auth_headers, json=payload, timeout=15)
    assert r.status_code == 200, r.text
    item = r.json()
    assert "id" in item
    item_id = item["id"]

    # list
    r = requests.get(f"{API}/admin/{path}", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    ids = [d["id"] for d in r.json()]
    assert item_id in ids

    # get single
    r = requests.get(f"{API}/admin/{path}/{item_id}", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["id"] == item_id

    # update (send merged payload since PUT expects full base model)
    merged = {**payload, **update}
    r = requests.put(f"{API}/admin/{path}/{item_id}", headers=auth_headers, json=merged, timeout=15)
    assert r.status_code == 200, r.text
    updated = r.json()
    for k, v in update.items():
        assert updated[k] == v

    # public list (only active)
    r = requests.get(f"{API}/public/{path}", timeout=15)
    assert r.status_code == 200
    pub_ids = [d["id"] for d in r.json()]
    assert item_id in pub_ids

    # delete
    r = requests.delete(f"{API}/admin/{path}/{item_id}", headers=auth_headers, timeout=15)
    assert r.status_code == 200

    # verify 404 after delete
    r = requests.get(f"{API}/admin/{path}/{item_id}", headers=auth_headers, timeout=15)
    assert r.status_code == 404


# --- Uploads ---
def test_upload_file(auth_headers):
    token = auth_headers["Authorization"]
    files = {"file": ("test.txt", io.BytesIO(b"hello world"), "text/plain")}
    r = requests.post(f"{API}/admin/uploads", headers={"Authorization": token}, files=files, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "url" in data and "filename" in data and "size" in data
    assert data["size"] == 11
    # fetch
    r2 = requests.get(f"{BASE_URL}{data['url']}", timeout=15)
    assert r2.status_code == 200
    assert r2.content == b"hello world"


def test_upload_requires_auth():
    files = {"file": ("test.txt", io.BytesIO(b"x"), "text/plain")}
    r = requests.post(f"{API}/admin/uploads", files=files, timeout=15)
    assert r.status_code == 401


# --- Contact Inbox ---
def test_contact_inbox_flow(auth_headers):
    # create submission via public endpoint
    msg = f"TEST_{uuid.uuid4()}"
    r = requests.post(f"{API}/contact", json={
        "name": "TEST_User", "email": "test@example.com", "message": msg + " extra text"
    }, timeout=30)
    assert r.status_code == 200
    cid = r.json()["id"]

    # list
    r = requests.get(f"{API}/admin/contact-submissions", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    ids = [d["id"] for d in r.json()]
    assert cid in ids

    # mark read
    r = requests.patch(f"{API}/admin/contact-submissions/{cid}", headers=auth_headers, json={"read": True}, timeout=15)
    assert r.status_code == 200
    assert r.json()["read"] is True

    # delete
    r = requests.delete(f"{API}/admin/contact-submissions/{cid}", headers=auth_headers, timeout=15)
    assert r.status_code == 200


# --- Settings ---
def test_settings_upsert(auth_headers):
    r = requests.get(f"{API}/admin/settings", headers=auth_headers, timeout=15)
    assert r.status_code == 200

    payload = {
        "site_title": "TEST_Aatreya",
        "contact_email": "info@example.com",
        "social_links": {"facebook": "https://fb.com/test"},
    }
    r = requests.put(f"{API}/admin/settings", headers=auth_headers, json=payload, timeout=15)
    assert r.status_code == 200
    doc = r.json()
    assert doc["site_title"] == "TEST_Aatreya"
    assert doc["social_links"]["facebook"] == "https://fb.com/test"

    # public
    r = requests.get(f"{API}/public/settings", timeout=15)
    assert r.status_code == 200
    pub = r.json()
    assert pub["site_title"] == "TEST_Aatreya"
    assert pub["contact_email"] == "info@example.com"


# --- Dashboard ---
def test_dashboard(auth_headers):
    r = requests.get(f"{API}/admin/dashboard", headers=auth_headers, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "counts" in data and "recent_contacts" in data
    for k in ["projects", "services", "products", "testimonials", "news", "contacts", "unread_contacts", "hero_slides"]:
        assert k in data["counts"]
