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

// @desc    Create hotel policy
// @route   POST /api/system/policy
// @access  Private
exports.createHotelPolicy = async (req, res) => {
    try {
        const { maxCapacity, domesticPolicy, foreignPolicy, surchargePolicy } = req.body;

        // Validate input
        if (!maxCapacity || !domesticPolicy || !foreignPolicy || !surchargePolicy) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const policy = new HotelPolicy({
            maxCapacity,
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

// @desc    Update a specific field in hotel policy
// @route   PUT /api/system/policy/field/:fieldName
// @access  Private
exports.updatePolicyField = async (req, res) => {
    try {
        const { fieldName } = req.params;
        const { fieldValue } = req.body;

        // Validate input
        if (!fieldName) {
            return res.status(400).json({ message: 'Field name is required in the URL parameter' });
        }
        
        if (fieldValue === undefined) {
            return res.status(400).json({ message: 'Field value is required in the request body' });
        }
        
        // Find the policy
        const policy = await HotelPolicy.findOne();
        
        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        // Check if fieldName exists in the policy
        if (policy[fieldName] === undefined) {
            return res.status(404).json({ 
                message: `Field '${fieldName}' does not exist in the policy. Use add-field API to create it first.` 
            });
        }

        // Record the old value to notify in the response
        const oldValue = policy[fieldName];
        
        // Create an object to update with the dynamic field name
        const updateObj = {};
        updateObj[fieldName] = fieldValue;
        
        // Update policy with the new value
        const updatedPolicy = await HotelPolicy.findByIdAndUpdate(
            policy._id,
            { $set: updateObj },
            { new: true }
        );

        res.status(200).json({
            message: `Field '${fieldName}' updated successfully`,
            oldValue: oldValue,
            newValue: fieldValue,
            policy: updatedPolicy
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset hotel policy to default values
// @route   DELETE /api/system/policy/reset
// @access  Private
exports.resetHotelPolicyToDefault = async (req, res) => {
    try {
        const defaultValues = {
            maxCapacity: 3,
            domesticPolicy: 1,
            foreignPolicy: 1.5,
            surchargePolicy: 0.25
        };

        // Find the current policy
        const existingPolicy = await HotelPolicy.findOne();
        
        if (!existingPolicy) {
            // If policy is not found, create a new one with default values
            const newPolicy = new HotelPolicy(defaultValues);
            await newPolicy.save();
            
            return res.status(201).json({ 
                message: 'New hotel policy created with default values',
                policy: newPolicy 
            });
        }
        
        // If policy is found, delete the current policy
        await HotelPolicy.findByIdAndDelete(existingPolicy._id);
        
        // Create a new policy with default values
        const newPolicy = new HotelPolicy(defaultValues);
        await newPolicy.save();
        
        res.status(200).json({ 
            message: 'Hotel policy reset to default values',
            previousId: existingPolicy._id,
            policy: newPolicy 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a custom field to hotel policy
// @route   POST /api/system/policy/add-field
// @access  Private
exports.addCustomField = async (req, res) => {
    try {
        console.log(req.body);
        const { fieldName, fieldValue } = req.body;

        // Validate input
        if (!fieldName || fieldValue === undefined) {
            return res.status(400).json({ message: 'Field name and value are required' });
        }

        // Find the policy and add the new field
        const policy = await HotelPolicy.findOne();
        
        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        // Check if the field already exists
        if (policy[fieldName] !== undefined) {
            return res.status(400).json({ 
                message: `Field '${fieldName}' already exists. Use update API instead.` 
            });
        }

        // Create an object to update with the dynamic field name
        const updateObj = {};
        updateObj[fieldName] = fieldValue;

        // Update the policy with the new field
        const updatedPolicy = await HotelPolicy.findByIdAndUpdate(
            policy._id,
            { $set: updateObj },
            { new: true }
        );

        res.status(200).json({ 
            message: `Field '${fieldName}' added successfully`,
            policy: updatedPolicy 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update multiple fields in hotel policy
// @route   PUT /api/system/policy/update-fields
// @access  Private
exports.updateMultipleFields = async (req, res) => {
    try {
        const updates = req.body;
        
        // Validate input
        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'At least one field to update is required' });
        }
        
        // Find the policy
        const policy = await HotelPolicy.findOne();
        
        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        // Check if all the fields to update exist
        const nonExistingFields = [];
        for (const fieldName of Object.keys(updates)) {
            if (policy[fieldName] === undefined) {
                nonExistingFields.push(fieldName);
            }
        }
        
        // If there are fields that do not exist, return an error
        if (nonExistingFields.length > 0) {
            return res.status(400).json({
                message: 'Some fields do not exist in the policy. Use add-field API to create them first.',
                nonExistingFields
            });
        }

        // Record the old values
        const oldValues = {};
        Object.keys(updates).forEach(fieldName => {
            oldValues[fieldName] = policy[fieldName];
        });
        
        // Update policy with the new values
        const updatedPolicy = await HotelPolicy.findByIdAndUpdate(
            policy._id,
            { $set: updates },
            { new: true }
        );

        res.status(200).json({
            message: `${Object.keys(updates).length} fields updated successfully`,
            oldValues,
            newValues: updates,
            policy: updatedPolicy
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a specific field from hotel policy
// @route   DELETE /api/system/policy/field/:fieldName
// @access  Private
exports.deletePolicyField = async (req, res) => {
    try {
        const { fieldName } = req.params;

        // Validate input
        if (!fieldName) {
            return res.status(400).json({ message: 'Field name is required in the URL parameter' });
        }
        
        // Find the policy
        const policy = await HotelPolicy.findOne();
        
        if (!policy) {
            return res.status(404).json({ message: 'Hotel policy not found' });
        }

        // Check if fieldName exists in the policy
        if (policy[fieldName] === undefined) {
            return res.status(404).json({ 
                message: `Field '${fieldName}' does not exist in the policy.`
            });
        }

        // Check if fieldName is a default field
        const defaultFields = ['maxCapacity', 'domesticPolicy', 'foreignPolicy', 'surchargePolicy', '_id', '__v'];
        if (defaultFields.includes(fieldName)) {
            return res.status(400).json({ 
                message: `Cannot delete default field '${fieldName}'.`,
                defaultFields: defaultFields.filter(field => field !== '_id' && field !== '__v')
            });
        }

        // Record the old value
        const oldValue = policy[fieldName];
        
        // Create an object to update to delete the field
        const updateObj = { $unset: {} };
        updateObj.$unset[fieldName] = 1;
        
        // Update policy by deleting the field
        const updatedPolicy = await HotelPolicy.findByIdAndUpdate(
            policy._id,
            updateObj,
            { new: true }
        );

        res.status(200).json({
            message: `Field '${fieldName}' deleted successfully`,
            deletedField: fieldName,
            deletedValue: oldValue,
            policy: updatedPolicy
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

