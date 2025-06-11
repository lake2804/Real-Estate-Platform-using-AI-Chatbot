from sentence_transformers import SentenceTransformer
import faiss
import json
import os
import numpy as np
import re

# Đọc nội dung từ file
file_path = "../BTTH2_code/output.txt"
with open(file_path, "r", encoding="utf-8") as file:
    text = file.read()


def chunk_by_chapter_and_article(text):
    # Tìm tất cả chương với vị trí bắt đầu
    chapter_matches = list(re.finditer(r"(Chương\s+[IVXLCDM]+.*?)\n", text))
    chunks = []

    for idx, match in enumerate(chapter_matches):
        chapter_title = match.group(1).strip()
        start_pos = match.end()

        # Xác định đoạn văn của chương hiện tại
        end_pos = chapter_matches[idx + 1].start() if idx + 1 < len(chapter_matches) else len(text)
        chapter_text = text[start_pos:end_pos].strip()

        # Tách theo Điều trong chương
        raw_chunks = re.split(r"(Điều\s+\d+\..*?)\n", chapter_text)
        for i in range(1, len(raw_chunks), 2):
            tieu_de = raw_chunks[i].strip()
            noi_dung = raw_chunks[i + 1].strip() if i + 1 < len(raw_chunks) else ""
            chunks.append({
                "chuong": chapter_title,
                "tieu_de": tieu_de,
                "noi_dung": noi_dung
            })

    return chunks


# 1. Load model
model = SentenceTransformer('all-MiniLM-L6-v2')  # nhẹ và nhanh

# 2. Chuyển chunk thành văn bản cho embedding
def convert_chunks_to_text(chunks):
    return [
        f"{chunk['chuong']}\n{chunk['tieu_de']}\n{chunk['noi_dung']}"
        for chunk in chunks
    ]

# 3. Tạo embedding
def embed_chunks(chunks, model):
    texts = convert_chunks_to_text(chunks)
    embeddings = model.encode(texts, show_progress_bar=True)
    return np.array(embeddings).astype("float32")  # FAISS yêu cầu float32

# 4. Lưu FAISS index + metadata
def save_faiss_index(embeddings, chunks, index_path="faiss_index"):
    # FAISS index
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    # Tạo thư mục nếu chưa có
    os.makedirs(index_path, exist_ok=True)

    # Lưu index
    faiss.write_index(index, os.path.join(index_path, "index.faiss"))

    # Lưu metadata để mapping kết quả tìm kiếm
    with open(os.path.join(index_path, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)


chunks = chunk_by_chapter_and_article(text)
embeddings = embed_chunks(chunks, model)
save_faiss_index(embeddings, chunks)

'''# In kết quả từng chunk
for idx, chunk in enumerate(chunks, 1):
    print(f"--- Chunk {idx} ---")
    print(f"Chương: {chunk['chuong']}")
    print(f"{chunk['tieu_de']}")
    print(f"{chunk['noi_dung']}\n")

max_chunk = max(chunks, key=lambda c: len(c["noi_dung"]))

print("====== Chunk có nội dung dài nhất ======")
print(f"Chương: {max_chunk['chuong']}")
print(f"{max_chunk['tieu_de']}")
print(f"Độ dài nội dung: {len(max_chunk['noi_dung'])} ký tự")
print(f"Nội dung:\n{max_chunk['noi_dung']}")    '''
