# StreamSleuth

StreamSleuth is a full-stack security log ingestion and auditing platform that allows security teams to upload, view, search, and index event logs for audit investigations.

## 🎯 Features

- Upload or stream event log data
- View logs in a browser-based editor
- Search logs by keyword, tag, or timestamp
- Store logs in a structured database for future querying

## 🛠️ Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite → PostgreSQL
- **Editor**: Monaco Editor
- **Containerization**: Docker
- **Testing**: Pytest, React Testing Library

## 🚀 Getting Started

1. Clone the repo  
   `git clone https://github.com/yourusername/streamsleuth.git`

2. Start the full environment  
   ```bash
   docker-compose up --build

streamsleuth/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api.py
│   │   └── models.py
│   └── tests/
│       └── test_api.py
├── frontend/
│   └── src/
│       ├── components/
│       └── App.jsx
├── data/                 # Log uploads / test files
├── docs/                 # Architecture, SDLC, diagrams
├── .gitignore
├── docker-compose.yml
└── README.md
