import axiosInstance from '../utils/axiosInstance';

/**
 * Get notifications for a user
 * @param {string} userId - ID of the user
 * @param {Object} options - Optional query parameters
 * @returns {Promise<Object>} Notifications and pagination info
 */
export const getUserNotifications = async (userId, options = {}) =>
{
    try
    {
        const { read, type, limit, page } = options;
        const queryParams = new URLSearchParams();

        if (read !== undefined) queryParams.append('read', read);
        if (type) queryParams.append('type', type);
        if (limit) queryParams.append('limit', limit);
        if (page) queryParams.append('page', page);

        const response = await axiosInstance.get(`/notification/${ userId }?${ queryParams }`);
        return response.data;
    } catch (error)
    {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - ID of the notification
 * @returns {Promise<Object>} Updated notification
 */
export const markNotificationAsRead = async (notificationId) =>
{
    try
    {
        const response = await axiosInstance.patch(`/notification/${ notificationId }/read`);
        return response.data;
    } catch (error)
    {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

/**
 * Delete a specific notification
 * @param {string} notificationId - ID of the notification
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteNotification = async (notificationId) =>
{
    try
    {
        const response = await axiosInstance.delete(`/notification/${ notificationId }`);
        return response.data;
    } catch (error)
    {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

/**
 * Clear all notifications for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<Object>} Clearing confirmation
 */
export const clearAllNotifications = async (userId) =>
{
    try
    {
        const response = await axiosInstance.delete(`/notification/${ userId }/clear-all`);
        return response.data;
    } catch (error)
    {
        console.error('Error clearing notifications:', error);
        throw error;
    }
};