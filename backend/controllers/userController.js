const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// Get current user's information
exports.getCurrentUser = async (req, res) =>
{
    try
    {
        const user = await User.findById(req.user.id).populate('profile');
        if (!user)
        {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error)
    {
        res.status(500).json({
            success: false,
            message: 'Error retrieving user information.',
            error: error.message,
        });
    }
};

// Update current user's information
exports.updateUser = async (req, res) =>
{
    try
    {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        if (!user)
        {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error)
    {
        res.status(500).json({
            success: false,
            message: 'Error updating user information.',
            error: error.message,
        });
    }
};

// Get all users
exports.getAllUsers = async (req, res) =>
{
    try
    {
        const users = await User.find().populate('profile');
        res.status(200).json({ success: true, data: users });
    } catch (error)
    {
        res.status(500).json({
            success: false,
            message: 'Error retrieving users list.',
            error: error.message,
        });
    }
};

// Get user details by ID
exports.getUserById = async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('profile');
        if (!user)
        {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error)
    {
        res.status(500).json({
            success: false,
            message: 'Error retrieving user details.',
            error: error.message,
        });
    }
};

// Delete a user
exports.deleteUser = async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (!user)
        {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User successfully deleted.' });
    } catch (error)
    {
        res.status(500).json({
            success: false,
            message: 'Error deleting user.',
            error: error.message,
        });
    }
};

// Update current user's profile
exports.updateUserProfile = async (req, res) =>
{
    try
    {
        const updates = req.body;
        const user = await User.findById(req.user.id);
        if (!user)
        {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const profile = await UserProfile.findByIdAndUpdate(user.profile, updates, { new: true });
        if (!profile)
        {
            return res.status(404).json({ success: false, message: 'Profile not found.' });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (error)
    {
        res.status(500).json({
            success: false,
            message: 'Error updating profile.',
            error: error.message,
        });
    }
};
exports.changePassword = async (req, res) =>
{
    try
    {
        const { current_password, new_password } = req.body;

        // Validate inputs
        if (!current_password || !new_password)
        {
            return res.status(400).json({
                success: false,
                message: 'Current and new passwords are required.',
            });
        }

        // Find the user
        const user = await User.findById(req.user.id).select('+password');
        if (!user)
        {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }
        //console.log(user);

        // Verify current password
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch)
        {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect.',
            });
        }

        // Update password in database
        user.password = new_password;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
        });
    } catch (error)
    {
        res.status(500).json({
            success: false,
            message: 'Error changing passworddd.',
            error: error.message,
        });
    }
};
exports.getProfileCompleteness = async (req, res) =>
{
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId))
    {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try
    {
        const profile = await UserProfile.findOne({ userId });

        if (!profile)
        {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Define fields to check for completeness
        const fieldsToCheck = [
            'firstName', 'lastName', 'dateOfBirth', 'gender', 'bio', 'goals', 'relationshipStatus',
            'preferenceAgeRange.min', 'preferenceAgeRange.max', 'interestedIn', 'occupation',
            'education', 'location.city', 'location.country', 'photos', 'hobbies'
        ];

        // Count filled fields
        let filledFields = 0;

        fieldsToCheck.forEach(field =>
        {
            const fieldValue = field.split('.').reduce((obj, key) => obj && obj[key], profile);
            if (fieldValue && (Array.isArray(fieldValue) ? fieldValue.length > 0 : true))
            {
                filledFields++;
            }
        });

        // Calculate completeness percentage
        const completeness = Math.round((filledFields / fieldsToCheck.length) * 100);

        res.status(200).json({ completeness });
    } catch (error)
    {
        console.error('Error calculating profile completeness:', error);
        res.status(500).json({ message: 'Failed to calculate profile completeness', error: error.message });
    }
};