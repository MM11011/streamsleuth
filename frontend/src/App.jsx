import { useState } from "react";
import "./App.css";

function App() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [logFormat, setLogFormat] = useState("Generic");

  const parseLogs = (content) => {
    const lines = content.split("\n");
    const regexMap = {
      Generic: /(INFO|WARNING|ERROR)/i,
      "Apache/Nginx": /(INFO|WARNING|ERROR)/i,
      Syslog: /\s(INFO|WARNING|ERROR)\s/i,
      "Custom Regex": /(INFO|WARNING|ERROR)/i,
    };
    const logRegex = regexMap[logFormat];
    return lines.map((line, index) => {
      const match = line.match(logRegex);
      const level = match ? match[1].toUpperCase() : "";
      return { id: index, line, level };
    });
  };

  const [logs, setLogs] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setFileContent(text);
      setLogs(parseLogs(text));
    };
    reader.readAsText(file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setUploadStatus(`✅ Uploaded as: ${data.filename}`);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus("❌ Upload failed");
    }
  };

  const filteredLogs = logs.filter((log) =>
    log.line.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levelCounts = logs.reduce(
    (acc, log) => {
      acc.total++;
      if (log.level === "INFO") acc.info++;
      else if (log.level === "WARNING") acc.warning++;
      else if (log.level === "ERROR") acc.error++;
      return acc;
    },
    { total: 0, info: 0, warning: 0, error: 0 }
  );

  const levelBadge = (level) => {
    switch (level) {
      case "INFO":
        return <span style={{ color: "#4ade80", fontWeight: 600 }}>🟩 INFO</span>;
      case "WARNING":
        return <span style={{ color: "#facc15", fontWeight: 600 }}>🟨 WARNING</span>;
      case "ERROR":
        return <span style={{ color: "#f87171", fontWeight: 600 }}>🟥 ERROR</span>;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", color: "white" }}>
      <h1>🕵️‍♂️ StreamSleuth</h1>
      <p style={{ marginBottom: "0.5rem" }}>Log Inspector – Upload & Search Security Logs</p>

      <label htmlFor="format-select">Log Format:</label>
      <select
        id="format-select"
        value={logFormat}
        onChange={(e) => setLogFormat(e.target.value)}
        style={{ marginLeft: "0.5rem", padding: "0.25rem" }}
      >
        <option value="Generic">Generic</option>
        <option value="Apache/Nginx">Apache/Nginx</option>
        <option value="Syslog">Syslog</option>
        <option value="Custom Regex">Custom Regex</option>
      </select>

      <div style={{ margin: "1rem 0" }}>
        <label>
          Upload a log file: <input type="file" onChange={handleFileUpload} />
        </label>
      </div>

      {uploadStatus && <p>{uploadStatus}</p>}

      {fileName && (
        <>
          <h3 style={{ display: "flex", alignItems: "center" }}>
            📂 Previewing: <span style={{ marginLeft: "0.5rem" }}>{fileName}</span>
          </h3>
          <p>
            📊 Total Entries: <b>{levelCounts.total}</b> ✅ INFO: <b>{levelCounts.info}</b> ⚠️ WARNING: <b>{levelCounts.warning}</b> ❌ ERROR: <b>{levelCounts.error}</b>
          </p>
          <input
            type="text"
            placeholder="🔍 Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", borderRadius: "6px" }}
          />

          <div style={{ background: "#1f2937", padding: "1rem", borderRadius: "8px" }}>
            {filteredLogs.map((log) => (
              <pre key={log.id} style={{ margin: "0.5rem 0" }}>
                {levelBadge(log.level)} <span style={{ marginLeft: "0.5rem" }}>{log.line}</span>
              </pre>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
