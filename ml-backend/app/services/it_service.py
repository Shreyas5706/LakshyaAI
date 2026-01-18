import numpy as np
from app.utils.model_loader import load_bundle

# =====================================
# LOAD IT CAREER MODEL BUNDLE (ONCE)
# =====================================

bundle = load_bundle("it_career_model.pkl")

model = bundle["model"]                 # RandomForestClassifier
mlb = bundle["encoder"]                 # MultiLabelBinarizer
feature_importance = bundle["feature_importance"]  # dict


# =====================================
# IT CAREER PREDICTION SERVICE
# =====================================

def predict_it_career(skills_list, top_k=3):
    """
    Predict top IT careers based on user skills.

    Parameters
    ----------
    skills_list : List[str]
        Example: ["Python", "SQL", "Pandas"]

    top_k : int
        Number of career recommendations to return

    Returns
    -------
    List[dict]
        [
            {
                "role": str,
                "confidence": float,
                "matched_skills": {
                    skill_name: importance_score
                }
            }
        ]
    """

    # 1️⃣ Encode skills (NO fitting, NO preprocessing here)
    skill_vector = mlb.transform([skills_list])

    # 2️⃣ Predict probability distribution
    probabilities = model.predict_proba(skill_vector)[0]

    # 3️⃣ Select top-k roles
    top_indices = np.argsort(probabilities)[::-1][:top_k]

    results = []

    for idx in top_indices:
        role = model.classes_[idx]
        confidence = round(float(probabilities[idx]), 2)

        # 4️⃣ Explainability: match user skills with role importance
        matched_skills = {
            skill: round(float(feature_importance[role].get(skill, 0)), 3)
            for skill in skills_list
            if skill in feature_importance[role]
        }

        results.append({
            "role": role,
            "confidence": confidence,
            "matched_skills": matched_skills
        })

    return results

        