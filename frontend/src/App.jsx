import { useState } from "react";

function App() {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null);

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
      setUploadStatus({ success: true, message: `✅ Uploaded as: ${data.filename || "unknown file"}` });
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadStatus({ success: false, message: "❌ Upload failed" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center flex items-center gap-2">
        🕵️‍♂️ <span>StreamSleuth – Log Inspector</span>
      </h1>

      <div className="w-full max-w-2xl bg-zinc-800 p-6 rounded-xl shadow-lg">
        <label className="block text-lg font-medium mb-3">
          Upload a log file:
          <input
            type="file"
            accept=".txt,.log,.json"
            onChange={handleFileUpload}
            className="mt-2 w-full p-2 bg-zinc-700 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        {uploadStatus && (
          <p
            className={`mt-4 p-2 rounded-lg font-medium ${
              uploadStatus.success
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {uploadStatus.message}
          </p>
        )}

        {fileContent && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              📁 Previewing: <span className="font-mono text-blue-300">{fileName}</span>
            </h2>
            <textarea
              className="w-full h-64 md:h-80 p-4 bg-zinc-950 text-green-300 font-mono text-sm rounded-lg resize-none border border-zinc-700"
              value={fileContent}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
