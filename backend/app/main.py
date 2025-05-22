# backend/app/main.py

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import io, csv, json

from app.api.csv_parser import parse_data_classification_csv

app = FastAPI()

# Enable CORS so your React UI can talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    log_format: str = Form(...),
    filter_query: str = Form("")
):
    contents = await file.read()
    decoded = contents.decode("utf-8")

    # 1) Data Classification (CSV)
    if log_format == "Data Classification (CSV)":
        filter_field, filter_value = None, None
        if "=" in filter_query:
            filter_field, filter_value = [x.strip() for x in filter_query.split("=", 1)]
        parsed, headers = parse_data_classification_csv(decoded, filter_field, filter_value)
        return JSONResponse(content={"entries": parsed, "headers": headers})

    # 2) Splunk (JSON)
    if log_format == "Splunk (JSON)":
        parsed = []
        for line in decoded.splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                parsed.append(json.loads(line))
            except json.JSONDecodeError:
                # skip bad lines
                continue
        return JSONResponse(content={"entries": parsed, "headers": []})

    # 3) Splunk (Raw)
    if log_format == "Splunk (Raw)":
        parsed = []
        for line in decoded.splitlines():
            parts = line.split(" ", 4)
            if len(parts) == 5:
                parsed.append({
                    "timestamp": parts[0].strip(),
                    "host": parts[1].strip(),
                    "source_type": parts[2].strip(),
                    "level": parts[3].strip("[]"),
                    "message": parts[4].strip(),
                })
            else:
                parsed.append({"message": line})
        return JSONResponse(content={"entries": parsed, "headers": []})

    # 4) Apache/Nginx (treat as free‐form lines)
    if log_format == "Apache/Nginx":
        lines = decoded.splitlines()
        parsed = [{"message": l} for l in lines]
        return JSONResponse(content={"entries": parsed, "headers": []})

    # 5) Generic logs (free‐form)
    # Fallback for any other format
    lines = decoded.splitlines()
    parsed = [{"message": l} for l in lines]
    return JSONResponse(content={"entries": parsed, "headers": []})


@app.post("/export")
async def export_filtered_csv(
    file: UploadFile = File(...),
    log_format: str = Form(...),
    filter_query: str = Form("")
):
    contents = await file.read()
    decoded = contents.decode("utf-8")

    # Only CSV export
    if log_format == "Data Classification (CSV)":
        filter_field, filter_value = None, None
        if "=" in filter_query:
            filter_field, filter_value = [x.strip() for x in filter_query.split("=", 1)]
        rows, headers = parse_data_classification_csv(decoded, filter_field, filter_value)

        # Build in-memory CSV
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
        output.seek(0)

        return StreamingResponse(
            iter([output.read()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=filtered_export.csv"}
        )

    return JSONResponse(content={"message": "Export is only available for CSV format"})
