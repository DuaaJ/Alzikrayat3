
const Photo = require('../models/Photo');

// Get all photos for the home gallery
const getAll = async (req, res) => {
    try {
        const photos = await Photo.find()
            .populate('userId', 'firstName lastName')
            .sort({ dateTime: -1 });

        res.status(200).json(photos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get one photo with its owner's information
const getOne = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id)
            .populate('userId', 'firstName lastName');

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        res.status(200).json(photo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Upload a new photo
const create = async (req, res) => {
    try {
        const { userId, title, description } = req.body;

        if (!userId || !title || !req.file) {
            return res.status(400).json({
                message: 'User, title and photo are required'
            });
        }

        const photo = await Photo.create({
            userId,
            fileName: req.file.filename,
            title,
            description
        });

        res.status(201).json({
            message: 'Photo uploaded successfully',
            photo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete a photo
const remove = async (req, res) => {
    try {
        const { userId } = req.body;

        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({ message: 'Photo not found' });
        }

        if (photo.userId.toString() !== userId) {
            return res.status(403).json({
                message: 'You cannot delete this photo'
            });
        }

        await Photo.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Photo deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { getAll, getOne, create, remove };
