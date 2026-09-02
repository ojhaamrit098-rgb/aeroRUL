from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import numpy as np
import pandas as pd
import xgboost as xgb
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")

XGB_PATH = os.path.join(MODEL_DIR, "xgboost.json")
GRU_PATH = os.path.join(MODEL_DIR, "gru_combined.keras")

COLUMNS = (
    ["unit_id", "cycle"]
    + [f"setting_{i}" for i in range(1, 4)]
    + [f"sensor_{i}" for i in range(1, 22)]
)

XGB_FEATURES = (
    ["cycle", "setting_1", "setting_2", "setting_3"]
    + [f"sensor_{i}" for i in range(1, 22)]
)

GRU_SENSORS = [
    2, 3, 4, 7, 8, 9, 11,
    12, 13, 14, 15, 17, 20, 21
]

GRU_FEATURES = (
    ["cycle", "setting_1", "setting_2", "setting_3"]
    + [f"sensor_{i}" for i in GRU_SENSORS]
)

SEQ = 50

xgb_model = xgb.XGBRegressor()
xgb_model.load_model(XGB_PATH)

gru_model = tf.keras.models.load_model(GRU_PATH)


def load_datasets():
    trains = []
    tests = []
    ruls = []

    offset = 0

    for dataset in ["FD001", "FD002", "FD003", "FD004"]:
        train = pd.read_csv(
            os.path.join(DATA_DIR, f"train_{dataset}.txt"),
            sep=r"\s+",
            header=None,
            names=COLUMNS,
        )

        test = pd.read_csv(
            os.path.join(DATA_DIR, f"test_{dataset}.txt"),
            sep=r"\s+",
            header=None,
            names=COLUMNS,
        )

        rul = pd.read_csv(
            os.path.join(DATA_DIR, f"RUL_{dataset}.txt"),
            sep=r"\s+",
            header=None,
            names=["RUL"],
        )

        train["unit_id"] += offset
        test["unit_id"] += offset

        offset = train["unit_id"].max()

        train["RUL"] = (
            train.groupby("unit_id")["cycle"].transform("max")
            - train["cycle"]
        )

        train["dataset"] = dataset
        test["dataset"] = dataset

        trains.append(train)
        tests.append(test)
        ruls.append(rul)

    return (
        pd.concat(trains, ignore_index=True),
        pd.concat(tests, ignore_index=True),
        pd.concat(ruls, ignore_index=True),
    )


train, test, rul = load_datasets()


def build_gru_scaler():
    scaler = MinMaxScaler()
    scaler.fit(train[GRU_FEATURES])
    return scaler


gru_scaler = build_gru_scaler()


def calculate_health(rul_value):
    health = 100 - (float(rul_value) / 125.0 * 100)
    return round(max(0, min(100, health)), 1)


def get_engine_predictions():
    test_last = (
        test.sort_values("cycle")
        .groupby("unit_id")
        .last()
        .reset_index()
    )

    xgb_input = test_last[XGB_FEATURES]
    xgb_predictions = xgb_model.predict(xgb_input)

    gru_inputs = []

    for unit_id, df in test.groupby("unit_id"):
        df = df.sort_values("cycle")

        values = df[GRU_FEATURES].values
        values = gru_scaler.transform(
            pd.DataFrame(values, columns=GRU_FEATURES)
        )

        if len(values) >= SEQ:
            sequence = values[-SEQ:]
        else:
            sequence = np.vstack(
                [
                    np.zeros(
                        (SEQ - len(values), len(GRU_FEATURES))
                    ),
                    values,
                ]
            )

        gru_inputs.append(sequence)

    gru_inputs = np.array(gru_inputs)
    gru_predictions = gru_model.predict(
        gru_inputs,
        verbose=0,
    ).flatten()

    return test_last, xgb_predictions, gru_predictions


@app.get("/")
def root():
    return {
        "message": "AeroRUL backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/models")
def models():
    return {
        "xgboost": {
            "loaded": True,
            "features": xgb_model.n_features_in_,
        },
        "gru": {
            "loaded": True,
            "input_shape": list(gru_model.input_shape),
            "output_shape": list(gru_model.output_shape),
            "features": len(GRU_FEATURES),
            "sequence_length": SEQ,
        },
    }


@app.get("/dataset")
def dataset():
    datasets = {}

    for name in ["FD001", "FD002", "FD003", "FD004"]:
        train_df = train[train["dataset"] == name]
        test_df = test[test["dataset"] == name]

        datasets[name] = {
            "training_engines": int(
                train_df["unit_id"].nunique()
            ),
            "training_records": int(len(train_df)),
            "test_engines": int(
                test_df["unit_id"].nunique()
            ),
            "test_records": int(len(test_df)),
        }

    return {
        "total_training_records": int(len(train)),
        "total_test_records": int(len(test)),
        "total_training_engines": int(
            train["unit_id"].nunique()
        ),
        "total_test_engines": int(
            test["unit_id"].nunique()
        ),
        "datasets": datasets,
    }


@app.get("/engines")
def engines():
    test_last, xgb_predictions, gru_predictions = (
        get_engine_predictions()
    )

    results = []

    for index, row in test_last.iterrows():
        xgb_rul = max(0, float(xgb_predictions[index]))
        gru_rul = max(0, float(gru_predictions[index]))

        ensemble_rul = (
            0.3 * xgb_rul +
            0.7 * gru_rul
        )

        if ensemble_rul <= 20:
            status = "Critical"
            trend = "Action"
        elif ensemble_rul <= 50:
            status = "Degraded"
            trend = "Watch"
        else:
            status = "Healthy"
            trend = "Stable"

        results.append({
            "id": f"Engine {int(row['unit_id']):03d}",
            "unit_id": int(row["unit_id"]),
            "dataset": row["dataset"],
            "cycle": int(row["cycle"]),
            "rul": round(ensemble_rul, 1),
            "xgboost_rul": round(xgb_rul, 1),
            "gru_rul": round(gru_rul, 1),
            "health": calculate_health(ensemble_rul),
            "status": status,
            "trend": trend,
            "model": "XGBoost + GRU",
        })

    return {
        "engines": results,
        "total": len(results),
    }


@app.get("/overview")
def overview():
    test_last, xgb_predictions, gru_predictions = (
        get_engine_predictions()
    )

    ensemble = (
        0.3 * np.maximum(xgb_predictions, 0)
        + 0.7 * np.maximum(gru_predictions, 0)
    )

    healthy = int(np.sum(ensemble > 50))
    degraded = int(np.sum((ensemble > 20) & (ensemble <= 50)))
    critical = int(np.sum(ensemble <= 20))

    total = len(ensemble)

    return {
        "active_engines": total,
        "fleet_health": round(
            float(np.mean(
                [calculate_health(x) for x in ensemble]
            )),
            1,
        ),
        "average_rul": round(float(np.mean(ensemble)), 1),
        "attention_required": degraded + critical,
        "healthy": healthy,
        "degraded": degraded,
        "critical": critical,
        "readiness": round(
            healthy / total * 100,
            1,
        ) if total else 0,
    }


@app.get("/analytics")
def analytics():
    test_last, xgb_predictions, gru_predictions = (
        get_engine_predictions()
    )

    xgb_rul = np.maximum(xgb_predictions, 0)
    gru_rul = np.maximum(gru_predictions, 0)
    ensemble = 0.3 * xgb_rul + 0.7 * gru_rul

    return {
        "average_xgboost_rul": round(
            float(np.mean(xgb_rul)), 2
        ),
        "average_gru_rul": round(
            float(np.mean(gru_rul)), 2
        ),
        "average_ensemble_rul": round(
            float(np.mean(ensemble)), 2
        ),
        "min_rul": round(float(np.min(ensemble)), 2),
        "max_rul": round(float(np.max(ensemble)), 2),
        "engine_count": len(ensemble),
    }


@app.get("/predictions")
def predictions():
    test_last, xgb_predictions, gru_predictions = (
        get_engine_predictions()
    )

    results = []

    for index, row in test_last.iterrows():
        xgb_rul = max(0, float(xgb_predictions[index]))
        gru_rul = max(0, float(gru_predictions[index]))

        ensemble_rul = (
            0.3 * xgb_rul +
            0.7 * gru_rul
        )

        results.append({
            "id": f"Engine {int(row['unit_id']):03d}",
            "dataset": row["dataset"],
            "cycle": int(row["cycle"]),
            "xgboost_rul": round(xgb_rul, 1),
            "gru_rul": round(gru_rul, 1),
            "ensemble_rul": round(ensemble_rul, 1),
        })

    return {
        "predictions": results
    }

from fastapi import UploadFile, File
import shutil
from pathlib import Path

UPLOAD_DIR = Path("uploaded_data")
UPLOAD_DIR.mkdir(exist_ok=True)

CURRENT_DATASET = UPLOAD_DIR / "current_test.txt"


@app.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):

    if not file.filename.endswith(".txt"):
        return {
            "success": False,
            "message": "Please upload a NASA C-MAPSS .txt test file."
        }

    with open(CURRENT_DATASET, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "success": True,
        "filename": file.filename,
        "saved_as": str(CURRENT_DATASET),
        "message": "Dataset uploaded successfully."
    }