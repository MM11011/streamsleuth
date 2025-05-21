from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import io
from .api.csv_parser import parse_data_classification_csv

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), log_format: str = Form(...), filter_query: str = Form("")):
    contents = await file.read()

    if log_format == "Data Classification (CSV)":
        # Parse CSV with optional filter
        filter_field, filter_value = None, None
        if "=" in filter_query:
            filter_field, filter_value = [x.strip() for x in filter_query.split("=", 1)]

        parsed, headers = parse_data_classification_csv(contents.decode("utf-8"), filter_field, filter_value)
        return JSONResponse(content={"entries": parsed, "headers": headers})
    
    return JSONResponse(content={"entries": []})

@app.post("/export")
async def export_filtered_csv(file: UploadFile = File(...), log_format: str = Form(...), filter_query: str = Form("")):
    contents = await file.read()

    if log_format == "Data Classification (CSV)":
        filter_field, filter_value = None, None
        if "=" in filter_query:
            filter_field, filter_value = [x.strip() for x in filter_query.split("=", 1)]

        rows, headers = parse_data_classification_csv(contents.decode("utf-8"), filter_field, filter_value)

        # Generate CSV in-memory
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

        output.seek(0)
        return StreamingResponse(iter([output.read()]), media_type="text/csv", headers={
            "Content-Disposition": f"attachment; filename=filtered_export.csv"
        })

    return JSONResponse(content={"message": "Invalid format"})
