import { useState } from "react";

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
      setUploadStatus(`✅ Uploaded as: ${data.filename ?? "unknown file"}`);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus("❌ Upload failed");
    }
  };

  const getHighlightedContent = () => {
    if (!searchTerm) return fileContent;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    return fileContent.replace(regex, "🔍$1🔍");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          🕵️‍♂️ StreamSleuth – Log Inspector
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-300">
              Upload a log file:
            </label>
            <input
              type="file"
              accept=".log,.txt,.json"
              onChange={handleFileUpload}
              className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          {uploadStatus && (
            <p
              className={`text-sm font-medium ${
                uploadStatus.startsWith("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {uploadStatus}
            </p>
          )}

          {fileName && (
            <>
              <p className="text-sm text-gray-400">
                📄 Previewing: <strong>{fileName}</strong>
              </p>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search log content..."
                className="mt-2 mb-4 w-full p-2 rounded border border-gray-700 bg-gray-800 text-white placeholder-gray-400"
              />

              <pre className="h-[70vh] w-full overflow-y-scroll bg-black p-4 rounded-lg border border-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {getHighlightedContent()}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
