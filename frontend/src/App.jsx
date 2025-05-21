import React, { useState } from "react";
import "./App.css";

function App() {
  const [logFormat, setLogFormat] = useState("Generic");
  const [fileName, setFileName] = useState("");
  const [logData, setLogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFormatChange = (e) => {
    setLogFormat(e.target.value);
    setLogData([]);
    setFilteredData([]);
    setFileName("");
    setSearchTerm("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("log_format", logFormat);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const entries = data.entries || [];
      setLogData(entries);
      setFilteredData(entries);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredData(logData);
      return;
    }

    if (logFormat === "Data Classification (CSV)" && term.includes("=")) {
      const [key, value] = term.split("=").map((v) => v.trim());
      const filtered = logData.filter((row) =>
        row[key] && row[key].toString().trim() === value
      );
      setFilteredData(filtered);
    } else {
      const filtered = logData.filter((entry) =>
        JSON.stringify(entry).toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const getStats = () => {
    if (logFormat === "Data Classification (CSV)") {
      return {
        info: filteredData.length,
        warning: 0,
        error: 0,
      };
    }

    let info = 0,
      warning = 0,
      error = 0;

    filteredData.forEach((entry) => {
      if (typeof entry === "string") {
        if (entry.includes("INFO")) info++;
        else if (entry.includes("WARNING")) warning++;
        else if (entry.includes("ERROR")) error++;
      }
    });

    return { info, warning, error };
  };

  const stats = getStats();

  return (
    <div className="container">
      <h1>🕵️‍♂️ StreamSleuth</h1>
      <p>Log Inspector – Upload & Search Security Logs</p>

      <label>Log Format:</label>
      <select value={logFormat} onChange={handleFormatChange}>
        <option>Generic</option>
        <option>Apache/Nginx</option>
        <option>Splunk (Raw)</option>
        <option>Splunk (JSON)</option>
        <option>Data Classification (CSV)</option>
      </select>

      <div>
        <label>Upload a log file:</label>
        <input type="file" onChange={handleFileUpload} />
      </div>

      {fileName && (
        <>
          <p style={{ color: "limegreen" }}>
            ✅ Uploaded as: <strong>{fileName}</strong>
          </p>
          <p style={{ color: "#ccc" }}>
            📂 Previewing: <em>{fileName}</em>
          </p>
        </>
      )}

      <div className="stats">
        📊 Total Entries: {filteredData.length} ✅ INFO: {stats.info} ⚠️
        WARNING: {stats.warning} ❌ ERROR: {stats.error}
      </div>

      <input
        type="text"
        placeholder={
          logFormat === "Data Classification (CSV)"
            ? "e.g. #_of_Records = 0"
            : "Search logs..."
        }
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="log-list">
        {filteredData.map((entry, i) => (
          <div key={i} className="log-line">
            <pre>{JSON.stringify(entry, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
