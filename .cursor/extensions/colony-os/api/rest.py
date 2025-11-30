"""
Colony OS REST API
Main FastAPI application for Colony OS backend services
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Import routes
from api.routes import discovery

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Colony OS API",
    description="Distributed AI Operating System API for ZYEUTÉ",
    version="1.0.0"
)

# Configure CORS
# Production domains: https://adgenxai.pro and React Native apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://localhost:5173",
        "http://localhost:8081",
        "exp://localhost:8081",
        "exp://127.0.0.1:8081",
        "https://adgenxai.pro",
        "*"  # Allow all for development - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(discovery.router)

@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Colony OS API",
        "version": "1.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

