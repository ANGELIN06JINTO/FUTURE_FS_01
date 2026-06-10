# Angelin Jinto — Professional Portfolio Website

**Future Interns · Full Stack Web Development · Task 1 (2026)**

A clean, responsive, and professional portfolio website built with **HTML/CSS/JavaScript** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🌐 Live Demo
> Deploy to Netlify (frontend) + Render (backend) — steps below

---

## 📁 Project Structure

```
portfolio/
├── index.html              ← Main portfolio page
├── css/
│   └── style.css           ← All styles (dark editorial theme)
├── js/
│   └── main.js             ← Frontend JS (cursor, animations, form)
├── backend/
│   ├── server.js           ← Express server entry point
│   ├── .env                ← Environment variables (dummy values for task)
│   ├── .env.example        ← Environment variable template
│   ├── config/
│   │   └── db.js           ← MongoDB connection
│   ├── models/
│   │   └── Contact.js      ← Mongoose schema
│   ├── routes/
│   │   └── contact.js      ← API routes (POST, GET, PATCH, DELETE)
│   ├── services/
│   │   └── emailService.js ← Nodemailer email templates
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

The `.env` file inside `backend/` contains **dummy values** for this task submission.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
EMAIL_USER=your_email_address
EMAIL_PASS=The_16_character_App_Password #(no spaces)
# Same Gmail that gets notified when someone fills the form
EMAIL_TO=your_email_address #receiving address
# Where your frontend runs (Live Server default)
FRONTEND_URL=http://127.0.0.1:5500
```

> ⚠️ **Before deploying to production**, replace these with real credentials:
> - A real MongoDB Atlas connection string
> - A real Gmail address + Gmail App Password (16-char code from Google Account → Security → App Passwords)

---

## ✨ Features

- 📱 Fully **responsive** — mobile, tablet, desktop
- 🎨 Custom **dark editorial** design with CSS animations
- 🖱️ Custom cursor with hover effects
- 🔄 Smooth scroll-reveal animations
- 📊 Animated skill bars
- 📬 **Contact form** with:
  - Client-side validation
  - **MongoDB** message storage
  - **Email notification** to portfolio owner
  - **Auto-reply email** to the sender
- 🔒 Rate limiting (5 messages / 15 min per IP)
- 🛡️ Input sanitization and validation (express-validator)

---

## 🚀 How to Run Locally

### Step 1 — Clone the Repository

```bash
git clone https://github.com/AngelinJinto/portfolio.git
cd portfolio
```

### Step 2 — Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3 — Start the Backend Server

```bash
npm run dev
```

You should see:
```
══════════════════════════════════════════
  🚀  Angelin Jinto Portfolio Backend
  📡  Server running on http://localhost:5000
══════════════════════════════════════════
```

> Note: MongoDB connection will fail with dummy credentials — replace `MONGODB_URI` in `.env` with a real Atlas URI to enable database storage.

### Step 4 — Open the Frontend

- Install the **Live Server** VS Code extension
- Right-click `index.html` → **"Open with Live Server"**
- Opens at `http://127.0.0.1:5500`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Submit a contact form message |
| `GET` | `/api/contact` | List all messages (paginated) |
| `GET` | `/api/contact/:id` | Get one message by ID |
| `PATCH` | `/api/contact/:id/read` | Mark message as read |
| `DELETE` | `/api/contact/:id` | Delete a message |

---

## 🌍 Deploying to Production

### Frontend → Netlify
1. Go to [netlify.com](https://netlify.com) → New site → Import from GitHub
2. Publish directory: `/`
3. Deploy

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Root Directory: `backend` · Start Command: `node server.js`
3. Add real Environment Variables (replacing the dummy values)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Fonts | Google Fonts (Syne + DM Sans) |
| Deployment | Netlify (frontend) + Render (backend) |

---

## 👩‍💻 Author

**Angelin Jinto**  
B.Tech CSE · Christ College of Engineering, Thrissur, Kerala  
[GitHub](https://github.com/AngelinJinto) · [LinkedIn](https://linkedin.com/in/angelinjinto)

---

*Built as Future Interns Full Stack Web Development Task 1 · 2026*
