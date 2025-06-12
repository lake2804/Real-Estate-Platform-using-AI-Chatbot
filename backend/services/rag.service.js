const axios = require('axios');
const fs = require('fs');
const path = require('path');

class RAGService {
  constructor() {
    this.ragApiUrl = process.env.RAG_API_URL || 'http://localhost:8001';
    this.isAvailable = false;
    this.localFaissPath = path.resolve(__dirname, '../../BTTH2_code/faiss_index');
    this.metadata = null;
    this.legalYear = '2024';
    this.init();
  }

  async init() {
    try {
      await this.loadLocalMetadata();
      await this.testConnection();
      console.log('✅ RAG Service initialized successfully');
    } catch (error) {
      console.error('❌ RAG Service initialization failed:', error.message);
      this.isAvailable = false;
    }
  }

  async loadLocalMetadata() {
    try {
      const metadataPath = path.join(this.localFaissPath, 'metadata.json');
      console.log(`📁 Loading metadata from: ${metadataPath}`);
      
      if (fs.existsSync(metadataPath)) {
        const rawData = fs.readFileSync(metadataPath, 'utf8');
        this.metadata = JSON.parse(rawData);
        
        const firstDoc = this.metadata[0];
        if (firstDoc) {
          console.log(`📚 Loaded metadata - First document: ${firstDoc.tieu_de}`);
          console.log(`📅 Legal content year: ${this.legalYear}`);
        }
        
        console.log(`📚 Loaded ${this.metadata.length} legal documents (Luật Đất đai 2024)`);
      } else {
        console.error(`❌ Metadata file not found: ${metadataPath}`);
      }
    } catch (error) {
      console.error('❌ Error loading local metadata:', error.message);
    }
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.ragApiUrl}/health`, { timeout: 5000 });
      this.isAvailable = response.status === 200;
      return this.isAvailable;
    } catch (error) {
      console.warn('⚠️ RAG API not available, using local fallback');
      this.isAvailable = false;
      return false;
    }
  }

  async searchRelevantDocs(query, topK = 3) { // ✅ Giảm từ 5 xuống 3
    try {
      if (this.isAvailable) {
        const response = await axios.post(`${this.ragApiUrl}/search`, {
          query,
          top_k: topK
        }, { timeout: 10000 });

        if (response.data && response.data.results) {
          return response.data.results;
        }
      }

      return this.searchLocalMetadata(query, topK);
    } catch (error) {
      console.error('❌ RAG search error:', error.message);
      return this.searchLocalMetadata(query, topK);
    }
  }

  searchLocalMetadata(query, topK = 3) { // ✅ Giảm từ 5 xuống 3
    if (!this.metadata) return [];

    try {
      const queryLC = query.toLowerCase();
      const searchTerms = queryLC.split(' ').filter(term => term.length > 2);

      const realEstateKeywords = [
        'đất đai', 'bất động sản', 'nhà ở', 'căn hộ', 'chung cư', 
        'mua bán', 'chuyển nhượng', 'sở hữu', 'sử dụng đất',
        'giấy chứng nhận', 'quyền sử dụng', 'thủ tục', 'pháp lý',
        'đầu tư', 'thuế', 'phí', 'bồi thường', 'thu hồi',
        'luật đất đai 2024', 'luật 2024', '2024'
      ];

      const scoredDocs = this.metadata.map(doc => {
        let score = 0;
        const docText = `${doc.tieu_de} ${doc.noi_dung}`.toLowerCase();

        if (docText.includes('2024') || docText.includes('31/2024')) {
          score += 10;
        }

        realEstateKeywords.forEach(keyword => {
          if (docText.includes(keyword)) {
            score += 3;
          }
        });

        searchTerms.forEach(term => {
          const termCount = (docText.match(new RegExp(term, 'g')) || []).length;
          score += termCount * 2;
        });

        if (doc.tieu_de.toLowerCase().includes(queryLC)) {
          score += 5;
        }

        return { ...doc, score };
      });

      return scoredDocs
        .filter(doc => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(doc => ({
          // ✅ Truncate content để giảm token
          content: this.truncateContent(doc.noi_dung, 800), // Giới hạn 800 ký tự
          metadata: {
            title: doc.tieu_de,
            chapter: doc.chuong,
            score: doc.score,
            year: '2024',
            law: 'Luật Đất đai 2024'
          }
        }));
    } catch (error) {
      console.error('❌ Local metadata search error:', error.message);
      return [];
    }
  }

  // ✅ Hàm truncate content
  truncateContent(content, maxLength = 800) {
    if (!content || content.length <= maxLength) {
      return content;
    }
    
    // Cắt ở ranh giới câu gần nhất
    const truncated = content.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf(';'),
      truncated.lastIndexOf(':')
    );
    
    return lastSentenceEnd > maxLength * 0.7 
      ? truncated.substring(0, lastSentenceEnd + 1) + '...'
      : truncated + '...';
  }

  async generateRAGResponse(query, relevantDocs) {
    if (!relevantDocs || relevantDocs.length === 0) {
      return null;
    }

    // ✅ Compact context format
    const context = relevantDocs
      .map((doc, index) => `[${index + 1}] ${doc.metadata.title}:\n${doc.content}`)
      .join('\n\n');

    return {
      context,
      sources: relevantDocs.map(doc => `${doc.metadata.title} (Luật Đất đai 2024)`),
      relevantDocsCount: relevantDocs.length,
      legalYear: '2024'
    };
  }

  isHealthy() {
    return this.isAvailable || (this.metadata && this.metadata.length > 0);
  }

  getStats() {
    return {
      api_available: this.isAvailable,
      local_metadata_loaded: !!this.metadata,
      documents_count: this.metadata ? this.metadata.length : 0,
      faiss_path: this.localFaissPath,
      legal_year: this.legalYear
    };
  }
}

module.exports = new RAGService();