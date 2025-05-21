const mongoose = require('mongoose');
const HotelPolicy = require('../models/hotelPolicy');

// @desc    Get hotel policy
// @route   GET /api/system/policy
// @access  Private
exports.getHotelPolicy = async (req, res) => {
    try {
        const policy = await HotelPolicy.findOne();
        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }
        res.status(200).json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update hotel policy
// @route   PUT /api/system/policy
// @access  Private
exports.updateHotelPolicy = async (req, res) => {
    try {
        const { maxUser, domesticPolicy, foreignPolicy, surchargePolicy } = req.body;

        // Validate input
        if (!maxUser || !domesticPolicy || !foreignPolicy || !surchargePolicy) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const policy = await HotelPolicy.findOneAndUpdate(
            {},
            { maxUser, domesticPolicy, foreignPolicy, surchargePolicy },
            { new: true }
        );

        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        res.status(200).json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Create hotel policy
// @route   POST /api/system/policy
// @access  Private
exports.createHotelPolicy = async (req, res) => {
    try {
        const { maxUser, domesticPolicy, foreignPolicy, surchargePolicy } = req.body;

        // Validate input
        if (!maxUser || !domesticPolicy || !foreignPolicy || !surchargePolicy) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const policy = new HotelPolicy({
            maxUser,
            domesticPolicy,
            foreignPolicy,
            surchargePolicy
        });

        await policy.save();
        res.status(201).json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete hotel policy
// @route   DELETE /api/system/policy
// @access  Private
exports.deleteHotelPolicy = async (req, res) => {
    try {
        const policy = await HotelPolicy.findOneAndDelete();
        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }
        res.status(200).json({ message: 'Hotel policy deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get hotel policy by ID
// @route   GET /api/system/policy/:id
// @access  Private
exports.getHotelPolicyById = async (req, res) => {
    try {
        const policy = await HotelPolicy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }
        res.status(200).json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update hotel policy by ID
// @route   PUT /api/system/policy/:id
// @access  Private
exports.updateHotelPolicyById = async (req, res) => {
    try {
        const { maxUser, domesticPolicy, foreignPolicy, surchargePolicy } = req.body;

        // Validate input
        if (!maxUser || !domesticPolicy || !foreignPolicy || !surchargePolicy) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const policy = await HotelPolicy.findByIdAndUpdate(
            req.params.id,
            { maxUser, domesticPolicy, foreignPolicy, surchargePolicy },
            { new: true }
        );

        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        res.status(200).json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Partially update hotel policy
// @route   PATCH /api/system/policy/:id
// @access  Private
exports.partialUpdatePolicy = async (req, res) => {
    try {
        const updates = req.body;
        
        // Validate that at least one field is provided
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No update fields provided' });
        }
        
        // Validate that only valid fields are being updated
        const validFields = ['maxUser', 'domesticPolicy', 'foreignPolicy', 'surchargePolicy'];
        const invalidFields = Object.keys(updates).filter(field => !validFields.includes(field));
        
        if (invalidFields.length > 0) {
            return res.status(400).json({ 
                message: 'Invalid fields provided', 
                invalidFields 
            });
        }

        const policy = await HotelPolicy.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        res.status(200).json(policy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset hotel policy to default values
// @route   PUT /api/system/policy/:id/reset
// @access  Private
exports.resetHotelPolicyToDefault = async (req, res) => {
    try {
        const defaultValues = {
            maxUser: 3,
            domesticPolicy: 1,
            foreignPolicy: 1.5,
            surchargePolicy: 0.25
        };

        const policy = await HotelPolicy.findByIdAndUpdate(
            req.params.id,
            defaultValues,
            { new: true }
        );

        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        res.status(200).json({ 
            message: 'Hotel policy reset to default values',
            policy 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};