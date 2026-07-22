const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect, restrictTo } = require('../middleware/auth');

router.post('/chat', protect, restrictTo('Admin'), aiController.chat);
router.get('/conversations', protect, restrictTo('Admin'), aiController.getConversations);
router.get('/conversations/:id', protect, restrictTo('Admin'), aiController.getConversationById);
router.patch('/conversations/:id', protect, restrictTo('Admin'), aiController.updateConversation);
router.delete('/conversations/:id', protect, restrictTo('Admin'), aiController.deleteConversation);
router.get('/suggestions', protect, restrictTo('Admin'), aiController.getSuggestions);

module.exports = router;
