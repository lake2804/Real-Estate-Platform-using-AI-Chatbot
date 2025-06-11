from docx import Document

# Đọc file .docx
doc = Document('../BTTH2_code/VanBan.docx')  # Thay 'input.docx' bằng tên file của bạn

# Ghi nội dung vào file .txt với mã hóa UTF-8
with open('output.txt', 'w', encoding='utf-8') as f:
    for para in doc.paragraphs:
        f.write(para.text + '\n')