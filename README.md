# 🕵️‍♂️ StreamSleuth

A **general-purpose log inspection and filtering** web application. StreamSleuth empowers security engineers, analysts, and developers to upload, parse, search, and export log data across multiple formats—ranging from plain-text server logs to Splunk exports and CSV-based data classification reports.

---

## 🚀 Features

- **Multi-Format Support**  
  - **Generic Logs**: Free-form text with keyword search.  
  - **Apache/Nginx**: Standard web server access and error logs.  
  - **Splunk (Raw)**: Parses raw Splunk exports into structured entries and displays key fields as visual chips.  
  - **Splunk (JSON)**: Handles JSON-formatted Splunk logs with nested object support.  
  - **Data Classification (CSV)**: Filters and previews CSV exports (e.g., data classification or audit reports).  

- **Rich Filtering & Search**  
  - Keyword, field-value (e.g. `#_of_Records = 0`), and JSON content search.  
  - Dynamic chip-style tags for Splunk fields for quick grouping and drill-down.  

- **Live Statistics**  
  - Total entries, INFO, WARNING, and ERROR counts updated in real-time.  

- **CSV Export & Download**  
  - **Export**: Generate a CSV of the filtered dataset via the backend endpoint.  
  - **Download**: One-click download of the current filtered view directly in the browser.  

- **API & UI**  
  - **Backend**: FastAPI service with clear endpoints for upload, parse, export, and download.  
  - **Frontend**: React + Vite interface for a responsive, interactive experience.  
  - **Dockerized**: Run both services locally with a single `docker compose up --build` command.  

---

## 🔧 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)  
- Node.js ≥ 18 & npm  
- Python 3.11  

### Installation & Run

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/your-org/streamsleuth.git
   cd streamsleuth

Start all services:
docker compose up --build
Start all services:

bash
Copy
Edit
docker compose up --build
Access the UI:

Frontend: http://localhost:5173

Backend API docs: http://localhost:8000/docs

Upload & Explore:

1. Select log format from the dropdown.
2. Upload your log file (any supported format).
3. Filter results using the search box (field=value or keywords).
4. View live stats and JSON preview of each entry.
5. Click Download Filtered Results to get a CSV of your current view.

🗂 Project Structure
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── csv_parser.py
│   │   │   ├── router.py
│   │   │   └── log_parser.py
│   │   └── main.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml
📡 API Endpoints
Method	Endpoint	Description
POST	/upload	Upload a log file and return parsed entries + headers
POST	/export	Return a CSV stream of the filtered dataset
GET	/download	Download the last filtered CSV as filtered_results.csv

🤝 Contributing
Contributions are welcome! Please:

1. Fork the repo.
2. Create a new branch: git checkout -b feature/YourFeature
3. Commit your changes: git commit -m 'feat: description'
4. Push to branch: git push origin feature/YourFeature
5. Open a Pull Request.

📝 License
Distributed under the MIT License. See LICENSE for more information.