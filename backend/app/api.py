from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        # Save the uploaded file to disk (optional)
        with open(f"data/{file.filename}", "wb") as f:
            f.write(contents)
        
        return JSONResponse(content={"filename": file.filename})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
