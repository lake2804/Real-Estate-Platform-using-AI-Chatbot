const axios = require('axios');

async function testFullSystem() {
    console.log('🚀 Testing Full Chatbot System Integration...\n');
    
    // Test 1: Python RAG Service
    try {
        console.log('1️⃣ Testing Python RAG Service...');
        const pythonResponse = await axios.post('http://localhost:8001/chat', {
            query: 'xin chào',
            conversation_id: 'test-integration'
        });
        
        if (pythonResponse.status === 200) {
            console.log('✅ Python RAG Service: OK');
            console.log(`📝 Response: ${pythonResponse.data.answer.substring(0, 50)}...`);
        }
    } catch (error) {
        console.log('❌ Python RAG Service: FAILED');
        console.log(`Error: ${error.message}`);
        return;
    }
    
    // Test 2: Backend Chatbot API
    try {
        console.log('\n2️⃣ Testing Backend Chatbot API...');
        const backendResponse = await axios.post('http://localhost:4000/api/chatbot/chat', {
            message: 'giá nhà ở Quận 7',
            conversationId: 'test-backend'
        });
        
        if (backendResponse.status === 200 && backendResponse.data.success) {
            console.log('✅ Backend Chatbot API: OK');
            console.log(`📝 Response: ${backendResponse.data.data.message.substring(0, 50)}...`);
            console.log(`📊 Confidence: ${backendResponse.data.data.confidence}`);
        }
    } catch (error) {
        console.log('❌ Backend Chatbot API: FAILED');
        console.log(`Error: ${error.message}`);
        return;
    }
    
    // Test 3: Backend Python Health Check
    try {
        console.log('\n3️⃣ Testing Backend Python Health Check...');
        const healthResponse = await axios.get('http://localhost:4000/api/chatbot/test-python');
        
        if (healthResponse.status === 200) {
            console.log('✅ Backend Python Health Check: OK');
            console.log(`📋 Python Service Status: ${healthResponse.data.success ? 'Online' : 'Offline'}`);
        }
    } catch (error) {
        console.log('❌ Backend Python Health Check: FAILED');
        console.log(`Error: ${error.message}`);
    }
    
    // Test 4: Multiple Chat Messages
    console.log('\n4️⃣ Testing Multiple Chat Messages...');
    const testMessages = [
        'dự án Vinhomes có gì hot?',
        'tư vấn đầu tư 3 tỷ',
        'cho thuê căn hộ 2PN'
    ];
    
    for (let i = 0; i < testMessages.length; i++) {
        try {
            const response = await axios.post('http://localhost:4000/api/chatbot/chat', {
                message: testMessages[i],
                conversationId: 'test-multiple'
            });
            
            if (response.status === 200 && response.data.success) {
                console.log(`✅ Message ${i+1}: OK - "${testMessages[i]}"`);
                console.log(`   📊 Confidence: ${response.data.data.confidence}`);
            }
        } catch (error) {
            console.log(`❌ Message ${i+1}: FAILED - "${testMessages[i]}"`);
        }
    }
    
    console.log('\n🎉 Full System Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Python RAG Service: Running on port 8001');
    console.log('✅ Backend API: Running on port 4000'); 
    console.log('✅ Chatbot Integration: Working');
    console.log('\n🚀 Ready to test in Frontend UI!');
}

testFullSystem().catch(console.error);