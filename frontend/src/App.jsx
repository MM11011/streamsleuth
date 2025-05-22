// src/App.jsx
import React, { useState } from "react";
import "./App.css";

function App() {
  const [logFormat, setLogFormat] = useState("Generic");
  const [fileName, setFileName] = useState("");
  const [logData, setLogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [headers, setHeaders] = useState([]); // ← new

  const handleFormatChange = (e) => {
    setLogFormat(e.target.value);
    setLogData([]);
    setFilteredData([]);
    setFileName("");
    setSearchTerm("");
    setHeaders([]); // clear keys
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
      setHeaders(data.headers || []); // ← capture headers
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.trim();
    setSearchTerm(term);

    if (!term) {
      setFilteredData(logData);
      return;
    }

    if (logFormat === "Data Classification (CSV)" && term.includes("=")) {
      const clauses = term.split(",").map(c => c.trim()).filter(Boolean);
      let filtered = [...logData];

      clauses.forEach(clause => {
        const [rawKey, rawVal] = clause.split("=").map(s => s.trim());
        if (!rawKey || !rawVal) return;
        const values = rawVal.split(/[,|]/).map(v => v.trim());
        filtered = filtered.filter(row => {
          const cell = (row[rawKey] ?? "").toString().trim();
          return values.includes(cell);
        });
      });

      setFilteredData(filtered);
      return;
    }

    const generic = logData.filter(entry =>
      JSON.stringify(entry).toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(generic);
  };

  const getStats = () => {
    if (logFormat === "Data Classification (CSV)") {
      return {
        info: filteredData.length,
        warning: 0,
        error: 0,
      };
    }
    let info = 0, warning = 0, error = 0;
    filteredData.forEach(entry => {
      if (typeof entry === "string") {
        if (entry.includes("INFO")) info++;
        else if (entry.includes("WARNING")) warning++;
        else if (entry.includes("ERROR")) error++;
      }
    });
    return { info, warning, error };
  };

  const handleDownload = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]);
    const csvRows = [headers.join(",")];
    filteredData.forEach(row => {
      const values = headers.map(h => {
        let val = (row[h] ?? "").toString().replace(/"/g, '""');
        if (val.includes(",") || val.includes("\n")) val = `"${val}"`;
        return val;
      });
      csvRows.push(values.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_results.csv";
    a.click();
    URL.revokeObjectURL(url);
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
        📊 Total Entries: {filteredData.length} ✅ INFO: {stats.info} ⚠️ WARNING: {stats.warning} ❌ ERROR: {stats.error}
      </div>

      <input
        type="text"
        placeholder={
          logFormat === "Data Classification (CSV)"
            ? "e.g. #_of_Records = 0, Sensitivity_Level = Confidential,Private"
            : "Search logs..."
        }
        value={searchTerm}
        onChange={handleSearch}
      />

      {logFormat === "Data Classification (CSV)" && filteredData.length > 0 && (
        <button onClick={handleDownload} style={{ marginTop: "1rem" }}>
          Download Filtered Results
        </button>
      )}

      {/* Sidebar with Filter Keys */}
      {headers.length > 0 && (
        <aside className="filter-reference">
          <h2>Filter Keys</h2>
          <ul>
            {headers.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </aside>
      )}

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
