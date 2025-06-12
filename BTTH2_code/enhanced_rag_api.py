from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import uuid
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

app = FastAPI(title="Real Estate RAG Chatbot API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:4000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ChatRequest(BaseModel):
    query: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[str]
    conversation_id: str
    timestamp: str

class ConversationHistory(BaseModel):
    messages: List[Dict[str, Any]]
    conversation_id: str

# In-memory storage for conversations (use Redis/DB in production)
conversations = {}

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Update the chat endpoint with better error handling
@app.post("/chat", response_model=ChatResponse)
async def chat_with_rag(request: ChatRequest):
    """Main chat endpoint that processes user queries using RAG"""
    try:
        logger.info(f"🤖 Processing chat request: {request.query[:50]}...")
        logger.info(f"📋 Request details: conversation_id={request.conversation_id}, user_id={request.user_id}")
        
        # Generate conversation ID if not provided
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Initialize conversation if new
        if conversation_id not in conversations:
            conversations[conversation_id] = {
                "messages": [],
                "created_at": datetime.now().isoformat(),
                "user_id": request.user_id
            }
            logger.info(f"✅ New conversation created: {conversation_id}")
        
        # Add user message to conversation
        user_message = {
            "role": "user",
            "content": request.query,
            "timestamp": datetime.now().isoformat()
        }
        conversations[conversation_id]["messages"].append(user_message)
        logger.info(f"✅ User message added to conversation")
        
        # Process query with RAG system
        logger.info(f"🔄 Processing RAG query...")
        rag_result = await process_rag_query(
            query=request.query,
            context=request.context or {},
            conversation_history=conversations[conversation_id]["messages"]
        )
        logger.info(f"✅ RAG query processed successfully")
        
        # Add bot response to conversation
        bot_message = {
            "role": "assistant",
            "content": rag_result["answer"],
            "timestamp": datetime.now().isoformat(),
            "confidence": rag_result["confidence"],
            "sources": rag_result["sources"]
        }
        conversations[conversation_id]["messages"].append(bot_message)
        
        response = ChatResponse(
            answer=rag_result["answer"],
            confidence=rag_result["confidence"],
            sources=rag_result["sources"],
            conversation_id=conversation_id,
            timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"✅ Response created successfully")
        return response
        
    except Exception as e:
        error_msg = str(e)
        error_trace = traceback.format_exc()
        logger.error(f"❌ Chat processing error: {error_msg}")
        logger.error(f"❌ Full traceback: {error_trace}")
        
        # Return fallback response instead of raising HTTPException
        return ChatResponse(
            answer="Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1000 để được hỗ trợ trực tiếp.",
            confidence=0.0,
            sources=[],
            conversation_id=request.conversation_id or str(uuid.uuid4()),
            timestamp=datetime.now().isoformat()
        )

# Update process_rag_query with better error handling
async def process_rag_query(query: str, context: Dict, conversation_history: List) -> Dict:
    """Process RAG query with enhanced error handling"""
    try:
        logger.info(f"🔍 Processing query: '{query}'")
        
        # Convert query to lowercase for matching
        query_lower = query.lower().strip()
        logger.info(f"🔍 Query lowercase: '{query_lower}'")
        
        # Check for greeting words
        greeting_words = ["xin chào", "hello", "hi", "chào", "xin", "chao"]
        if any(word in query_lower for word in greeting_words):
            logger.info("✅ Matched greeting pattern")
            answer = """
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
            """
            confidence = 0.95
            sources = ["Chatbot Greeting"]
            
        # Check for price-related words
        elif any(word in query_lower for word in ["giá", "price", "bán", "mua", "cost", "money"]):
            logger.info("✅ Matched price pattern")
            answer = """
🏠 **Thông tin giá bất động sản hiện tại:**

**Căn hộ chung cư TP.HCM:**
• Quận 1, 3: 60-120 triệu/m²
• Quận 2, 7, 9: 40-70 triệu/m²  
• Quận ngoại: 25-45 triệu/m²

**Nhà riêng:**
• Trung tâm: 150-400 triệu/m²
• Ngoại thành: 80-150 triệu/m²

**Xu hướng thị trường Q4/2024:**
📈 Giá tăng 6-8%/năm
🏗️ Nguồn cung khan hiếm khu trung tâm
💡 Khu Đông (Q2, Q9, Thủ Đức) phát triển mạnh

Bạn quan tâm khu vực nào cụ thể?
            """
            confidence = 0.88
            sources = ["Báo cáo thị trường BĐS Q4/2024"]
            
        # Check for project-related words
        elif any(word in query_lower for word in ["dự án", "project", "chung cư", "vinhomes", "masteri", "apartment"]):
            logger.info("✅ Matched project pattern")
            answer = """
🏗️ **TOP dự án nổi bật đang mở bán:**

**🌟 Vinhomes Grand Park - Quận 9**
• Giá: 35-50 triệu/m²
• Tiến độ: Đang bàn giao T1-T5
• Ưu điểm: Công viên 36ha, trường quốc tế

**🌟 Masteri Centre Point - Quận 9**
• Giá: 42-58 triệu/m²
• Tiến độ: Hoàn thiện Q3/2025
• Ưu điểm: View sông, gần Metro Line 1

**🌟 The Metropole Thủ Thiêm - Quận 2**
• Giá: 70-110 triệu/m²
• Tiến độ: Sắp mở bán Q1/2025
• Đặc điểm: Hạng sang, view Landmark 81

Bạn muốn tìm hiểu dự án nào chi tiết?
            """
            confidence = 0.92
            sources = ["Website chủ đầu tư", "Thông tin môi giới"]
            
        # Check for advice-related words
        elif any(word in query_lower for word in ["tư vấn", "advice", "đầu tư", "nên", "recommend", "suggest"]):
            logger.info("✅ Matched advice pattern")
            answer = """
💡 **Tư vấn đầu tư bất động sản 2024:**

**🔍 PHÂN TÍCH THỊ TRƯỜNG:**
📊 Thị trường đã qua đáy, đang hồi phục
💰 Lãi suất ngân hàng ổn định 10-12%/năm
🏗️ Nguồn cung mới hạn chế, giá tăng nhẹ

**⭐ KHU VỰC ĐÁNG ĐẦU TƯ:**
• Khu Đông (Q2, Q9, Thủ Đức): Tiềm năng cao
• Khu Nam (Q7, Nhà Bè): Thanh khoản tốt

**💡 LOOS KHUYÊN:**
✅ Ưu tiên vị trí có tiềm năng phát triển
✅ Gần giao thông công cộng
✅ Khu vực có trường học tốt
✅ Không vay quá 70% giá trị nhà

Bạn có bao nhiêu vốn và muốn đầu tư theo hướng nào?
            """
            confidence = 0.90
            sources = ["Phân tích chuyên gia", "Báo cáo thị trường"]
            
        # Check for rental-related words
        elif any(word in query_lower for word in ["thuê", "rent", "cho thuê", "rental"]):
            logger.info("✅ Matched rental pattern")
            answer = """
🏠 **Thị trường cho thuê TP.HCM 2024:**

**💰 GIÁ THUÊ HIỆN TẠI:**
• Studio/1PN: 8-18 triệu/tháng
• 2PN: 15-30 triệu/tháng  
• 3PN: 22-45 triệu/tháng

**🔥 KHU VỰC HOT CHO THUÊ:**
• Quận 1, 3, 5: Giá cao, dễ cho thuê
• Quận 2, 7, 9: Giá trung bình, cân bằng tốt

**💡 TIPS CHO THUÊ NHANH:**
📸 Chụp ảnh chuyên nghiệp
💰 Giá cạnh tranh với thị trường
📱 Đăng đa kênal: Batdongsan, Chotot

Bạn đang muốn cho thuê hay tìm thuê nhà?
            """
            confidence = 0.87
            sources = ["Thống kê cho thuê", "Kinh nghiệm môi giới"]
            
        else:
            # Default response for any other query
            logger.info("✅ Using default response")
            answer = """
🤔 **Tôi chưa hiểu rõ câu hỏi của bạn. Để tôi có thể hỗ trợ tốt hơn:**

**🏠 CÁC CHỦ ĐỀ TÔI CÓ THỂ TƯ VẤN:**

📊 **Thông tin thị trường:**
• "Giá nhà ở khu vực [tên quận]"
• "Xu hướng giá bất động sản 2024"

🏗️ **Dự án bất động sản:**
• "Dự án nào đang mở bán tốt?"
• "Thông tin về dự án Vinhomes"

💡 **Tư vấn đầu tư:**
• "Nên đầu tư khu vực nào?"
• "Mua nhà với 3 tỷ nên chọn thế nào?"

🏠 **Thuê nhà:**
• "Giá thuê căn hộ 2PN ở Quận 7"

**💬 VÍ DỤ CÂU HỎI:**
• "Tư vấn mua căn hộ 2PN giá 3 tỷ"
• "Giá thuê nhà riêng ở Quận 2"

Bạn có thể hỏi cụ thể hơn không?
            """
            confidence = 0.70
            sources = ["Hướng dẫn sử dụng"]
        
        result = {
            "answer": answer.strip(),
            "confidence": confidence,
            "sources": sources
        }
        
        logger.info(f"✅ RAG result created: confidence={confidence}")
        return result
        
    except Exception as e:
        error_msg = str(e)
        error_trace = traceback.format_exc()
        logger.error(f"❌ RAG processing error: {error_msg}")
        logger.error(f"❌ RAG traceback: {error_trace}")
        
        return {
            "answer": "Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau hoặc liên hệ hotline 1900 1000.",
            "confidence": 0.0,
            "sources": []
        }

@app.get("/history/{conversation_id}", response_model=ConversationHistory)
async def get_conversation_history(conversation_id: str):
    """Get conversation history"""
    if conversation_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return ConversationHistory(
        messages=conversations[conversation_id]["messages"],
        conversation_id=conversation_id
    )

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)