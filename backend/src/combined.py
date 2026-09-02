# Import and load data

import os
import pandas as pd
import numpy as np

columns = (["unit_id","cycle"]+[f"setting_{i}" for i in range (1,4)] + [f"sensor_{i}" for i in range(1,22)])

## Train dataset

train1 = pd.read_csv("data/train_FD001.txt", sep=r"\s+", header=None, names=columns)
train2 = pd.read_csv("data/train_FD002.txt", sep=r"\s+", header=None, names=columns)
train3 = pd.read_csv("data/train_FD003.txt", sep=r"\s+", header=None, names=columns)
train4 = pd.read_csv("data/train_FD004.txt", sep=r"\s+", header=None, names=columns)

# Engine ID continuous 

train2["unit_id"] += train1["unit_id"].max()
train3["unit_id"] += train2["unit_id"].max()
train4["unit_id"] += train3["unit_id"].max()

# RUL for each dataset

for df in [train1, train2, train3, train4]:
    maxc = df.groupby("unit_id")["cycle"].transform("max")
    df["RUL"] = maxc - df["cycle"]

# Combine all datasets

train = pd.concat([train1, train2, train3, train4], ignore_index=True)

## Test dataset

test1 = pd.read_csv("data/test_FD001.txt", sep=r"\s+", header=None, names=columns)
test2 = pd.read_csv("data/test_FD002.txt", sep=r"\s+", header=None, names=columns)
test3 = pd.read_csv("data/test_FD003.txt", sep=r"\s+", header=None, names=columns)
test4 = pd.read_csv("data/test_FD004.txt", sep=r"\s+", header=None, names=columns)

# Engine ID continuous

test2["unit_id"] += test1["unit_id"].max()
test3["unit_id"] += test2["unit_id"].max()
test4["unit_id"] += test3["unit_id"].max()

# Combine all datasets

test = pd.concat([test1, test2, test3, test4], ignore_index=True)

## RUL dataset

rul1 = pd.read_csv("data/RUL_FD001.txt", sep=r"\s+", header=None, names=["RUL"])
rul2 = pd.read_csv("data/RUL_FD002.txt", sep=r"\s+", header=None, names=["RUL"])
rul3 = pd.read_csv("data/RUL_FD003.txt", sep=r"\s+", header=None, names=["RUL"])
rul4 = pd.read_csv("data/RUL_FD004.txt", sep=r"\s+", header=None, names=["RUL"])

# Combine all datasets

rul = pd.concat([rul1, rul2, rul3, rul4], ignore_index=True)

## Data combined successfully to be used for XGBoost

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

features = ["cycle","setting_1","setting_2","setting_3"] + [f"sensor_{i}" for i in range(1,22)]

X_train = train[features]
Y_train = train["RUL"]

test_last = test.groupby("unit_id").last().reset_index()
X_test = test_last[features]
Y_test = rul["RUL"]

xgb_model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
xgb_model.fit(X_train, Y_train)
Y_pred = xgb_model.predict(X_test)

mae = mean_absolute_error(Y_test, Y_pred)
rmse = np.sqrt(mean_squared_error(Y_test, Y_pred))
r2 = r2_score(Y_test, Y_pred)

os.makedirs("models", exist_ok=True)
xgb_model.save_model("models/xgboost.json")

# print("XGBoost Regression")
# print("MAE: ", mae)
# print("RMSE: ", rmse)
# print("R2 Score: ", r2)

# comp = pd.DataFrame({"Actual RUL": Y_test, "Predicted RUL": Y_pred})
# print(comp.head(10))
