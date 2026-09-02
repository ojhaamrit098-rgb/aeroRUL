## Preprocessing

import os
import pandas as pd
import numpy as np

tr_p = os.path.join("data", "train_FD004.txt")
ts_p = os.path.join("data", "test_FD004.txt")
r_p = os.path.join("data", "RUL_FD004.txt")

# Column
columns = (["unit_id","cycle"]+[f"setting_{i}" for i in range (1,4)] + [f"sensor_{i}" for i in range(1,22)])

# Load dataset
train = pd.read_csv(tr_p, sep=r"\s+", header=None, names=columns)
test = pd.read_csv(ts_p, sep=r"\s+", header=None, names=columns)
rul = pd.read_csv(r_p, sep=r"\s+", header=None, names=["RUL"])

# Calculate RUL for train dataset
maxc = train.groupby("unit_id")["cycle"].transform("max")
train["RUL"] = maxc - train["cycle"]

features = ["cycle","setting_1","setting_2","setting_3"] + [f"sensor_{i}" for i in range(1,22)]

## Part 1: Linear Regression
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error,mean_squared_error

X_train = train[features]
Y_train = train["RUL"]

test_last = test.groupby("unit_id").last().reset_index()

X_test = test_last[features]
Y_test = rul["RUL"]

model = LinearRegression()
model.fit(X_train,Y_train)

Y_pred = model.predict(X_test)

# Scores
mae = mean_absolute_error(Y_test,Y_pred)
rmse = np.sqrt(mean_squared_error(Y_test,Y_pred))

results = []
results.append({"Model":"Linear Regression","MAE":mae,"RMSE":rmse})

print("Linear Regression")
print("MAE: ",mae)
print("RMSE: ",rmse)

# print(results)

## Part 2: Ridge Regression

from sklearn.linear_model import Ridge

ridge_model = Ridge(alpha=1.0)
ridge_model.fit(X_train,Y_train)

ridge_pred = ridge_model.predict(X_test)

# Scores
ridge_mae = mean_absolute_error(Y_test,ridge_pred)
ridge_rmse = np.sqrt(mean_squared_error(Y_test,ridge_pred))

results.append({"Model":"Ridge Regression","MAE":ridge_mae,"RMSE":ridge_rmse})

print("Ridge Regression")
print("MAE: ",ridge_mae)
print("RMSE: ",ridge_rmse)

## Part 3: KNN Regression

from sklearn.neighbors import KNeighborsRegressor

knn_model = KNeighborsRegressor(n_neighbors=5)
knn_model.fit(X_train,Y_train)

knn_pred = knn_model.predict(X_test)

knn_mae = mean_absolute_error(Y_test,knn_pred)
knn_rmse = np.sqrt(mean_squared_error(Y_test,knn_pred))

results.append({"Model":"KNN Regression","MAE":knn_mae,"RMSE":knn_rmse})

print("KNN Regression")
print("MAE: ",knn_mae)
print("RMSE: ",knn_rmse)

## Part 4: Decision Tree Regression

from sklearn.tree import DecisionTreeRegressor

tree_model = DecisionTreeRegressor(random_state=42)
tree_model.fit(X_train,Y_train)

tree_pred = tree_model.predict(X_test)

# Scores
tree_mae = mean_absolute_error(Y_test,tree_pred)
tree_rmse = np.sqrt(mean_squared_error(Y_test,tree_pred))

results.append({"Model":"Decision Tree Regression","MAE":tree_mae,"RMSE":tree_rmse})

print("Decision Tree Regression")
print("MAE: ",tree_mae)
print("RMSE: ",tree_rmse)

## Part 5: Random Forest Regression

from sklearn.ensemble import RandomForestRegressor

rf_model = RandomForestRegressor(n_estimators=100,random_state=42,n_jobs=-1)
rf_model.fit(X_train,Y_train)

rf_pred = rf_model.predict(X_test)

# Scores
rf_mae = mean_absolute_error(Y_test,rf_pred)
rf_rmse = np.sqrt(mean_squared_error(Y_test,rf_pred))

results.append({"Model":"Random Forest Regression","MAE":rf_mae,"RMSE":rf_rmse})

print("Decision Tree Regression")
print("MAE: ",rf_mae)
print("RMSE: ",rf_rmse)

## Part 6: XGBoost Regression

from xgboost import XGBRegressor

xgb_model = XGBRegressor(n_estimators = 100,learning_rate = 0.05,max_depth = 6,random_state = 42)
xgb_model.fit(X_train,Y_train)

xgb_pred = xgb_model.predict(X_test)

# Scores
xgb_mae = mean_absolute_error(Y_test,xgb_pred)
xgb_rmse = np.sqrt(mean_squared_error(Y_test,xgb_pred))

results.append({"Model":"XGBoost Regression","MAE":xgb_mae,"RMSE":xgb_rmse})

print("XGBoost Regression")
print("MAE: ",xgb_mae)
print("RMSE: ",xgb_rmse)

## Part 7: LightGBM Regression

from lightgbm import LGBMRegressor

lgbm_model = LGBMRegressor(n_estimators = 100, learning_rate = 0.05, max_depth = 6, random_state = 42, verbosity = -1)
lgbm_model.fit(X_train,Y_train)

lgbm_pred = lgbm_model.predict(X_test)

# Scores
lgbm_mae = mean_absolute_error(Y_test,lgbm_pred)
lgbm_rmse = np.sqrt(mean_squared_error(Y_test,lgbm_pred))

results.append({"Model":"LightGBM Regression","MAE":lgbm_mae,"RMSE":lgbm_rmse})

print("LightGBM Regression")
print("MAE: ",lgbm_mae)
print("RMSE: ",lgbm_rmse)

print(results)