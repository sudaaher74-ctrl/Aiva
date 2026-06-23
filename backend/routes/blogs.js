const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @route   GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/blogs/admin
router.get('/admin', protect, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/blogs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/blogs
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, slug, content, author, tags, isPublished } = req.body;
    let image_url = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'blogs', 'image');
      image_url = result.secure_url;
    }

    const blog = await Blog.create({
      title, slug, content, author, image_url,
      tags: tags ? JSON.parse(tags) : [],
      isPublished: isPublished === 'true'
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Slug must be unique' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/blogs/:id
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });

    let updateData = { ...req.body };
    if (updateData.tags) updateData.tags = JSON.parse(updateData.tags);
    if (updateData.isPublished) updateData.isPublished = updateData.isPublished === 'true';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'blogs', 'image');
      updateData.image_url = result.secure_url;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/blogs/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
