import axiosInstance from '../utils/axiosInstance';

/**
 * Create a potential match
 * @param {Object} matchData - Match creation data
 * @returns {Promise<Object>} Created match
 */
export const createPotentialMatch = async (matchData) =>
{
    try
    {
        const response = await axiosInstance.post('/match/create', matchData);
        return response.data;
    } catch (error)
    {
        console.error('Error creating potential match:', error);
        throw error;
    }
};

/**
 * Get match status between two users
 * @param {string} userId - ID of the first user
 * @param {string} targetUserId - ID of the second user
 * @returns {Promise<Object>} Match status
 */
export const getMatchStatus = async (userId, targetUserId) =>
{
    try
    {
        const response = await axiosInstance.get(`/match/match-status/${ userId }/${ targetUserId }`);
        return response.data;
    } catch (error)
    {
        console.error('Error fetching match status:', error);
        throw error;
    }
};

/**
 * Get all matches for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} List of matches
 */
export const getUserMatches = async (userId) =>
{
    try
    {
        const response = await axiosInstance.get(`/match/${ userId }/matches`);
        return response.data;
    } catch (error)
    {
        console.error('Error fetching user matches:', error);
        throw error;
    }
};

/**
 * Update match status
 * @param {string} matchId - ID of the match
 * @param {string} status - New status (Matched, Unmatched, etc.)
 * @returns {Promise<Object>} Updated match
 */
export const updateMatchStatus = async (matchId, status) =>
{
    try
    {
        const response = await axiosInstance.patch(`/match/${ matchId }/update`, { status });
        return response.data;
    } catch (error)
    {
        console.error('Error updating match status:', error);
        throw error;
    }
};

/**
 * Get potential matches for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<Array>} List of potential matches
 */
export const getPotentialMatches = async (userId) =>
{
    try
    {
        const response = await axiosInstance.get(`/match/${ userId }/potential-matches`);
        return response.data;
    } catch (error)
    {
        console.error('Error fetching potential matches:', error);
        throw error;
    }
};

export const createOrGetMatchApi = (userId) =>
{
    return axiosInstance.post('/match/create-or-get', { userId });
};

export const respondToMatchRequest = async (matchId, action) =>
{
    const response = await axiosInstance.post(`/match/respond`, {
        matchId,
        action,
    });
    return response.data;
};
