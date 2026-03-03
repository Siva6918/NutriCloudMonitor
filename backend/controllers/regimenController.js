import Regimen from '../models/Regimen.js';

export const getTodayRegimen = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const regimens = await Regimen.find({ userId: req.user.userId, date: today });
        res.status(200).json({ success: true, regimens });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markRegimenComplete = async (req, res) => {
    try {
        const { id } = req.params;
        const today = new Date().toISOString().split('T')[0];

        let regimen = await Regimen.findOne({ userId: req.user.userId, shiftId: id, date: today });

        if (!regimen) {
            regimen = await Regimen.create({
                userId: req.user.userId,
                shiftId: id,
                date: today,
                isCompleted: true
            });
        } else {
            regimen.isCompleted = true;
            await regimen.save();
        }

        res.status(200).json({ success: true, regimen });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
