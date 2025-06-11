import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

// Get user conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    console.log('🔍 Getting conversations for user:', userId);

    const conversations = await Conversation.find({
      participants: userId,
      isActive: true
    })
    .populate('participants', 'fullName email avatar')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'senderId',
        select: 'fullName avatar'
      }
    })
    .populate('propertyId', 'title price location images')
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(limit);

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conversation._id,
          receiverId: userId,
          status: { $in: ['sent', 'delivered'] }
        });

        return {
          ...conversation.toObject(),
          unreadCount
        };
      })
    );

    console.log(`✅ Found ${conversationsWithUnread.length} conversations`);

    res.json({
      success: true,
      data: conversationsWithUnread,
      pagination: {
        page,
        limit,
        total: await Conversation.countDocuments({
          participants: userId,
          isActive: true
        })
      }
    });

  } catch (error) {
    console.error('❌ Error getting conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading conversations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new conversation
export const createConversation = async (req, res) => {
  try {
    const { propertyId, propertyOwnerId, propertyTitle } = req.body;
    const userId = req.user.id;

    console.log('🔧 Creating conversation:', { propertyId, propertyOwnerId, userId });

    // Validation
    if (!propertyOwnerId) {
      return res.status(400).json({
        success: false,
        message: 'Property owner ID is required'
      });
    }

    // Check if trying to chat with self
    if (userId === propertyOwnerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }

    // Check if property owner exists
    const propertyOwner = await User.findById(propertyOwnerId);
    if (!propertyOwner) {
      return res.status(404).json({
        success: false,
        message: 'Property owner not found'
      });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, propertyOwnerId] },
      ...(propertyId && { propertyId })
    })
    .populate('participants', 'fullName email avatar')
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'senderId',
        select: 'fullName avatar'
      }
    });

    if (conversation) {
      console.log('✅ Found existing conversation:', conversation._id);
      return res.json({
        success: true,
        data: conversation,
        message: 'Existing conversation found'
      });
    }

    // Get property details if provided
    let property = null;
    if (propertyId) {
      property = await Property.findById(propertyId);
    }

    // Create new conversation
    conversation = new Conversation({
      participants: [userId, propertyOwnerId],
      propertyId: propertyId || null,
      propertyTitle: propertyTitle || property?.title || null,
      propertyUrl: propertyId ? `/buy/${propertyId}` : null,
      metadata: property ? {
        propertyPrice: property.price,
        propertyLocation: property.location,
        propertyImage: property.images?.[0]
      } : {}
    });

    await conversation.save();

    // Populate after save
    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'fullName email avatar')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'senderId',
          select: 'fullName avatar'
        }
      });

    // Create initial system message if property-related
    if (propertyId && propertyTitle) {
      const systemMessage = new Message({
        conversationId: conversation._id,
        senderId: userId,
        receiverId: propertyOwnerId,
        content: `Chào bạn! Tôi quan tâm đến bất động sản "${propertyTitle}". Bạn có thể chia sẻ thêm thông tin được không?`,
        messageType: 'system',
        status: 'sent'
      });

      await systemMessage.save();

      // Update conversation with first message
      conversation.lastMessage = systemMessage._id;
      conversation.lastActivity = new Date();
      await conversation.save();
    }

    console.log('✅ New conversation created:', conversation._id);

    res.status(201).json({
      success: true,
      data: conversation,
      message: 'Conversation created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating conversation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    console.log('🔍 Getting messages for conversation:', conversationId);

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    const messages = await Message.find({
      conversationId: conversationId,
      isDeleted: false
    })
    .populate('senderId', 'fullName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    // Mark messages as read for current user
    await Message.updateMany({
      conversationId: conversationId,
      receiverId: userId,
      status: { $in: ['sent', 'delivered'] }
    }, {
      status: 'read',
      readAt: new Date()
    });

    console.log(`✅ Found ${messages.length} messages`);

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total: await Message.countDocuments({
          conversationId: conversationId,
          isDeleted: false
        })
      }
    });

  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error loading messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    console.log('📤 Sending message:', { conversationId, content: content?.substring(0, 50) + '...' });

    // Validation
    if (!conversationId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID and content are required'
      });
    }

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    // Find receiver (other participant)
    const receiverId = conversation.participants.find(
      participantId => participantId.toString() !== userId
    );

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver not found in conversation'
      });
    }

    // Create message
    const message = new Message({
      conversationId: conversationId,
      senderId: userId,
      receiverId: receiverId,
      content: content.trim(),
      messageType,
      status: 'sent'
    });

    await message.save();

    // Populate sender info
    await message.populate('senderId', 'fullName avatar');

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastActivity = new Date();
    await conversation.save();

    console.log('✅ Message sent:', message._id);

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    console.log('📖 Marking messages as read:', conversationId);

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    const result = await Message.updateMany({
      conversationId: conversationId,
      receiverId: userId,
      status: { $in: ['sent', 'delivered'] }
    }, {
      status: 'read',
      readAt: new Date()
    });

    console.log(`✅ Marked ${result.modifiedCount} messages as read`);

    res.json({
      success: true,
      message: 'Messages marked as read',
      data: {
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('❌ Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete conversation (soft delete)
export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    console.log('🗑️ Deleting conversation:', id);

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied'
      });
    }

    // Soft delete
    conversation.isActive = false;
    await conversation.save();

    console.log('✅ Conversation deleted successfully');

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting conversation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get recent messages (for testing)
export const getRecentMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ],
      isDeleted: false
    })
    .populate('senderId', 'fullName avatar')
    .populate('conversationId', 'propertyTitle')
    .sort({ createdAt: -1 })
    .limit(limit);

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('❌ Error getting recent messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting recent messages'
    });
  }
};