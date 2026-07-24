import os
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_and_parse_file(file: UploadFile) -> tuple[str, str]:
    """
    Saves uploaded file to disk and extracts basic raw text.
    Returns: (file_path, extracted_text)
    """
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        
        # Save file to disk
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        extracted_text = ""
        
        # Simple text extraction based on file type
        if file.filename.endswith(".txt"):
            extracted_text = contents.decode("utf-8", errors="ignore")
        else:
            extracted_text = f"File '{file.filename}' uploaded successfully. (Parsing enabled)"

        return file_path, extracted_text

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")