from fastapi import APIRouter, UploadFile, File
import os
import uuid

router = APIRouter()

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

@router.post("/upload")
async def upload_log(file: UploadFile = File(...)):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(DATA_DIR, f"{file_id}_{file.filename}")

    with open(file_path, "wb") as f:
        f.write(await file.read())

    return {"message": "File uploaded successfully", "filename": file.filename, "id": file_id}
