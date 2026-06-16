# FLUX — Project Management Tool

**Tech stack:** React (Vite) + Node.js (Express) + MongoDB (Mongoose) + JWT auth

Internship Level 3 Task 2 ka complete full-stack project management tool.

Features: user authentication (JWT), create/delete projects, Kanban board (To Do / In Progress / Done) with drag-and-drop, tasks with assignee + priority + deadline, live progress tracking per project.

---

## Folder structure
```
flux-pm/
├── backend/          → Node.js + Express API
│   ├── models/       → User, Project, Task
│   ├── routes/       → auth, projects, tasks
│   ├── middleware/   → auth.js
│   └── server.js
└── frontend/         → React app
    ├── src/
    │   ├── components/  → TopBar
    │   ├── pages/       → Landing, Login, Register, Dashboard, ProjectBoard
    │   └── context/     → AuthContext
    └── ...
```

---

## LOCAL PE CHALANE KA TARIKA

### STEP 1 — MongoDB Atlas
(Task 1 wala same account reuse kar sakta hai)
1. https://www.mongodb.com/atlas pe free cluster
2. Database user + Network Access mein `0.0.0.0/0`
3. Connection string copy kar (database naam `/flux` rakhna)

### STEP 2 — Backend
```bash
cd backend
npm install
cp .env.example .env     # windows: copy .env.example .env
```
`.env` mein apni MongoDB string daal:
```
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/flux?retryWrites=true&w=majority
JWT_SECRET=koi_random_text
PORT=5001
```
Server chala:
```bash
npm run dev
```
"⚡ MongoDB connected" + "FLUX server running on port 5001" = sahi.

### STEP 3 — Frontend (naya terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Browser: **http://localhost:5174**

Register kar, project bana, tasks add kar, drag karke status badlo, progress dekho.

---

## HOSTING (free)

### Backend → Render.com
- Root Directory: `backend`, Build: `npm install`, Start: `npm start`
- Env vars: `MONGO_URI`, `JWT_SECRET`

### Frontend → Netlify
- Pehle `frontend/.env` mein `VITE_API_URL` ko Render URL se badal
- Base: `frontend`, Build: `npm run build`, Publish: `frontend/dist`

---

## CODE GITHUB/GITLAB PE
```bash
git init
git add .
git commit -m "FLUX project management tool"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```
⚠️ `.env` push mat karna (`.gitignore` rok deta hai).

---

## Task requirements — sab cover
- [x] Create projects
- [x] Assign tasks (assignee field)
- [x] Set deadlines
- [x] Track progress (live % per project)
- [x] User authentication (JWT)
- [x] React + Node.js + MongoDB
- [x] Kanban board with drag-and-drop (bonus)
- [x] Free hosting ready
```
