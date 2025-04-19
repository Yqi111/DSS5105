import os
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
# 修改导入路径，使其直接导入sentiment_processor
from app.sentiment_processor import process_esg_report

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


from fastapi import HTTPException

@app.post("/upload-esg")
async def upload_esg(file: UploadFile = File(...)):
    try:
        print("🟢 Received file:", file.filename)

        file_extension = file.filename.split('.')[-1]
        file_id = str(uuid.uuid4())
        saved_path = f"temp_uploads/{file_id}.{file_extension}"

        os.makedirs("temp_uploads", exist_ok=True)

        with open(saved_path, "wb") as f_out:
            f_out.write(await file.read())

        print("📄 Saved file to:", saved_path)

        # 直接使用导入的函数
        result = process_esg_report(saved_path)

        print("✅ Result computed:", result)

        return {
            "company": file.filename.replace(".pdf", ""),
            "weighted_avg_polarity": result["weighted_avg_polarity"],
            "environment_score": result["esg_polarity_scores"]["Environment"],
            "social_score": result["esg_polarity_scores"]["Social"],
            "governance_score": result["esg_polarity_scores"]["Governance"],
        }

    except Exception as e:
        print("❌ Backend error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))