# app/tests/test_query.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_query_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Se asume que docs ya han sido cargados con upload
        payload = {"question": "¿Cuál es la política de vacaciones?"}
        response = await ac.post("/api/v1/query/", json=payload)
    assert response.status_code == 200
    assert "answer" in response.json()
    assert "sources" in response.json()

@pytest.mark.asyncio
async def test_query_empty():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        payload = {"question": ""}
        response = await ac.post("/api/v1/query/", json=payload)
    assert response.status_code == 422
