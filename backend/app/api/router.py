from fastapi import APIRouter, UploadFile, File
import csv
import io

router = APIRouter()

@router.post("/parse")
async def parse_file(file: UploadFile = File(...)):
    contents = await file.read()
    decoded = contents.decode("utf-8")

    # Remove problematic Description/Help_Text columns
    reader = csv.DictReader(io.StringIO(decoded))
    cleaned_data = []
    for row in reader:
        row.pop("Description", None)
        row.pop("Help_Text", None)

        if row.get("#_of_Records", "").strip() == "0":
            cleaned_data.append(row)

    return {"logs": cleaned_data}
