# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.sensor_routes import router as sensor_router  # Changed import

app = FastAPI(title="Xpr366 API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(sensor_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Xpr366 API - Infrastructure Monitoring"}