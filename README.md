# AeroRUL — Aircraft Engine Remaining Useful Life Prediction

AeroRUL is an AI-powered **fleet intelligence and predictive maintenance platform** designed to monitor aircraft engine health and predict **Remaining Useful Life (RUL)**. It combines engine prediction data, fleet monitoring, analytics, and an interactive dashboard to help identify degradation and potential failures before they occur.

## 🚀 Features

* **Fleet Overview**

  * Monitor overall fleet health
  * View healthy, degraded, and critical engines
  * Track average RUL and fleet readiness
  * Identify engines requiring attention

* **Engine Monitoring**

  * View individual engine health
  * Track operating cycles
  * Monitor RUL predictions
  * Identify engine status and degradation trends
  * View the model used for each prediction

* **RUL Predictions**

  * Predict remaining useful life of aircraft engines
  * Display current engine cycle and health information
  * Support AI/ML-based predictive maintenance workflows

* **Analytics**

  * Visualize fleet and engine degradation trends
  * Analyze historical prediction information
  * Support maintenance decision-making

* **Dataset Management**

  * Upload and manage engine datasets
  * Store uploaded dataset metadata securely
  * Associate datasets with authenticated users

* **Authentication**

  * Supabase-based user authentication
  * User-specific data access
  * Secure database queries using authenticated user IDs

* **Modern Dashboard UI**

  * Interactive sidebar navigation
  * Dashboard cards and charts
  * Engine tables and detail views
  * Notifications and alerts
  * Light/dark theme support
  * Responsive and animated interface

---

## 🏗️ Project Architecture

```text
AeroRUL/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Login.jsx
│   │   ├── UploadPage.jsx
│   │   ├── BackendTest.jsx
│   │   └── lib/
│   │       └── supabase.js
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

> The exact backend file structure may vary depending on the current implementation.

---

## 🛠️ Technology Stack

### Frontend

* **React.js**
* **Vite**
* **JavaScript / JSX**
* **CSS**
* Interactive dashboard components and charts

### Backend

* **Python**
* **FastAPI**
* REST API architecture
* AI/ML prediction pipeline integration

### Database & Authentication

* **Supabase**
* PostgreSQL database
* Supabase Authentication
* Row-level user data filtering

### Machine Learning

AeroRUL is designed around machine-learning-based engine health and RUL prediction. The dashboard can consume prediction outputs containing information such as:

* Engine ID
* Engine status
* Current cycle
* Remaining Useful Life
* Health score
* Prediction model
* Degradation trend

---

## 📊 Database Structure

### `datasets`

Stores uploaded dataset information.

| Column         | Type      | Description           |
| -------------- | --------- | --------------------- |
| `id`           | UUID      | Unique dataset ID     |
| `user_id`      | UUID      | Authenticated user ID |
| `file_name`    | Text      | Uploaded file name    |
| `stoarge_path` | Text      | Stored dataset path   |
| `uploaded_at`  | Timestamp | Upload timestamp      |

> `stoarge_path` follows the current database schema exactly.

### `engine_predictions`

Stores engine prediction results.

| Column       | Type      | Description                |
| ------------ | --------- | -------------------------- |
| `id`         | UUID      | Unique prediction ID       |
| `user_id`    | UUID      | Authenticated user ID      |
| `engine_id`  | Text      | Aircraft engine identifier |
| `status`     | Text      | Engine health status       |
| `cycle`      | Integer   | Current engine cycle       |
| `rul`        | Integer   | Remaining Useful Life      |
| `health`     | Integer   | Engine health score        |
| `model`      | Text      | ML model used              |
| `trend`      | Text      | Degradation trend          |
| `created_at` | Timestamp | Prediction creation time   |

---

## 🔄 Application Flow

```text
User
  │
  ▼
Supabase Authentication
  │
  ▼
AeroRUL Dashboard
  │
  ├── Fleet Overview
  │
  ├── Engine Monitoring
  │
  ├── RUL Predictions
  │
  ├── Analytics
  │
  ├── Models
  │
  └── Dataset Management
          │
          ▼
      Supabase Database
          │
          ▼
   Engine Prediction Data
          │
          ▼
    AI/ML Prediction System
```

---

## 💻 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Python 3.9+
* Supabase project
* Git

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd AeroRUL
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Configure Supabase

Create a Supabase project and configure the required database tables.

Create a frontend environment file:

```text
frontend/.env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit your `.env` file to Git.

---

## ▶️ Running the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The Vite development server will provide a local URL, typically:

```text
http://localhost:5173
```

---

## ▶️ Running the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The backend will typically run at:

```text
http://127.0.0.1:8000
```

Health check:

```text
GET /health
```

---

## 🔐 Authentication & Security

AeroRUL uses Supabase Authentication to identify users.

Database queries should always be scoped to the authenticated user's ID:

```text
user_id = authenticated_user.id
```

Recommended Supabase Row Level Security policies should ensure that users can only access their own datasets and prediction records.

For example:

```text
auth.uid() = user_id
```

Never expose sensitive service-role keys in the frontend.

---

## 🧠 Prediction Data

The prediction system can provide records in the following format:

```json
{
  "engine_id": "Engine 042",
  "status": "Healthy",
  "cycle": 218,
  "rul": 47,
  "health": 92,
  "model": "GRU-Ensemble_v2",
  "trend": "Stable"
}
```

These prediction results can then be displayed across the AeroRUL dashboard.

---

## 📈 Engine Health Classification

AeroRUL can classify engines into different operational states based on prediction results.

| Status   | Meaning                                            |
| -------- | -------------------------------------------------- |
| Healthy  | Engine operating within expected health conditions |
| Degraded | Engine shows signs of performance degradation      |
| Critical | Engine requires immediate attention                |

The exact classification thresholds can be configured according to the deployed ML model and maintenance requirements.

---

## 🔔 Fleet Alerts

The dashboard can generate notifications based on engine prediction states.

Examples include:

* Engine approaching failure
* Engine degradation detected
* Engine degradation trend changed
* Critical engine requiring attention

This allows maintenance teams to focus on engines with the highest risk.

---

## 🎯 Project Objective

The primary objective of AeroRUL is to move aircraft engine maintenance from a **reactive approach to a predictive approach**.

Instead of waiting for an engine component to fail, the system uses historical and predicted engine behavior to estimate remaining useful life and identify degradation early.

### Key Goals

* Predict aircraft engine RUL
* Detect engine degradation
* Monitor fleet health
* Reduce unexpected failures
* Support predictive maintenance
* Improve maintenance planning
* Provide centralized fleet intelligence

---

## 🔮 Future Enhancements

Potential future improvements include:

* Real-time sensor data ingestion
* Automated ML model training
* Multiple RUL prediction models
* Model performance comparison
* Explainable AI for predictions
* Automated maintenance recommendations
* Advanced anomaly detection
* Historical engine timelines
* Prediction confidence intervals
* Cloud deployment
* Role-based access control
* Real-time notifications
* Integration with aircraft maintenance systems

---

## 📌 Project Status

**Status:** Active Development

AeroRUL currently provides the foundation for an aircraft engine predictive-maintenance dashboard, including authentication, fleet monitoring, engine prediction visualization, analytics, and Supabase-backed data management.

---

## 👨‍💻 Development

When extending the project:

1. Keep frontend UI components modular.
2. Keep authentication handled through Supabase.
3. Scope database queries to the authenticated user.
4. Keep ML prediction logic separate from presentation logic.
5. Validate prediction data before displaying it.
6. Never commit credentials or secret keys.
7. Maintain consistent engine IDs and prediction schemas.

---

## 📄 License

This project is currently intended for development and academic/project use.

Add an appropriate open-source license here if the project is later published for public use.

---

## ⭐ AeroRUL

**Predict. Monitor. Prevent.**

AeroRUL brings AI-powered predictive maintenance and fleet intelligence together to help make aircraft engine operations safer, smarter, and more proactive.
