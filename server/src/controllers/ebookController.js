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

// @desc    Update ebook
// @route   PUT /api/ebooks/:id
// @access  Private
const updateEbook = async (req, res) => {
    try {
        const ebook = await Ebook.findById(req.params.id);

        if (ebook) {
            // Verify ownership
            if (ebook.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            // Update fields if present in body
            ebook.title = req.body.title || ebook.title;
            ebook.subject = req.body.subject || ebook.subject;
            ebook.author = req.body.author !== undefined ? req.body.author : ebook.author;
            ebook.subtitle = req.body.subtitle !== undefined ? req.body.subtitle : ebook.subtitle;
            ebook.coverFont = req.body.coverFont || ebook.coverFont;

            // Allow updating content/chapters if needed later
            if (req.body.chapters) ebook.chapters = req.body.chapters;
            if (req.body.content) ebook.content = req.body.content;
            if (req.body.status) ebook.status = req.body.status;
            if (req.body.coverUrl) ebook.coverUrl = req.body.coverUrl;

            const updatedEbook = await ebook.save();
            res.json(updatedEbook);
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

// @desc    Get ebook statistics (growth)
// @route   GET /api/ebooks/stats
// @access  Private
const getEbookStats = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1); // Start of the month
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const ebooks = await Ebook.find({
            userId: req.user._id,
            createdAt: { $gte: sixMonthsAgo }
        }).sort({ createdAt: 1 });

        // Initialize months map
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const statsMap = new Map();

        // Generate last 7 months keys
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = months[d.getMonth()];
            statsMap.set(key, 0);
        }

        // Fill with actual data
        ebooks.forEach(ebook => {
            const date = new Date(ebook.createdAt);
            const key = months[date.getMonth()];
            if (statsMap.has(key)) {
                statsMap.set(key, statsMap.get(key) + 1);
            }
        });

        // Convert to array format expected by Recharts
        // Cumulative growth calculation (optional, or just monthly? The chart title is "Content Growth", usually cumulative implies total over time, but the bars/lines might be per month. The screenshot shows a curve going UP, so it's likely cumulative or just high activity. Let's assume cumulative counts OR just monthly counts.
        // Actually the screenshot shows a smooth curve increasing. That suggests Cumulative Total.
        // But the tooltip says "Ebooks: 85". If it was per month, 85 is huge. If it's cumulative, it makes sense.
        // Let's make it CUMULATIVE.

        let totalEbooks = await Ebook.countDocuments({
            userId: req.user._id,
            createdAt: { $lt: sixMonthsAgo }
        });

        const data = [];
        for (let [name, count] of statsMap) {
            totalEbooks += count;
            data.push({
                name,
                ebooks: totalEbooks,
                training: 0 // Placeholder for now
            });
        }

        res.json(data);

    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

export { getMyEbooks, getEbookById, deleteEbook, getEbookStats, updateEbook };
