from app.utils.model_loader import load_bundle

# =====================================
# LOAD DOMAIN PREDICTOR BUNDLE (ONCE)
# =====================================

bundle = load_bundle("domain_predictor.pkl")

model = bundle["model"]           # LogisticRegression
vectorizer = bundle["vectorizer"] # TfidfVectorizer


# =====================================
# DOMAIN PREDICTION SERVICE
# =====================================

def predict_domain(education, skills, interest):
    """
    Predict whether user belongs to IT or Non-IT domain.

    Parameters
    ----------
    education : str
        Example: "BTech Computer Science"

    skills : str
        Example: "programming fundamentals problem solving system design"

    interest : str
        Example: "building systems solving real-world problems"

    Returns
    -------
    dict
        {
            "domain": "IT" | "Non-IT",
            "confidence": float
        }
    """

    # 1️⃣ Combine input 
    combined_text = f"{education} {skills} {interest}"

    # 2️⃣ Vectorize using SAVED TF-IDF 
    X = vectorizer.transform([combined_text])

    # 3️⃣ Predict domain
    prediction = model.predict(X)[0]

    # 4️⃣ Confidence score
    probabilities = model.predict_proba(X)[0]
    confidence = max(probabilities)

    return {
        "domain": prediction,
        "confidence": round(float(confidence), 2)
    }
print(
    predict_domain(
        education="BTech Computer Science",
        skills="programming fundamentals problem solving",
        interest="building systems"
    )
)