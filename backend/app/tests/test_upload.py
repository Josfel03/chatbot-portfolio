# app/tests/test_upload.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_upload_pdf_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/upload_pdf/",
            files={"file": ("manual.pdf", b"%PDF-1.4 fake", "application/pdf")}
        )
    assert response.status_code in (200, 201)
    assert "document_id" in response.json()

@pytest.mark.asyncio
async def test_upload_pdf_invalid_file():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/upload_pdf/",
            files={"file": ("manual.txt", b"not a pdf", "text/plain")}
        )
    assert response.status_code == 400
