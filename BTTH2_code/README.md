# Hướng dẫn chạy API RAG

## 1. Cài Python 3.8+ và pip

## 2. Cài các thư viện cần thiết
```bash
pip install -r requirements.txt
```

## 3. Cài và chạy Ollama (LLM local)
- Tải Ollama tại: https://ollama.com/download
- Sau khi cài xong, mở terminal mới và chạy:
```bash
ollama run mistral
```

## 4. Chạy API FastAPI
```bash
uvicorn rag_api:app --reload
```

## 5. Gửi request thử nghiệm
Ví dụ với Python:
```python
import requests
data = {
    "question": "Nếu người dân được cấp Giấy chứng nhận quyền sử dụng đất, thì có nghĩa là họ sở hữu mảnh đất đó — đúng hay sai? Vì sao?",
    "top_k": 3
}
response = requests.post("http://localhost:8000/rag", json=data)
print(response.json())
```

## 6. Yêu cầu kèm theo
- Gửi kèm thư mục `faiss_index/` gồm `index.faiss` và `metadata.json`
- Nếu dùng model local khác, gửi kèm file model hoặc hướng dẫn tải