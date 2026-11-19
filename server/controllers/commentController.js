
const Comment = require('../models/Comment');
const Photo = require('../models/Photo');

// Get all comments for one photo
const getByPhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        const comments = await Comment.find({
            photoId: req.params.id
        })
            .populate('userId', 'firstName lastName')
            .sort({ dateTime: 1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add a comment
const add = async (req, res) => {
    try {
        const { userId, comment } = req.body;
        const photoId = req.params.id;

        if (!userId || !comment || !comment.trim()) {
            return res.status(400).json({
                message: 'User and comment are required'
            });
        }

        const photo = await Photo.findById(photoId);

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        const newComment = await Comment.create({
            photoId,
            userId,
            comment
        });

        await newComment.populate('userId', 'firstName lastName');

        res.status(201).json({
            message: 'Comment added successfully',
            comment: newComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getByPhoto, add };
