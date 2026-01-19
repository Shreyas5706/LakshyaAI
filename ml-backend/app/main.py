from fastapi import FastAPI, Header, HTTPException, Depends
from app.schemas.request_schema import DomainRequest, ITCareerRequest
from app.services.domain_service import predict_domain
from app.services.it_service import predict_it_career
import os 
app = FastAPI(
    title="LakshyaAI ML Backend",
    version="1.0.1"
)

def verify_api_key(x_api_key: str = Header(...)):
    expected_key = os.getenv("ML_API_KEY")

    if expected_key is None:
        raise HTTPException(status_code=500, detail="ML API key not configured")

    if x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized")



# ============================
# HEALTH CHECK
# ============================
@app.get("/health")
def health_check():
    try:
        # simple sanity inference
        _ = predict_domain(
            education="BTech Computer Science",
            skills="programming fundamentals",
            interest="building systems"
        )

        return {
            "status": "ok",
            "model_loaded": True
        }

    except Exception as e:
        return {
            "status": "degraded",
            "model_loaded": False,
            "error": str(e)
        }

# ============================
# DOMAIN PREDICTION ENDPOINT
# ============================

@app.post("/predict/domain")
def domain_prediction(request: DomainRequest, _: str = Depends(verify_api_key)):
    return predict_domain(
        education=request.education,
        skills=request.skills,
        interest=request.interest
    )


# ============================
# IT CAREER PREDICTION ENDPOINT
# ============================

@app.post("/predict/it-career")
def it_career_prediction(request: ITCareerRequest, _: str = Depends(verify_api_key)):
    return {
        "results": predict_it_career(
            skills_list=request.skills,
            top_k=request.top_k
        )
    }
