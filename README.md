# Employee Management System
**Stack:** React 18 + Spring Boot 3 + MySQL | **Client:** BridgeSoft

---

## Prerequisites
| Tool | Version |
|------|---------|
| Java JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

## 1. Database Setup

Open MySQL Workbench or CLI and run:

```sql
CREATE SCHEMA employee_management_system;
USE employee_management_system;

-- Insert default admin user
-- (tables auto-created by Hibernate on first run)
-- Run this AFTER starting the backend once:
INSERT INTO users(username, password) VALUES ('admin', 'admin123');
```

---

## 2. Backend Setup & Run

```bash
cd backend

# Configure DB credentials in src/main/resources/application.properties
# Default: root/root on localhost:3306

# Build and run
mvn spring-boot:run
```

Backend runs on: **http://localhost:9191**

### API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/login | Login |
| GET | /api/v1/employees | Get all employees |
| POST | /api/v1/employees | Add employee |
| GET | /api/v1/employees/{id} | Get by ID |
| PUT | /api/v1/employees/{id} | Update employee |
| DELETE | /api/v1/employees/{id} | Delete employee |

---

## 3. Frontend Setup & Run

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 4. Test the App

1. Open http://localhost:5173/login
2. Login with `admin` / `admin123`
3. You are redirected to the Employee List
4. Use "Add Employee" to create records
5. Edit/Delete from the list

---

## 5. Deployment (Production)

### Option A — Deploy on a Linux VPS (Recommended)

#### Backend — Build JAR

```bash
cd backend
mvn clean package -DskipTests
# Output: target/backend-0.0.1-SNAPSHOT.jar
```

Update `application.properties` for your production DB URL, then:

```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Use **systemd** to keep it running:

```ini
# /etc/systemd/system/ems-backend.service
[Unit]
Description=EMS Spring Boot Backend
After=network.target

[Service]
User=ubuntu
ExecStart=/usr/bin/java -jar /home/ubuntu/ems/backend-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable ems-backend
sudo systemctl start ems-backend
```

#### Frontend — Build & Serve

Before building, update `src/services/EmployeeService.js` and `AuthService.js`
to point to your production backend URL:

```js
const EMPLOYEE_API = "https://your-domain.com/api/v1/employees";
const AUTH_API     = "https://your-domain.com/api/auth/login";
```

Then:

```bash
cd frontend
npm run build
# Output: dist/ folder
```

Serve with **Nginx**:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/ems/dist;
    index index.html;

    # React Router — serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Spring Boot
    location /api/ {
        proxy_pass http://localhost:9191;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo cp -r dist /var/www/ems/
sudo nginx -t && sudo systemctl reload nginx
```

---

### Option B — Free Hosting

| Layer | Platform | Notes |
|-------|----------|-------|
| Frontend | **Vercel** or **Netlify** | `npm run build` → deploy `dist/` |
| Backend | **Railway** or **Render** | Deploy the JAR or connect GitHub |
| Database | **PlanetScale** (MySQL) or **Railway MySQL** | Free tier available |

**Vercel (Frontend):**
1. Push `frontend/` to GitHub
2. Go to vercel.com → New Project → Import repo
3. Set `Root Directory` = `frontend`
4. Set Build Command = `npm run build`, Output = `dist`
5. Add env variable if needed

**Railway (Backend + DB):**
1. Push `backend/` to GitHub
2. New project on railway.app → Deploy from GitHub
3. Add a MySQL plugin → copy the connection URL
4. Set env vars: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`

---

## Bugs Fixed (vs original documents)

| File | Bug | Fix |
|------|-----|-----|
| `AuthService.java` | `==` used for String comparison — always returns `false` | Changed to `.equals()` |
| `EmployeeList.jsx` | `employees.map(employees =>` — wrong variable name, no `return` | Renamed to `emp`, added `return` |
| `Department.java` | `@Table` with no `name` causes conflicts | Added `name = "departments"` |
| `Employee.java` / `Department.java` | `@Transactional` on entity classes (wrong layer) | Moved to `EmployeeService` |
| `EmployeeController.java` | `@CrossOrigin` was `localhost:3000` in some files, `5173` in others | Unified to `5173` (Vite default) |
| `UpdateEmployee.jsx` | DOJ used plain text input — no format parsing | Changed to `date` input with `dd-MM-yyyy ↔ yyyy-MM-dd` conversion |
| `EmployeeService.java` (updateEmployee) | `setDept(employee.getDept())` replaces the whole dept entity causing orphan records | Updated individual fields instead |
