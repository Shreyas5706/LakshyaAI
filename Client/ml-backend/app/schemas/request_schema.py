from pydantic import BaseModel
from typing import List


# ============================
# DOMAIN PREDICTOR INPUT
# ============================

class DomainRequest(BaseModel):
    education: str
    skills: str
    interest: str


# ============================
# IT CAREER PREDICTOR INPUT
# ============================

class ITCareerRequest(BaseModel):
    skills: List[str]
    top_k: int = 3
