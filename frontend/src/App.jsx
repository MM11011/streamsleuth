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

  // New function to download filteredData as CSV
  const handleDownload = () => {
    if (filteredData.length === 0) return;

    // Derive headers from first row
    const headers = Object.keys(filteredData[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    filteredData.forEach((row) => {
      const values = headers.map((h) => {
        let val = row[h] ?? '';
        val = val.toString().replace(/"/g, '""');
        if (val.includes(',') || val.includes('\n')) val = `"${val}"`;
        return val;
      });
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_results.csv';
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
            ? "e.g. #_of_Records = 0"
            : "Search logs..."
        }
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Download button for filtered CSV */}
      {logFormat === "Data Classification (CSV)" && filteredData.length > 0 && (
        <button onClick={handleDownload} style={{ marginTop: '1rem' }}>
          Download Filtered Results
        </button>
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
