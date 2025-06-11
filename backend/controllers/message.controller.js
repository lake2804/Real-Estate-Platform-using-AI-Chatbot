import Message from '../models/Message.js';
import Property from '../models/Property.js';
import Account from '../models/Account.js';
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
  try {
    const { receiver, property, subject, content } = req.body;
    const sender = req.user._id;

    // Validate receiver exists
    const receiverUser = await Account.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Validate property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if sender is trying to message themselves
    if (sender.toString() === receiver) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    const message = new Message({
      sender,
      receiver,
      property,
      subject,
      content
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate([
      { path: 'sender', select: 'fullName email avatar' },
      { path: 'receiver', select: 'fullName email avatar' },
      { path: 'property', select: 'title image type price location' }
    ]);

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(400).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, type = 'received', isRead } = req.query;
    const userId = req.user._id;

    const filter = {};
    
    // Set filter based on type
    if (type === 'sent') {
      filter.sender = userId;
    } else {
      filter.receiver = userId;
    }

    // Filter by read status
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find(filter)
      .populate('sender', 'fullName email avatar')
      .populate('receiver', 'fullName email avatar')
      .populate('property', 'title image type price location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments(filter);
    const unreadCount = await Message.countDocuments({ 
      receiver: userId, 
      isRead: false 
    });

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

export const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }

    const message = await Message.findById(id)
      .populate('sender', 'fullName email avatar')
      .populate('receiver', 'fullName email avatar')
      .populate('property', 'title image type price location owner');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is sender or receiver
    if (message.sender._id.toString() !== userId.toString() && 
        message.receiver._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Mark as read if user is receiver and message is unread
    if (message.receiver._id.toString() === userId.toString() && !message.isRead) {
      await message.markAsRead();
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Get message by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching message',
      error: error.message
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the receiver
    if (message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only receiver can mark message as read'
      });
    }

    if (!message.isRead) {
      await message.markAsRead();
    }

    res.json({
      success: true,
      data: message,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID'
      });
    }

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is sender or receiver
    if (message.sender.toString() !== userId.toString() && 
        message.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Message.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { propertyId, userId } = req.params;
    const currentUserId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(propertyId) || 
        !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property or user ID'
      });
    }

    // Check if current user is part of this conversation
    if (currentUserId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({
      property: propertyId,
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'fullName avatar')
    .populate('receiver', 'fullName avatar')
    .populate('property', 'title image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Message.countDocuments({
      property: propertyId,
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    });

    // Mark messages as read
    await Message.updateMany(
      {
        property: propertyId,
        sender: userId,
        receiver: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};