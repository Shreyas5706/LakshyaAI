from fastapi import FastAPI
from app.schemas.request_schema import DomainRequest, ITCareerRequest
from app.services.domain_service import predict_domain
from app.services.it_service import predict_it_career

app = FastAPI(
    title="LakshyaAI ML Backend",
    version="1.0.0"
)


# ============================
# HEALTH CHECK
# ============================

@app.get("/health")
def health_check():
    return {"status": "ML backend running"}


# ============================
# DOMAIN PREDICTION ENDPOINT
# ============================

@app.post("/predict/domain")
def domain_prediction(request: DomainRequest):
    return predict_domain(
        education=request.education,
        skills=request.skills,
        interest=request.interest
    )


# ============================
# IT CAREER PREDICTION ENDPOINT
# ============================

@app.post("/predict/it-career")
def it_career_prediction(request: ITCareerRequest):
    return {
        "results": predict_it_career(
            skills_list=request.skills,
            top_k=request.top_k
        )
    }
