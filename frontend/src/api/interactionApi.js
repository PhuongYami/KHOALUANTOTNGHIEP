import axiosInstance from '../utils/axiosInstance'; // Assuming axiosInstance is configured for your API base URL

/**
 * Create a new interaction.
 * @param {Object} interactionData - Data for the interaction.
 * @param {string} interactionData.userFrom - ID of the user performing the action.
 * @param {string} interactionData.userTo - ID of the target user.
 * @param {string} interactionData.type - Type of interaction (Like, SuperLike, Dislike).
 * @returns {Promise<Object>} - The created interaction.
 */
export const createInteraction = async (interactionData) =>
{
    try
    {
        const response = await axiosInstance.post('/interaction', interactionData);
        return response.data;
    } catch (error)
    {
        console.error('Error creating interaction:', error);
        throw error;
    }
};

/**
 * Undo the last interaction.
 * @returns {Promise<Object>} - Confirmation of the undone interaction.
 */
export const undoLastInteraction = async (userId) =>
{
    try
    {
        const response = await axiosInstance.delete(`/interaction/undo/${ userId }`);
        return response.data;
    } catch (error)
    {
        console.error('Error undoing interaction:', error);
        throw error;
    }
};

/**
 * Get all interactions for a user.
 * @param {string} userId - ID of the user whose interactions are being retrieved.
 * @returns {Promise<Array>} - List of interactions.
 */
export const getInteractions = async (userId) =>
{
    try
    {
        const response = await axiosInstance.get(`/interaction/${ userId }`);
        return response.data;
    } catch (error)
    {
        console.error('Error fetching interactions:', error);
        throw error;
    }
};

/**
 * Get interactions between two users.
 * @param {string} userId - ID of the first user.
 * @param {string} targetUserId - ID of the second user.
 * @returns {Promise<Array>} - List of interactions between the two users.
 */
export const getInteractionsBetweenUsers = async (userId, targetUserId) =>
{
    try
    {
        const response = await axiosInstance.get(`/interaction/${ userId }/${ targetUserId }`);
        return response.data;
    } catch (error)
    {
        console.error('Error fetching interactions between users:', error);
        throw error;
    }
};
/**
 * Get profile views for a user.
 * @param {string} userId - ID of the target user.
 * @returns {Promise<number>} - Number of profile views.
 */
export const getProfileViews = async (userId) =>
{
    try
    {
        const response = await axiosInstance.get(`/interaction/profile-views/${ userId }`);
        return response.data.profileViews;
    } catch (error)
    {
        console.error('Error fetching profile views:', error);
        throw error;
    }
};