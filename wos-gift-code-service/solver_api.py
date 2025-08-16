from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import uvicorn
from gift_captchasolver import GiftCaptchaSolver

app = FastAPI(title="Gift Captcha Solver API")

# Initialize solver once
solver = GiftCaptchaSolver(save_images=0)

@app.post("/solve")
async def solve(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        text, success, method, confidence, _ = await solver.solve_captcha(image_bytes)

        return JSONResponse({
            "text": text,
            "success": success,
            "method": method,
            "confidence": confidence
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run("solver_api:app", host="0.0.0.0", port=5001, reload=True)
