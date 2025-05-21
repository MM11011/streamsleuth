import { useState } from "react";
import "./App.css";

function App() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [logFormat, setLogFormat] = useState("Generic");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
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

  const parseLogs = (content) => {
    const lines = content.split("\n");
    return lines.filter((line) => line.trim() !== "").map((line) => {
      const match = line.match(/(INFO|ERROR|WARNING)/i);
      const level = match ? match[1].toUpperCase() : "UNKNOWN";
      return { line, level };
    });
  };

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  const parsedLogs = parseLogs(fileContent);
  const filteredLogs = parsedLogs.filter((log) =>
    log.line.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const counts = parsedLogs.reduce(
    (acc, log) => {
      acc.total++;
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    },
    { total: 0, INFO: 0, WARNING: 0, ERROR: 0 }
  );

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        🕵️‍♂️ StreamSleuth
      </h1>
      <p className="text-zinc-400 mb-4 text-center">
        Log Inspector – Upload & Search Security Logs
      </p>

      <label className="mb-2">Log Format:</label>
      <select
        className="mb-4 p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
        value={logFormat}
        onChange={(e) => setLogFormat(e.target.value)}
      >
        <option>Generic</option>
        <option>Apache/Nginx</option>
        <option>Syslog</option>
        <option>Custom Regex</option>
      </select>

      <label className="mb-2">Upload a log file:</label>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileUpload}
        className="mb-2"
      />
      {uploadStatus && <p className="mb-2">{uploadStatus}</p>}

      {fileContent && (
        <>
          <h2 className="font-semibold mb-2 mt-4">
            📁 Previewing: <span className="text-white font-bold">{fileName}</span>
          </h2>
          <div className="text-sm mb-2">
            📊 Total Entries: {counts.total} {" "}
            ✅ INFO: {counts.INFO} ⚠️ WARNING: {counts.WARNING} ❌ ERROR: {counts.ERROR}
          </div>

          <input
            type="text"
            placeholder="🔍 Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 mb-4 w-full max-w-xl rounded bg-zinc-800 border border-zinc-600 text-white"
          />

          <div className="w-full max-w-3xl space-y-1 p-4 bg-zinc-800 rounded-lg">
            {filteredLogs.map((log, idx) => (
              <div key={idx} className="text-sm font-mono whitespace-pre-wrap">
                {log.level === "INFO" && <span className="text-green-400 font-bold mr-2">INFO</span>}
                {log.level === "WARNING" && <span className="text-yellow-400 font-bold mr-2">WARNING</span>}
                {log.level === "ERROR" && <span className="text-red-400 font-bold mr-2">ERROR</span>}
                {highlightMatch(log.line, searchTerm)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
