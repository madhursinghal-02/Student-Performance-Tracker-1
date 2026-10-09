# Student Performance Tracker

Full-stack student performance tracking application built with Django REST Framework, a standalone jQuery page, and React.

## Tech Stack
- **Backend:** Python, Django, DRF, Pandas, NumPy
- **Storage:** JSON files (`users.json`, `student_data.json`) - Zero database/ORM
- **Frontend 1:** HTML5, CSS3, jQuery, Bootstrap 5 (Standalone)
- **Frontend 2:** React, Vite

## Test Credentials
- **Admin (Full CRUD):** `admin` / `admin123`
- **User (Read-only):** `user` / `user123`

## Quickstart

### 1. Backend & Live Web Interface
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r ../requirements.txt
python manage.py runserver 8000
```
- Open in browser: `http://127.0.0.1:8000/` (Serves the standalone Bootstrap/jQuery interface)

### 2. Standalone jQuery Page
- Open `frontend_jquery/index.html` directly in browser while the backend is running.

### 3. React Frontend (Optional)
```bash
cd frontend_react
npm install
npm run dev
```
- Open in browser: `http://localhost:3000/`

## REST API Endpoints
- `POST /api/login/` - In-memory token login (returns token and role)
- `GET /api/students/` - List all students (Admin and User)
- `POST /api/students/` - Create student (Admin only, 403 for User)
- `GET /api/students/<id>/` - Retrieve student details
- `PUT /api/students/<id>/` - Update student (Admin only)
- `DELETE /api/students/<id>/` - Delete student (Admin only)
- `GET /api/stats/` - NumPy and Pandas calculations (mean, max, min, pass %, grades)
- `GET /api/export/csv/` - Export records as CSV

## Key Features Implemented
1. **Zero Database:** Python `json` module reads and writes `data/student_data.json`.
2. **Backend RBAC:** Custom `@auth_required` decorator returns `403 Forbidden` for non-admin mutations.
3. **NumPy & Pandas Analytics:** Computes `mean()`, `max()`, `min()`, pass rate (>= 40), and grade counts.
4. **Mandatory Form Inputs:** Text (`name`, `subject`), textarea (`address`), integer (`age`), float (`marks`), select (`grade`).
5. **UI States:** Loading spinner, success alert, error alert, and empty data handling.

## References Used
- Django Documentation (Views, Routing)
- DRF Documentation (`@api_view`, `Response`)
- NumPy Documentation (`mean`, `max`, `min`)
- Pandas Documentation (`DataFrame`, `value_counts`)
- Bootstrap 5 Documentation (Grid, Tables, Forms)
- jQuery API Documentation (`$.ajax`, DOM manipulation)
- MDN Web Docs (Fetch API, LocalStorage)
