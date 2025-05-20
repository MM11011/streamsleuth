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
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🕵️‍♂️ StreamSleuth – Log Inspector
        </h1>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Upload a log file:
        </label>
        <input
          type="file"
          accept=".log,.txt,.json"
          onChange={handleFileUpload}
          className="mb-4 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />

        {uploadStatus && (
          <p className={`text-sm mb-2 ${uploadStatus.startsWith("✅") ? "text-green-600" : "text-red-500"} font-semibold`}>
            {uploadStatus}
          </p>
        )}

        {fileName && (
          <>
            <p className="text-sm text-gray-500 mb-2">📄 Previewing: {fileName}</p>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔎 Search log contents..."
              className="mb-3 w-full p-2 text-sm border border-gray-300 rounded"
            />

            <textarea
              readOnly
              value={getHighlightedContent()}
              className="w-full h-96 font-mono text-sm p-3 border border-gray-300 rounded-md resize-none bg-gray-50 text-gray-800"
            ></textarea>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
