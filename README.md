# Communication Tracker

## Introduction
**Communication Tracker** is a robust web application designed to help organizations manage and track their communication activities effectively. With separate modules for Admin and Users, it facilitates efficient scheduling, reporting, and analytics for communications across companies.

The application includes:
- **Admin Module**: For managing companies and communication methods.
- **User Module**: For tracking communication activities and generating insights.
- **Reporting and Analytics Module**: For visualizing trends, generating actionable reports, and exporting data.

Built with **Flask** as the backend, **React** for the frontend, and **SQLite** for the database, the application emphasizes usability, scalability, and data visualization.

---

## Features

### **1. Admin Module**
The Admin Module allows administrators to configure the system by managing companies and defining communication methods.

#### Features:
1. **Company Management**:
   - View all companies in a tabular format.
   - Add a new company using a popup form.
   - Edit company details via an inline editor.
   - Delete a company with a single click.

2. **Communication Method Management**:
   - View all communication methods.
   - Add a new communication method.
   - Edit existing communication methods.
   - Delete unused communication methods.

---

### **2. User Module**
The User Module is designed to help users log, track, and visualize communication activities.

#### Features:
1. **Dashboard**:
   - View all companies and their last five communications.
   - Highlight overdue communications (Red) and today's communications (Yellow).

2. **Log Communication**:
   - Log a new communication by selecting:
     - The company.
     - The communication method.
     - Date of communication.
     - Additional notes.

3. **Notifications**:
   - View all overdue and upcoming communications in a grid.

4. **Calendar**:
   - View past and upcoming communications in a calendar format for easy tracking.

5. **Reports and Analytics**:
   - **Frequency Report**: View the frequency of each communication method.
   - **Overdue Trends**: Visualize overdue communications over time.
   - **Engagement Effectiveness**: See the effectiveness of each communication method.
   - **Activity Log**: View and export a detailed log of all communications.

---

### **3. Reporting and Analytics Module**
The Reporting Module provides comprehensive insights into communication data.

#### Features:
1. **Communication Frequency Report**:
   - Visualize the frequency of different communication methods.
   - Filter by company, start date, and end date.
   - Export the data as CSV or PDF.

2. **Overdue Communication Trends**:
   - View overdue communications trends over time in a line chart.

3. **Engagement Effectiveness**:
   - Analyze the effectiveness of each communication method using a pie chart.

4. **Activity Log**:
   - View a detailed log of all communication activities.
   - Filter by company, date range, and export logs as CSV or PDF.

---

## How to Run the Project on a Local Machine

Follow these steps to run the application locally:

---

### **1. Prerequisites**
- **Python** (version 3.9 or higher)
- **Node.js** (version 14 or higher) with **npm**
- **SQLite** (already included with Python)

---

### **2. Clone the Repository**
Clone the project to your local machine:
```bash
git clone <repository-url>
cd communication-tracker
```

---

### **3. Backend Setup**

#### a) Navigate to the Backend Directory:
```bash
cd backend
```
#### b) Create a Virtual Environment:
```bash
python3 -m venv venv
source venv/bin/activate
```
#### c) Install Dependencies:
```bash
pip install -r requirements.txt
```
#### d) Initialize the Database:
```bash
flask shell
```
In the Flask shell:
```bash
from app import db
db.create_all()
exit()
```
#### e) Run the Backend Server:
```bash
flask run
```
The backend will be available at http://127.0.0.1:5000.

---

### **4. Frontend Setup**
#### a) Navigate to the Frontend: Directory:
```bash
cd frontend
```

#### b) Install Dependencies:
```bash
npm install
```

#### c) Ru the Frontend Server:
```bash
npm start
```
The frontend will be available at http://localhost:3000.

### **5. Access the Application**

1. Open your browser and navigate to `http://localhost:3000`.
2. Start using the Communication Tracker!

---

## Modules in Detail

### **Admin Module**
1. Navigate to the Admin section from the homepage.
2. Use the sidebar to:
   - Manage **Companies**:
     - View, add, edit, or delete company data.
   - Manage **Communication Methods**:
     - View, add, edit, or delete communication methods.

### **User Module**
1. Navigate to the User section from the homepage.
2. Use the sidebar to:
   - Access the **Dashboard** to view communication statuses.
   - Log new communications via **Log Communication**.
   - View overdue and today’s communications in **Notifications**.
   - Track communication schedules in the **Calendar**.
   - Generate insights via the **Reports and Analytics** section.

### **Reporting and Analytics**
1. Navigate to the Reports Module from the homepage.
2. Use the sidebar to access:
   - **Frequency Report**: Visualize the frequency of communication methods.
   - **Overdue Trends**: View overdue communication trends over time.
   - **Engagement Effectiveness**: Analyze which methods are most effective.
   - **Activity Log**: View detailed logs and export them as CSV or PDF.

---

## Common Issues and Solutions

1. **CORS Issues**:
   If you encounter CORS errors, ensure the backend allows requests from `http://localhost:3000`:
   - Update `CORS(app)` in `backend/app/__init__.py`.

2. **Database Errors**:
   If the database doesn’t initialize, ensure the `migrations` folder is set up:
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

3. **Frontend Build Issues**:
   If the frontend fails to start, ensure dependencies are installed:
   ```bash
   npm install
   ```

## Future Improvements
- Add user authentication and authorization.
- Enable real-time notifications for overdue communications.
- Integrate external APIs (e.g., LinkedIn) for direct communication.
