import React, { useState } from "react";
import "./App.css";

function App() {
  const [logFormat, setLogFormat] = useState("Generic");
  const [fileName, setFileName] = useState("");
  const [logData, setLogData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [headers, setHeaders] = useState([]);

  const handleFormatChange = (e) => {
    setLogFormat(e.target.value);
    setFileName("");
    setLogData([]);
    setFilteredData([]);
    setSearchTerm("");
    setHeaders([]);
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
      let entries = data.entries || [];

      // For Generic & Apache, wrap each line in { message }
      if (logFormat === "Generic" || logFormat === "Apache/Nginx") {
        entries = entries.map(line => ({ message: line }));
        setHeaders(["message"]);
      }
      // For Splunk Raw/JSON, compute keys dynamically
      else if (logFormat === "Splunk (Raw)" || logFormat === "Splunk (JSON)") {
        const keySet = new Set();
        entries.forEach(e => {
          if (e && typeof e === "object") {
            Object.keys(e).forEach(k => keySet.add(k));
          }
        });
        setHeaders(Array.from(keySet));
      }
      // For CSV, use provided headers
      else if (logFormat === "Data Classification (CSV)") {
        setHeaders(data.headers || []);
      }

      setLogData(entries);
      setFilteredData(entries);
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

    // only these formats support chained filters
    const structured = [
      "Data Classification (CSV)",
      "Splunk (Raw)",
      "Splunk (JSON)"
    ];
    if (term.includes("=") && structured.includes(logFormat)) {
      const clauses = term.split(",").map(c => c.trim()).filter(Boolean);
      let filtered = [...logData];

      clauses.forEach(clause => {
        const [key, val] = clause.split("=").map(s => s.trim());
        if (!key || !val) return;
        const vals = val.split(/[,|]/).map(v => v.trim());
        filtered = filtered.filter(row => {
          const cell = (row[key] ?? "").toString().trim();
          return vals.includes(cell);
        });
      });

      setFilteredData(filtered);
      return;
    }

    // generic substring search on entire object or message
    const lower = term.toLowerCase();
    const generic = logData.filter(entry => {
      if (typeof entry === "object") {
        return JSON.stringify(entry).toLowerCase().includes(lower);
      }
      return entry.toString().toLowerCase().includes(lower);
    });
    setFilteredData(generic);
  };

  const getStats = () => {
    if (logFormat === "Data Classification (CSV)") {
      return { info: filteredData.length, warning: 0, error: 0 };
    }
    let info = 0, warning = 0, error = 0;
    filteredData.forEach(entry => {
      const msg = typeof entry === "object" ? JSON.stringify(entry) : entry;
      if (msg.includes("INFO")) info++;
      if (msg.includes("WARNING")) warning++;
      if (msg.includes("ERROR")) error++;
    });
    return { info, warning, error };
  };

  const handleDownload = () => {
    if (logFormat !== "Data Classification (CSV)" || !filteredData.length) return;
    const cols = Object.keys(filteredData[0]);
    const rows = [cols.join(",")];
    filteredData.forEach(row => {
      const vals = cols.map(h => {
        let v = (row[h] ?? "").toString().replace(/"/g,'""');
        if (v.includes(",") || v.includes("\n")) v = `"${v}"`;
        return v;
      });
      rows.push(vals.join(","));
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "filtered_results.csv";
    a.click(); URL.revokeObjectURL(url);
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
          <p style={{ color:"limegreen" }}>✅ Uploaded as: <strong>{fileName}</strong></p>
          <p style={{ color:"#ccc" }}>📂 Previewing: <em>{fileName}</em></p>
        </>
      )}

      <div className="stats">
        📊 Total: {filteredData.length} | INFO: {stats.info} | ⚠️ {stats.warning} | ❌ {stats.error}
      </div>

      <input
        type="text"
        placeholder={
          logFormat === "Data Classification (CSV)"
            ? "e.g. #_of_Records = 0, Sensitivity_Level = Confidential"
            : "Search logs..."
        }
        value={searchTerm}
        onChange={handleSearch}
      />

      {logFormat==="Data Classification (CSV)" && filteredData.length>0 && (
        <button onClick={handleDownload} style={{marginTop:"1rem"}}>
          Download Filtered Results
        </button>
      )}

      {headers.length>0 && (
        <aside className="filter-reference">
          <h2>Filter Keys</h2>
          <ul>
            {headers.map(h => <li key={h}>{h}</li>)}
          </ul>
        </aside>
      )}

      <div className="log-list">
        {filteredData.map((entry,i)=>
          <div key={i} className="log-line">
            { typeof entry==="object"
              ? <pre>{JSON.stringify(entry,null,2)}</pre>
              : <pre>{entry}</pre> }
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
