from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import csv
import io
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), log_format: str = Form(...)):
    content = await file.read()

    if log_format == "Data Classification (CSV)":
        try:
            decoded = content.decode("utf-8", errors="replace")
            reader = csv.DictReader(io.StringIO(decoded))
            cleaned_rows = []
            for row in reader:
                # Drop unwanted columns
                row.pop("Description", None)
                row.pop("Help_Text", None)

                # Check record condition (exact match for "0" or "0.0")
                record_val = row.get("#_of_Records", "").strip()
                if record_val in ("0", "0.0"):
                    cleaned_rows.append(row)

            return JSONResponse(content={"entries": cleaned_rows})
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})

    elif log_format == "Splunk (JSON)":
        try:
            decoded = content.decode("utf-8", errors="replace")
            lines = decoded.splitlines()
            parsed = [json.loads(line.strip()) for line in lines if line.strip()]
            return JSONResponse(content={"entries": parsed})
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})

    elif log_format == "Splunk (Raw)":
        try:
            decoded = content.decode("utf-8", errors="replace")
            lines = decoded.splitlines()
            parsed_lines = []
            for line in lines:
                parts = line.split(" ", 4)
                if len(parts) == 5:
                    timestamp, host, source_type, level, message = parts
                    parsed_lines.append({
                        "host": host.strip(),
                        "type": source_type.strip(),
                        "level": level.strip("[]"),
                        "message": message.strip()
                    })
                else:
                    parsed_lines.append({"message": line.strip()})
            return JSONResponse(content={"entries": parsed_lines})
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})

    else:
        decoded = content.decode("utf-8", errors="replace")
        lines = decoded.splitlines()
        return JSONResponse(content={"entries": lines})
