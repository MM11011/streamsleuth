import React, { useState } from "react";

function App() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredContent = fileContent
    .split("\n")
    .filter((line) => line.toLowerCase().includes(searchTerm.toLowerCase()))
    .join("\n");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-5xl font-bold mb-1">🕵️ StreamSleuth</h1>
          <p className="text-gray-400 text-lg">
            Log Inspector – Upload & Search Security Logs
          </p>
        </header>

        {/* Upload */}
        <section className="space-y-4">
          <label className="block text-lg font-medium">
            Upload a log file:
            <input
              type="file"
              accept=".txt,.json"
              onChange={handleFileUpload}
              className="mt-2 bg-gray-800 border border-gray-700 px-4 py-2 rounded-md w-full max-w-md"
            />
          </label>

          {uploadStatus && (
            <p
              className={`text-base font-medium ${
                uploadStatus.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {uploadStatus}
            </p>
          )}
        </section>

        {/* Preview and Search */}
        {fileContent && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              📁 Previewing: <span className="text-white">{fileName}</span>
            </h2>

            <input
              type="text"
              placeholder="🔍 Search logs (e.g., root, IP, login)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="w-full border border-gray-700 rounded-md bg-black">
              <pre
                className="w-full h-[600px] overflow-y-scroll text-sm p-6 font-mono whitespace-pre-wrap"
                style={{ resize: "none" }}
              >
                {filteredContent}
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
