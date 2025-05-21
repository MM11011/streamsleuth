# 🕵️‍♂️ StreamSleuth

**StreamSleuth** is a full-stack security log ingestion and auditing platform that allows security teams to upload, view, search, and index event logs for audit investigations.

---

## 🎯 Features

- Upload `.txt` log files in various formats
- Select from built-in log format presets (Generic, Apache/Nginx, Syslog, Custom Regex)
- View logs in a modern, responsive browser interface
- Search logs by keyword, tag, or timestamp
- Visually highlighted search matches for fast triage
- Severity-based log grouping (INFO, WARNING, ERROR)
- Auto-count and display of log levels
- 📦 Ready for expansion into structured storage (e.g., SQLite/PostgreSQL)
- 🧪 Built with testing in mind

---

## 🛠 Tech Stack

- **Frontend:** React + TailwindCSS
- **Backend:** FastAPI (Python)
- **Database (Planned):** SQLite → PostgreSQL
- **Log Editor:** Custom-rendered UI with visual search tagging
- **Containerization:** Docker
- **Testing:** Pytest, React Testing Library

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/streamsleuth.git
cd streamsleuth

2. Start the full environment:
docker-compose up --build

📁 Project Structure

streamsleuth/
├── backend/
│   └── app/
│       ├── main.py
│       ├── api.py
│       ├── models.py
│       └── tests/
│           └── test_api.py
├── frontend/
│   └── src/
│       └── components/
│           └── App.jsx
├── data/         # Uploaded log files
├── assets/       # Screenshots for GitHub README
├── docs/         # Architecture, SDLC, diagrams (optional)
├── docker-compose.yml
└── README.md


📑 Log Format Detection & Parsing

🎯 Custom Regex Search

✨ Visual Highlighting of Search Terms

🧭 Roadmap
 Timeline view with chronological event breakdown

 Grouped filtering by log severity or source

 Structured backend storage using SQLite/PostgreSQL

 Multi-file analysis & session tagging

 Export functionality for filtered logs

🤝 Contributing
Feel free to fork, clone, and contribute with feature branches and PRs. Contributions are welcome!

📄 License
MIT License © 2025