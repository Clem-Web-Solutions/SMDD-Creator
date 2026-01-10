import Ebook from '../models/Ebook.js';

// @desc    Get user ebooks
// @route   GET /api/ebooks
// @access  Private
const getMyEbooks = async (req, res) => {
    try {
        const ebooks = await Ebook.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(ebooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ebook by ID
// @route   GET /api/ebooks/:id
// @access  Private
const getEbookById = async (req, res) => {
    try {
        const ebook = await Ebook.findById(req.params.id);

        if (ebook) {
            // Verify ownership
            if (ebook.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Non autorisé' });
            }
            res.json(ebook);
        } else {
            res.status(404).json({ message: 'Ebook non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete ebook
// @route   DELETE /api/ebooks/:id
// @access  Private
const deleteEbook = async (req, res) => {
    try {
        const ebook = await Ebook.findById(req.params.id);

        if (ebook) {
            // Verify ownership
            if (ebook.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            await ebook.deleteOne();
            res.json({ message: 'Ebook supprimé' });
        } else {
            res.status(404).json({ message: 'Ebook non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getMyEbooks, getEbookById, deleteEbook };
