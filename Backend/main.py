from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("model.pkl")

# Load feature columns used during training
feature_columns = joblib.load("feature_columns.pkl")

# Load label encoder
encoder = joblib.load("encoder.pkl")

# Load benchmark
high_benchmark = joblib.load("benchmark.pkl")

# SHAP explainer
explainer = shap.TreeExplainer(model)

# Actionable features
ACTIONABLE_FEATURES = [
    "PercentSalaryHike",
    "TrainingTimesLastYear",
    "YearsSinceLastPromotion",
    "MonthlyIncome",
    "YearsWithCurrManager"
]


class Employee(BaseModel):
    Age: int
    MonthlyIncome: float
    DailyRate: float
    HourlyRate: float
    MonthlyRate: float
    JobLevel: int
    JobRole: str
    YearsWithCurrManager: int
    PercentSalaryHike: int
    TrainingTimesLastYear: int
    YearsSinceLastPromotion: int


@app.post("/analyze")
def analyze_employee(data: Employee):

    # Convert request to dataframe
    df = pd.DataFrame([data.dict()])

    # One-hot encoding (same as notebook)
    df = pd.get_dummies(df)

    # Align with training columns
    df = df.reindex(columns=feature_columns, fill_value=0)

    # Prediction
    prediction = model.predict(df)[0]

    prediction_label = encoder.inverse_transform([prediction])[0]

    # SHAP explanation (same as notebook)
    shap_values = explainer(df)

    class_shap_values = shap_values.values[0, :, prediction]

    impact_series = pd.Series(
        class_shap_values,
        index=feature_columns
    )

    # Top 3 features for chart
    top_features = impact_series.abs().sort_values(ascending=False).head(3)

    top_factors = {
        feature: float(impact_series[feature])
        for feature in top_features.index
    }

    # Recommendation logic (benchmark based)
    actionable_impact = impact_series[
        impact_series.index.isin(ACTIONABLE_FEATURES)
    ]

    negative_features = actionable_impact.sort_values().head(3)

    recommendations = []

    for feature in negative_features.index:

        employee_value = df.iloc[0][feature]
        benchmark_value = high_benchmark[feature]

        # gap = benchmark_value - employee_value

        # if gap > 0:
        recommendations.append(
            f"{feature}: Current Value = {employee_value}, "
            f"Benchmark = {round(benchmark_value,2)}. "
            f"Improving {feature} may help increase employee productivity."
        )

    if len(recommendations) == 0:
        recommendations.append(
            "Employee already meets high productivity benchmarks."
        )

    return {
        "prediction": prediction_label,
        "top_factors": top_factors,
        "recommendations": recommendations
    }



# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib
# import pandas as pd
# import shap
# import numpy as np
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Allow React frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load trained model
# model = joblib.load("model.pkl")

# # Load feature columns used during training
# feature_columns = joblib.load("feature_columns.pkl")

# # Load encoder
# encoder = joblib.load("encoder.pkl")

# # Benchmark 
# high_benchmark = joblib.load("benchmark.pkl")

# # SHAP explainer
# explainer = shap.TreeExplainer(model)


# # Employee input schema
# class Employee(BaseModel):
#     Age: int
#     MonthlyIncome: float
#     DailyRate: float
#     HourlyRate: float
#     MonthlyRate: float
#     JobLevel: int
#     JobRole: str
#     YearsWithCurrManager: int
#     PercentSalaryHike: int
#     TrainingTimesLastYear: int
#     YearsSinceLastPromotion: int


# @app.post("/analyze")
# def analyze_employee(data: Employee):

#     # Convert request to dataframe
#     df = pd.DataFrame([data.dict()])

#     # One-hot encode JobRole (same as training)
#     df = pd.get_dummies(df)

#     # Align columns with training dataset
#     df = df.reindex(columns=feature_columns, fill_value=0)

#     # Prediction
#     prediction = model.predict(df)[0]

#     prediction_label = encoder.inverse_transform([prediction])[0]

#     # SHAP explanation
#     shap_values = explainer.shap_values(df)

#     class_index = prediction
#     feature_contrib = shap_values[class_index][0]

#     contributions = dict(zip(feature_columns, feature_contrib))

#     # Sort features by importance
#     sorted_features = sorted(
#         contributions.items(),
#         key=lambda x: abs(x[1]),
#         reverse=True
#     )

#     # Top 3 important factors
#     top_factors = sorted_features[:3]

#     recommendations = []

#     for feature, value in top_factors:

#         if value < 0:
#             recommendations.append(
#                 f"Improving {feature} may increase productivity."
#             )

#     if len(recommendations) == 0:
#         recommendations.append(
#             "Your current performance factors look strong. Maintain consistency."
#         )

#     return {
#         "prediction": prediction_label,
#         "top_factors": {k: float(v) for k, v in top_factors},
#         "recommendations": recommendations
#     }