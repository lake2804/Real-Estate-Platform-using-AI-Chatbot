import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true  // ✅ Make this required to avoid null values
  },
  propertyTitle: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  lastMessage: {
    content: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'pending'],
    default: 'active'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// ✅ UPDATE INDEX: Remove the problematic unique index
// Instead use a compound index that allows multiple conversations per property
conversationSchema.index({ participants: 1, property: 1 }); // Not unique
conversationSchema.index({ property: 1 });
conversationSchema.index({ participants: 1 });
conversationSchema.index({ status: 1 });

export default mongoose.model('Conversation', conversationSchema);