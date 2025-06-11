# rag_api.py
import time
import json
import faiss
import numpy as np
import requests
from fastapi import FastAPI, Request
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

# Load BGE M3 model
print("🔁 Loading BGE-M3 model...")
model = SentenceTransformer("BAAI/bge-m3")
embedding_dim = model.get_sentence_embedding_dimension()

# Load FAISS index & metadata
print("🔁 Loading FAISS index and metadata...")
index = faiss.read_index("../BTTH2_code/faiss_index/index.faiss")
with open("../BTTH2_code/faiss_index/metadata.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

# FastAPI init
app = FastAPI()

# Pydantic schema cho input
class QueryRequest(BaseModel):
    question: str
    top_k: int = 3  # số kết quả trả về, mặc định là 3

def input_gen(text: str, question: str) -> str:
    return (
        f"Dưới đây là một đoạn văn bản luật được trích ra từ tài liệu:\n{text}\n"
        f"Câu hỏi của người dùng:\n'{question}'\n"
        "Dựa trên nội dung trong đoạn văn bản ở trên, hãy đóng vai một chuyên gia pháp lý, "
        "am hiểu sâu về Luật Đất đai Việt Nam năm 2013. Trả lời câu hỏi của người dùng dựa trên đoạn luật được cung cấp, "
        "đảm bảo đúng ngữ cảnh, ngôn ngữ pháp lý rõ ràng, dễ hiểu. Yêu cầu trích dẫn phải bao gồm theo 'luật đất đai 2013', chương và điều. "
        "Nếu không tìm thấy thông tin phù hợp, hãy trả lời 'Không tìm thấy thông tin trong đoạn trích.'"
    )

def call_ollama(prompt: str, model: str = "mistral", max_tokens: int = 200) -> str:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {"num_predict": max_tokens}
        }
    )
    return response.json()["response"]

@app.post("/rag")
def rag_query(req: QueryRequest):
    start = time.time()

    # Encode câu hỏi (chuẩn cú pháp BGE)
    query_text = f"query: {req.question}"
    query_embedding = model.encode(query_text, normalize_embeddings=True)
    query_embedding = np.array([query_embedding], dtype="float32")

    # Search FAISS
    D, I = index.search(query_embedding, req.top_k)
    results = []

    text = ""
    for i in I[0]:
        if i < len(metadata):
            m = metadata[i]
            results.append({
                "chuong": m.get("chuong", ""),
                "tieu_de": m.get("tieu_de", ""),
                "noi_dung": m.get("noi_dung", "")
            })
            text += m.get("chuong", "")
            text += m.get("tieu_de", "")
            text += m.get("noi_dung", "")
            text += "\n"

    # Gọi LLM local để sinh câu trả lời
    t_llm = time.time()
    answer = call_ollama(input_gen(text, req.question))
    llm_time = round(time.time() - t_llm, 3)

    return {
        "question": req.question,
        "top_k_chunks": results,
        "answer": answer,
        "response_time": round(time.time() - start, 3),
        "llm_time": llm_time
    }
