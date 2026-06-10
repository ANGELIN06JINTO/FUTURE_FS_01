const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const Contact = require('../models/Contact');
const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Subject cannot exceed 200 characters'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters'),
];
router.post('/', contactValidationRules, async (req, res) => {
  // 1. Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your inputs.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  const { name, email, subject, message } = req.body;
  try {
    // 2. Save to MongoDB
    const newContact = new Contact({
      name,
      email,
      subject: subject || 'No Subject',
      message,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
    });

    const savedContact = await newContact.save();

    return res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon 🙌",
      data: {
        id: savedContact._id,
        name: savedContact.name,
        email: savedContact.email,
        subject: savedContact.subject,
        createdAt: savedContact.createdAt,
      },
      
    });

  } catch (error) {
    console.error('❌ Contact POST error:', error.message);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const msgs = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: msgs.join('. ') });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-ipAddress'),   // hide IP from list view
      Contact.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Contact GET error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
});


router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid message ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    try {
      const contact = await Contact.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }
      return res.status(200).json({ success: true, data: contact });
    } catch (error) {
      console.error('❌ Contact GET/:id error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch message.' });
    }
  }
);

router.patch(
  '/:id/read',
  [param('id').isMongoId().withMessage('Invalid message ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    try {
      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true }
      );
      if (!contact) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Marked as read.',
        data: { id: contact._id, isRead: contact.isRead },
      });
    } catch (error) {
      console.error('❌ Contact PATCH error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to update message.' });
    }
  }
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid message ID')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ success: false, message: 'Message not found.' });
      }
      return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
    } catch (error) {
      console.error('❌ Contact DELETE error:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to delete message.' });
    }
  }
);

module.exports = router;