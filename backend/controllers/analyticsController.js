import ActivityLog from '../models/ActivityLog.js';

export const trackNavigation = async (req, res) => {
    try {
        const { source, target } = req.body;

        if (!source || !target) {
            return res.status(400).json({ message: 'Source and target are required' });
        }

        // Determine user if authenticated (optional, but good for linking streams to identities)
        const userId = req.user ? req.user.userId : null;

        // Log the page transition
        await ActivityLog.create({
            userId,
            action: 'PAGE_TRANSITION',
            details: {
                source,
                target,
            },
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Clickstream tracking error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
