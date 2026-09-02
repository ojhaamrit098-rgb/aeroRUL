import os
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, GRU, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# GPU Setup
print("TensorFlow:", tf.__version__)
print("GPU:", tf.config.list_physical_devices("GPU"))

# Load datasets
datasets = ["FD001", "FD002", "FD003", "FD004"]
cols = ["unit_id", "cycle"] + [f"setting_{i}" for i in range(1, 4)] + [f"sensor_{i}" for i in range(1, 22)]
trains, tests, ruls = [], [], []
offset = 0

for d in datasets:
    train = pd.read_csv(f"data/train_{d}.txt", sep=r"\s+", header=None, names=cols)
    test = pd.read_csv(f"data/test_{d}.txt", sep=r"\s+", header=None, names=cols)
    rul = pd.read_csv(f"data/RUL_{d}.txt", sep=r"\s+", header=None, names=["RUL"])
    train["unit_id"] += offset
    test["unit_id"] += offset
    offset = train["unit_id"].max()
    train["RUL"] = train.groupby("unit_id")["cycle"].transform("max") - train["cycle"]
    trains.append(train)
    tests.append(test)
    ruls.append(rul)

train = pd.concat(trains, ignore_index=True)
test = pd.concat(tests, ignore_index=True)
rul = pd.concat(ruls, ignore_index=True)

# Features and scaling
train["RUL"] = train["RUL"].clip(upper=125)
sensors = [2, 3, 4, 7, 8, 9, 11, 12, 13, 14, 15, 17, 20, 21]
features = ["cycle", "setting_1", "setting_2", "setting_3"] + [f"sensor_{i}" for i in sensors]

scaler = MinMaxScaler()
train[features] = scaler.fit_transform(train[features])
test[features] = scaler.transform(test[features])

# Create sequences
SEQ = 50

def sequences(data):
    X, y, units = [], [], []
    for uid, df in data.groupby("unit_id"):
        values = df.sort_values("cycle")[features].values
        target = df.sort_values("cycle")["RUL"].values if "RUL" in df else None
        for i in range(len(values) - SEQ + 1):
            X.append(values[i:i + SEQ])
            if target is not None:
                y.append(target[i + SEQ - 1])
                units.append(uid)
    return np.array(X), np.array(y), np.array(units)

X, Y, units = sequences(train)

# Validation split by engine
np.random.seed(42)
val_units = np.random.choice(np.unique(units), int(len(np.unique(units)) * 0.1), replace=False)
mask = np.isin(units, val_units)

X_val, Y_val = X[mask], Y[mask]
X_train, Y_train = X[~mask], Y[~mask]

# Test sequences
X_test = []
for uid, df in test.groupby("unit_id"):
    values = df.sort_values("cycle")[features].values
    X_test.append(values[-SEQ:] if len(values) >= SEQ else np.vstack([np.zeros((SEQ - len(values), len(features))), values]))
X_test = np.array(X_test)
Y_test = rul["RUL"].values

# Build GRU
model = Sequential([
    Input(shape=(SEQ, len(features))),
    GRU(128, return_sequences=True),
    Dropout(0.2),
    GRU(64),
    Dropout(0.2),
    Dense(32, activation="relu"),
    Dense(1)
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(0.001),
    loss=tf.keras.losses.Huber(10),
    metrics=["mae"]
)

# Train
callbacks = [
    EarlyStopping(monitor="val_loss", patience=8, restore_best_weights=True),
    ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-5)
]

model.fit(X_train, Y_train, epochs=50, batch_size=64, validation_data=(X_val, Y_val), callbacks=callbacks, verbose=1)

# Evaluate
Y_pred = model.predict(X_test).flatten()
mae = mean_absolute_error(Y_test, Y_pred)
rmse = np.sqrt(mean_squared_error(Y_test, Y_pred))
r2 = r2_score(Y_test, Y_pred)

print("GRU - Combined FD001-FD004")
print(f"MAE: {mae:.4f}")
print(f"RMSE: {rmse:.4f}")
print(f"R2 Score: {r2:.4f}")

# Save model
os.makedirs("models", exist_ok=True)
model.save("models/gru_combined.keras")
print("Model saved: models/gru_combined.keras")