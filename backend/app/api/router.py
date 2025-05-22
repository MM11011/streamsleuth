from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import csv
import io
import os

# Initialize router
router = APIRouter()

@router.post("/parse")
async def parse_file(file: UploadFile = File(...)):
    """
    Parses the uploaded CSV, filters rows where #_of_Records == "0",
    and writes the filtered data to a CSV file for download.
    """
    contents = await file.read()
    decoded = contents.decode("utf-8")

    reader = csv.DictReader(io.StringIO(decoded))
    cleaned_data = []

    # Remove unwanted columns and apply filter
    for row in reader:
        row.pop("Description", None)
        row.pop("Help_Text", None)
        if row.get("#_of_Records", "").strip() == "0":
            cleaned_data.append(row)

    # Write filtered results to CSV on disk
    output_path = os.path.join(os.getcwd(), 'filtered_output.csv')
    if cleaned_data:
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=cleaned_data[0].keys())
            writer.writeheader()
            writer.writerows(cleaned_data)

    return {"logs": cleaned_data}

@router.get("/download")
async def download_filtered_csv():
    """
    Serves the previously filtered CSV file for download.
    """
    file_path = os.path.join(os.getcwd(), 'filtered_output.csv')
    if os.path.exists(file_path):
        return FileResponse(
            path=file_path,
            filename="filtered_results.csv",
            media_type="text/csv"
        )
    return {"error": "Filtered CSV not found"}
