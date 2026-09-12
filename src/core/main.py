import hjson # type: ignore
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from components.model import Model

app = FastAPI()

class UserQuery(BaseModel):
    prompt: str

with open("data/configs.hjson", "r", encoding="utf-8") as f:
    configs = hjson.load(f) # type: ignore

model = Model(str(configs["model"]), str(configs["system_prompt"])) # type: ignore

@app.get("/ask")
async def handle_query(data: UserQuery):
    try:
        return StreamingResponse(model.respond(data.prompt), media_type="text/plain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app=app, port=8000)