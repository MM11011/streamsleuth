# StreamSleuth

A **general-purpose log inspection and filtering** web application. StreamSleuth empowers security engineers, analysts, and developers to upload, parse, search, and export log data across multiple formats—ranging from plain-text server logs to Splunk exports and CSV-based data classification reports.

---

## 🚀 Features

- **Multi-Format Support**
  - **Generic Logs**: Free-form text with keyword search.
  - **Apache/Nginx**: Standard web server access and error logs.
  - **Splunk (Raw)**: Parses raw Splunk exports into structured entries and displays key fields as visual chips.
  - **Splunk (JSON)**: Handles JSON-formatted Splunk logs with nested object support.
  - **Data Classification (CSV)**:
    - Upload and preview CSV files (e.g., metadata reports or field audits)
    - Filter rows using advanced queries like `#_of_Records = 0, Sensitivity_Level = Confidential,Private`
    - Multi-value filters supported via comma or pipe (`,`, `|`)
    - Always-visible **Filter Keys Sidebar** helps users remember available fields
    - Export/download filtered subset of results with one click

- **Rich Filtering & Search**
  - Keyword, field-value (e.g. `#_of_Records = 0`), and JSON content search
  - Dynamic chip-style tags for Splunk fields for quick grouping and drill-down
  - Multi-clause, multi-value filters supported for advanced refinement

- **Live Statistics**
  - Real-time entry counts for INFO, WARNING, and ERROR levels
  - Filtered entry total dynamically updates with search queries

- **CSV Export & Download**
  - **Export**: Generate a CSV of the filtered dataset via the backend endpoint
  - **Download**: One-click download of the current filtered view directly in the browser

- **API & UI**
  - **Backend**: FastAPI service with endpoints for upload, parse, export, and download
  - **Frontend**: React + Vite interface with live filtering and highlighting
  - **Dockerized**: Easily run both services locally using Docker Compose

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
* docker compose up --build

Access the UI:
Frontend: http://localhost:5173
Backend API docs: http://localhost:8000/docs

🧪 How to Use (CSV Filtering Example)
1. Select Data Classification (CSV) from the format dropdown
2. Upload your CSV file
3. Use the search box to filter data, e.g.: #_of_Records = 0,Sensitivity_Level = Confidential|Private,Data_Type = Lookup, Reference available filter keys in the right-hand sidebar
4. Click “Download Filtered Results” to export matching rows to CSV

📡 API Endpoints:
Method	Endpoint	Description
POST	/upload	Upload a log file and return parsed entries + headers
POST	/export	Return a CSV stream of the filtered dataset
GET	/download	Download the last filtered CSV as filtered_results.csv

🗂 Project Structure
css
Copy
Edit
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
│   ├── App.css
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml



🤝 Contributing
Contributions are welcome! Please:

1. Fork the repo
2. Create a new branch: git checkout -b feature/YourFeature
3. Commit your changes: git commit -m 'feat: description'
4. Push to your branch: git push origin feature/YourFeature
5. Open a Pull Request

📝 License
Distributed under the MIT License. See LICENSE for more information.