# 🕵️‍♂️ StreamSleuth

**StreamSleuth** is a full-stack security log ingestion and auditing platform that allows security teams to upload, view, search, and parse event logs from a browser-based UI.

---

## 🎯 Features

- Upload `.txt` logs in multiple formats:
  - Generic
  - Apache/Nginx
  - Syslog
  - **Splunk (Raw)** 🆕
  - **Splunk (JSON)** 🆕
- Real-time structured parsing of Splunk log data
- Field-tag rendering (e.g., `host`, `sourcetype`) with visual chips
- Keyword highlighting across log entries
- Severity-based log grouping (INFO, WARNING, ERROR)
- Auto-count and display of log levels
- Modern, responsive UI for audit review and triage
- Built with testing and extensibility in mind

---

## ⚙️ Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: FastAPI (Python)
- **Log Editor**: Chip-rendered UI with custom log tag visualization
- **Containerization**: Docker
- **Testing**: Pytest + React Testing Library

---

## 🚀 Getting Started

### 1. Clone and Start

```bash
git clone https://github.com/yourusername/streamsleuth.git
cd streamsleuth
docker-compose up --build

2. Upload a log file via the web UI
Choose your log format

Upload .txt log

Instantly parse, tag, and search entries

🔍 Supported Formats
Format	Parsing Type	Tags Rendered
Generic	Freeform	None
Apache/Nginx	Regex-based	IPs, Methods
Syslog	Pattern-based	Date, Severity
Splunk (Raw)	Structured via regex	host, type, level
Splunk (JSON)	JSON-based parsing	_time, host, sourcetype, log_level, message

🛣️ Roadma

---

## 🧠 Splunk Log Parsing Support

StreamSleuth now supports:

- ✅ Raw Splunk logs (`Splunk (Raw)`)
- ✅ JSON-formatted Splunk logs (`Splunk (JSON)`)
- 🧠 Structured parsing of fields (host, sourcetype, message, log level, etc.)
- 🧠 Visual tags for host/type breakdown
- ✅ Real-time search with keyword highlighting
- ✅ Format-specific preview with severity color coding

---

## 🚀 Roadmap

- [x] Splunk (Raw) parsing with visual tag extraction
- [x] Splunk (JSON) parsing with structured field preview
- [x] Search term highlighting
- [x] Log entry severity indicators
- [x] Visual chip-style tags for host/type
- [ ] CSV Upload and Filter Tool (for Data Classification)
- [ ] Timeline View for chronological event navigation
- [ ] Grouped filtering by host/type/severity
- [ ] Export filtered results (JSON/CSV)
- [ ] AI-powered pattern detection for anomaly logs

 JSON-based parsing for Splunk log exports

 Regex-powered parsing for Splunk raw logs

 Chip-based field visualization (host, sourcetype)

 Group-by filter for tags (host, type, level)

 Timeline view for chronological log analysis

 Multi-log correlation for event chain reconstruction

 Export filtered logs (JSON, CSV)

 Integration with Splunk HEC for live ingestion (future)

🤝 Contributing
Feel free to fork, clone, and contribute with feature branches and pull requests.

📄 License
MIT License © 2025
