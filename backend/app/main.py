from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="TrendLens — Earth System Trend Detective API",
    description="Scientific statistical service for analyzing real NASA Earth-observation time series.",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "service": "TrendLens Scientific Backend",
        "version": "1.0.0",
        "nasa_apis": {
            "nasa_power": "operational",
            "nasa_cmr": "operational",
            "nasa_gibs": "operational"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
