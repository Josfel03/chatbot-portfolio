# 🧠 Enterprise RAG Chatbot API

> **Production-ready Document Analysis System** powered by GPT-4o, LangChain, and FastAPI.
> *Dockerized architecture for seamless deployment.*

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)
![OpenAI](https://img.shields.io/badge/AI-GPT--4o-412991?style=for-the-badge&logo=openai)

## 📋 Overview

This project is a specialized microservice designed to perform **Retrieval-Augmented Generation (RAG)** on private documentation. 

Unlike generic LLM wrappers, this system allows businesses to **ingest proprietary PDF documents** and perform high-precision semantic searches. It acts as an intelligent layer between the raw data and GPT-4o, ensuring answers are grounded in the provided context rather than generated from public internet data (reducing hallucinations).

**Key Features:**
* **Semantic Search:** Uses vector embeddings (ChromaDB) to understand the *meaning* behind queries, not just keyword matching.
* **Privacy-Focused:** Documents are processed locally within the container; only relevant snippets are sent to the LLM for context.
* **Scalable Architecture:** Built with a "Clean Architecture" approach using LangChain LCEL and FastAPI.
* **Dockerized:** Zero-dependency deployment. Works on any machine with Docker installed.

## 🛠️ Tech Stack

* **Backend Framework:** FastAPI (Async/Await performance).
* **AI Orchestration:** LangChain (LCEL - LangChain Expression Language).
* **Vector Database:** ChromaDB (Local persistence).
* **LLM Provider:** OpenAI API (GPT-4o Model).
* **Containerization:** Docker & Docker Compose.
* **Dependency Management:** `uv` (for development) / `pip` (for production).

---

## 🚀 Quick Start (Deployment)

Prerequisites: **Docker** and **Docker Compose**.

### 1. Clone the Repository
You can clone via HTTPS or SSH:

```bash
# HTTPS
git clone [https://github.com/Josfel03/chatbot-portfolio.git](https://github.com/Josfel03/chatbot-portfolio.git)

# SSH
git clone git@github.com:Josfel03/chatbot-portfolio.git