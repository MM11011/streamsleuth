import React, { useState } from 'react';
import './index.css';

const logFormats = ['Generic', 'Apache/Nginx', 'Syslog', 'Splunk (Raw)', 'Splunk (JSON)'];

function App() {
  const [logFormat, setLogFormat] = useState('Generic');
  const [logFile, setLogFile] = useState(null);
  const [logLines, setLogLines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filename, setFilename] = useState('');

  const handleLogFormatChange = (e) => {
    setLogFormat(e.target.value);
    setLogLines([]);
    setLogFile(null);
    setFilename('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split('\n').filter(Boolean);
      setLogLines(lines);
    };
    reader.readAsText(file);
    setLogFile(file);
  };

  const highlightMatch = (line, term) => {
    if (!term) return line;
    const regex = new RegExp(`(${term})`, 'gi');
    return line.split(regex).map((chunk, i) =>
      chunk.toLowerCase() === term.toLowerCase() ? <mark key={i}>{chunk}</mark> : chunk
    );
  };

  const parseSplunkLine = (line, format) => {
    try {
      if (format === 'Splunk (JSON)') {
        const log = JSON.parse(line);
        return {
          host: log.host || 'unknown',
          type: log.type || 'event',
          message: log._raw || JSON.stringify(log),
        };
      }
      if (format === 'Splunk (Raw)') {
        const regex = /(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}.\d{3}) (\w+) (\w+) \[(\w+)] (.+)/;
        const match = line.match(regex);
        return {
          host: match?.[2] || 'host',
          type: match?.[3] || 'type',
          message: match?.[5] || line,
        };
      }
    } catch {
      return { host: 'invalid', type: 'invalid', message: line };
    }
  };

  const getSeverityCounts = () => {
    let info = 0, warning = 0, error = 0;
    logLines.forEach((line) => {
      const str = line.toLowerCase();
      if (str.includes('info')) info++;
      else if (str.includes('warn')) warning++;
      else if (str.includes('error')) error++;
    });
    return { info, warning, error };
  };

  const { info, warning, error } = getSeverityCounts();

  const filteredLogs = logLines.filter((line) =>
    line.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🕵️‍♂️ StreamSleuth</h1>
      <p>Log Inspector – Upload & Search Security Logs</p>

      <div className="controls">
        <label>Log Format:</label>
        <select value={logFormat} onChange={handleLogFormatChange}>
          {logFormats.map((format) => (
            <option key={format} value={format}>{format}</option>
          ))}
        </select>

        <label>Upload a log file:</label>
        <input type="file" onChange={handleFileUpload} />
      </div>

      {logFile && (
        <>
          <p className="status">✅ Uploaded as: <span className="success">{filename}</span></p>
          <p className="status">📂 Previewing: <strong>{filename}</strong></p>

          <div className="stats">
            📊 Total Entries: {logLines.length} ✅ INFO: {info} ⚠️ WARNING: {warning} ❌ ERROR: {error}
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="log-entries">
            {filteredLogs.map((line, idx) => {
              const parsed = ['Splunk (Raw)', 'Splunk (JSON)'].includes(logFormat)
                ? parseSplunkLine(line, logFormat)
                : { host: '', type: '', message: line };

              return (
                <div className="log-entry" key={idx}>
                  {parsed.host && (
                    <span className="chip">host: {parsed.host}</span>
                  )}
                  {parsed.type && (
                    <span className="chip">type: {parsed.type}</span>
                  )}
                  <span className="log-message">{highlightMatch(parsed.message, searchTerm)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
