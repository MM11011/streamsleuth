from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import api  # 👈 NEW

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 Register API routes
app.include_router(api.router)
