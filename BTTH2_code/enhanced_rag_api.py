from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import uuid
from datetime import datetime
import logging
import os

# Simple logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Real Estate RAG Chatbot API", version="1.0.0")

# Simple CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ChatRequest(BaseModel):
    message: Optional[str] = None
    query: Optional[str] = None  # Support both message and query
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

    # Custom validation to ensure at least message or query is provided
    def model_post_init(self, __context):
        if not self.message and not self.query:
            raise ValueError("Either 'message' or 'query' field is required")
        # Use query if message is not provided
        if not self.message and self.query:
            self.message = self.query
        # Use message if query is not provided  
        if not self.query and self.message:
            self.query = self.message

class ChatResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str
    active_conversations: int

# In-memory conversation storage
conversations = {}

# Real estate knowledge base
REAL_ESTATE_KNOWLEDGE = {
    "greetings": {
        "keywords": ["xin chào", "hello", "hi", "chào", "xin", "chao", "hey"],
        "response": """
👋 **Xin chào! Tôi là AI Assistant chuyên về bất động sản.**

🎯 **Tôi có thể giúp bạn:**
🏠 Tìm kiếm căn hộ, nhà đất phù hợp
💰 Tư vấn giá cả và xu hướng thị trường
🏗️ Thông tin các dự án mới nhất
📋 Hướng dẫn thủ tục mua bán
📈 Phân tích cơ hội đầu tư

**Câu hỏi phổ biến:**
• "Giá nhà khu vực Quận 7 như thế nào?"
• "Dự án nào đang mở bán tốt nhất?"
• "Tư vấn mua căn hộ đầu tư với 3 tỷ"

💬 **Bạn quan tâm về điều gì? Hãy hỏi tôi nhé!**
        """,
        "confidence": 0.95
    },
    
    "prices": {
        "keywords": ["giá", "price", "bán", "mua", "cost", "money", "tiền", "bao nhiêu"],
        "response": """
💰 **Bảng giá bất động sản TP.HCM cập nhật 2024:**

**🏢 CĂN HỘ CHUNG CƯ:**
• **Quận 1, 3:** 80-150 triệu/m² (trung tâm)
• **Quận 2, 7:** 50-90 triệu/m² (phát triển)
• **Quận 9, Thủ Đức:** 35-65 triệu/m² (tiềm năng)
• **Các quận khác:** 25-50 triệu/m²

**🏠 NHÀ RIÊNG/BIỆT THỰ:**
• **Trung tâm:** 200-500 triệu/m²
• **Ngoại thành:** 100-200 triệu/m²

**📈 XU HƯỚNG Q4/2024:**
✅ Giá tăng nhẹ 5-8%/năm
✅ Khu Đông phát triển mạnh
✅ Cung thiếu, cầu tăng ở phân khúc trung cấp

*Bạn muốn tìm hiểu giá ở khu vực nào cụ thể?*
        """,
        "confidence": 0.92
    },
    
    "projects": {
        "keywords": ["dự án", "project", "chung cư", "vinhomes", "masteri", "apartment", "khu đô thị"],
        "response": """
🏗️ **TOP dự án HOT đang mở bán 2024:**

**🌟 VINHOMES GRAND PARK - Q9**
💰 Giá: 38-55 triệu/m²
🏗️ Tiến độ: Đã bàn giao 70%
✨ Ưu điểm: Công viên 36ha, trường quốc tế, Metro Line 1

**🌟 MASTERI CENTRE POINT - Q9**
💰 Giá: 45-62 triệu/m²
🏗️ Tiến độ: Hoàn thiện Q2/2025
✨ Ưu điểm: View sông Sài Gòn, gần TTTM

**🌟 THE METROPOLE THỦ THIÊM - Q2**
💰 Giá: 85-140 triệu/m²
🏗️ Tiến độ: Mở bán Q1/2025
✨ Ưu điểm: Hạng sang, view Landmark 81

**🌟 ECOPARK HẢI DƯƠNG**
💰 Giá: 25-40 triệu/m²
🏗️ Tiến độ: Nhiều phân khu đã hoàn thiện
✨ Ưu điểm: Thành phố xanh, giá hợp lý

*Bạn quan tâm dự án nào? Tôi sẽ tư vấn chi tiết!*
        """,
        "confidence": 0.90
    },
    
    "investment": {
        "keywords": ["đầu tư", "investment", "tư vấn", "nên mua", "recommend", "suggest", "lời khuyên"],
        "response": """
📊 **CHIẾN LƯỢC ĐẦU TƯ BĐS 2024:**

**🎯 KHU VỰC TIỀM NĂNG:**
🔥 **Khu Đông (Q2, Q9, Thủ Đức):** +12-15%/năm
• Metro Line 1 đi vào hoạt động
• Nhiều dự án lớn hoàn thiện
• Giá còn hợp lý so với trung tâm

🔥 **Khu Nam (Q7, Nhà Bè):** +8-10%/năm
• Hạ tầng hoàn thiện
• Thanh khoản cao
• Phù hợp đầu tư cho thuê

**💡 NGUYÊN TẮC VÀNG:**
✅ **Vị trí > Giá cả:** Ưu tiên khu vực phát triển
✅ **Pháp lý rõ ràng:** Sổ hồng, chủ đầu tư uy tín
✅ **Tài chính an toàn:** Vay tối đa 70%
✅ **Đa dạng hóa:** Không đặt hết trứng vào 1 giỏ

**🎯 THEO NGÂ TRƯỚC:**
💰 **Dưới 2 tỷ:** Căn hộ Q9, Thủ Đức
💰 **2-4 tỷ:** Căn hộ Q2, Q7 hoặc nhà Q12, Gò Vấp
💰 **Trên 5 tỷ:** Căn hộ trung tâm hoặc biệt thự

*Bạn có bao nhiêu vốn? Tôi sẽ tư vấn cụ thể!*
        """,
        "confidence": 0.88
    },
    
    "rental": {
        "keywords": ["thuê", "rent", "cho thuê", "rental", "lease"],
        "response": """
🏠 **THỊ TRƯỜNG CHO THUÊ TP.HCM 2024:**

**💰 BẢNG GIÁ THUÊ (triệu/tháng):**

**🏢 CĂN HỘ CHUNG CƯ:**
• **Studio/1PN:** 8-20 triệu
• **2PN:** 15-35 triệu
• **3PN:** 25-50 triệu
• **Penthouse:** 50-150 triệu

**🏠 NHÀ RIÊNG:**
• **Nhà cấp 4:** 10-25 triệu
• **Nhà 1 trệt 1 lầu:** 20-40 triệu
• **Biệt thự:** 50-200 triệu

**🔥 KHU VỰC HOT CHO THUÊ:**
📍 **Q1, Q3:** Giá cao, dễ cho thuê (văn phòng)
📍 **Q2, Q7:** Cân bằng giá-chất lượng
📍 **Q9, Thủ Đức:** Giá tốt, nhiều lựa chọn

**💡 TIPS CHO THUÊ NHANH:**
✅ Giá cạnh tranh (-5% so với thị trường)
✅ Hình ảnh đẹp, mô tả chi tiết
✅ Đăng đa kênh: Batdongsan.com.vn, Chotot, Facebook

*Bạn muốn cho thuê hay tìm thuê?*
        """,
        "confidence": 0.86
    },
    
    "legal": {
        "keywords": ["pháp lý", "legal", "sổ hồng", "thủ tục", "giấy tờ", "hợp đồng"],
        "response": """
📋 **HƯỚNG DẪN THỦ TỤC MỊA BÁN NHÀ:**

**📄 GIẤY TỜ CẦN THIẾT:**
✅ **Bên bán:**
• Sổ hồng/sổ đỏ gốc
• CMND/CCCD
• Giấy chứng nhận độc thân/kết hôn
• Giấy ủy quyền (nếu có)

✅ **Bên mua:**
• CMND/CCCD
• Hộ khẩu (nếu cần)
• Chứng minh thu nhập (vay ngân hàng)

**⚖️ CÁC BƯỚC THỰC HIỆN:**
1️⃣ **Thỏa thuận:** Giá cả, thời gian
2️⃣ **Đặt cọc:** 50-200 triệu (tùy giá trị)
3️⃣ **Thẩm định:** Pháp lý, giá trị
4️⃣ **Ký hợp đồng:** Tại công chứng
5️⃣ **Thanh toán:** Chuyển tiền, bàn giao
6️⃣ **Làm sổ:** Nộp hồ sơ sang tên

**⏰ THỜI GIAN XỬ LÝ:**
• Làm sổ hồng mới: 15-30 ngày
• Phí sang tên: 0.5-1% giá trị

*Bạn cần hỗ trợ thủ tục nào cụ thể?*
        """,
        "confidence": 0.84
    }
}

def find_best_match(query: str) -> Dict[str, Any]:
    """Find best matching response from knowledge base"""
    query_lower = query.lower().strip()
    
    logger.info(f"🔍 Searching for: '{query_lower}'")
    
    # Check each category
    best_match = None
    best_score = 0
    
    for category, data in REAL_ESTATE_KNOWLEDGE.items():
        score = 0
        for keyword in data["keywords"]:
            if keyword in query_lower:
                score += 1
        
        if score > best_score:
            best_score = score
            best_match = {
                "category": category,
                "response": data["response"].strip(),
                "confidence": data["confidence"],
                "sources": [f"Knowledge Base - {category.title()}"]
            }
            logger.info(f"✅ Match found: {category} (score={score})")
    
    if best_match:
        logger.info(f"🎯 Best match: {best_match['category']} with confidence {best_match['confidence']}")
        return best_match
    
    # Default response
    logger.info("🤔 No specific match found, using default response")
    return {
        "category": "default",
        "response": """
🤔 **Tôi chưa hiểu rõ câu hỏi của bạn.**

**🏠 CÁC CHỦ ĐỀ TÔI CÓ THỂ HỖ TRỢ:**

📊 **Thông tin thị trường:** "Giá nhà Quận 7", "Xu hướng 2024"
🏗️ **Dự án BĐS:** "Dự án Vinhomes", "Chung cư mở bán"
💡 **Tư vấn đầu tư:** "Nên mua ở đâu?", "Đầu tư 3 tỷ"
🏠 **Cho thuê:** "Giá thuê căn hộ", "Cho thuê nhanh"
📋 **Pháp lý:** "Thủ tục mua nhà", "Làm sổ hồng"

**💭 VÍ DỤ CÂU HỎI:**
• "Tư vấn mua căn hộ 2PN giá 3 tỷ ở Q7"
• "Dự án nào đang mở bán ở Thủ Đức?"
• "Giá thuê nhà riêng 3PN ở Q2"

*Hãy hỏi cụ thể hơn để tôi hỗ trợ tốt nhất!*
        """.strip(),
        "confidence": 0.60,
        "sources": ["Default Response"]
    }

@app.post("/chat")  # Backend expects this endpoint
async def chat_legacy_endpoint(request: ChatRequest):
    """Legacy chat endpoint for backend compatibility"""
    try:
        logger.info(f"🤖 Chat request received: query='{request.query}', message='{request.message}'")
        
        # Get user message from either field
        user_message = request.query or request.message
        
        if not user_message or user_message.strip() == "":
            return ChatResponse(
                success=False,
                data={
                    "response": "Vui lòng nhập câu hỏi.",
                    "confidence": 0.0,
                    "sources": [],
                    "conversationId": str(uuid.uuid4()),
                    "timestamp": datetime.now().isoformat()
                },
                message="Thiếu nội dung câu hỏi"
            )
        
        logger.info(f"🔍 Processing message: '{user_message}'")
        
        # Generate conversation ID if not provided
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Find best matching response
        match_result = find_best_match(user_message)
        
        logger.info(f"✅ Found match: category={match_result['category']}, confidence={match_result['confidence']}")
        logger.info(f"📝 Response preview: {match_result['response'][:100]}...")
        
        # Return response in expected format
        response_data = {
            "response": match_result["response"],
            "confidence": match_result["confidence"],
            "sources": match_result["sources"],
            "conversationId": conversation_id,
            "timestamp": datetime.now().isoformat(),
            "category": match_result["category"]
        }
        
        response = ChatResponse(
            success=True,
            data=response_data,
            message="Phản hồi thành công"
        )
        
        logger.info(f"🚀 Sending response: success=True, response_length={len(match_result['response'])}")
        
        return response
        
    except Exception as e:
        logger.error(f"❌ Chat error: {str(e)}")
        
        return ChatResponse(
            success=False,
            data={
                "response": "Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau.",
                "confidence": 0.0,
                "sources": [],
                "conversationId": request.conversation_id or str(uuid.uuid4()),
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            },
            message="Lỗi xử lý yêu cầu"
        )

@app.post("/chatbot/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint"""
    # Use the same logic as legacy endpoint
    return await chat_legacy_endpoint(request)

@app.get("/history/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """Get conversation history"""
    if conversation_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return {
        "success": True,
        "data": conversations[conversation_id]
    }

@app.delete("/clear/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Clear conversation history"""
    if conversation_id in conversations:
        del conversations[conversation_id]
    
    return {"message": "Conversation cleared successfully"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_conversations": len(conversations),
        "python_version": "3.x",
        "service": "Real Estate RAG Chatbot"
    }

@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify API is working"""
    test_query = "tư vấn giá cả"
    match_result = find_best_match(test_query)
    
    return {
        "status": "working",
        "test_query": test_query,
        "match_result": {
            "category": match_result["category"],
            "confidence": match_result["confidence"],
            "response_length": len(match_result["response"]),
            "response_preview": match_result["response"][:200] + "...",
            "sources": match_result["sources"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)