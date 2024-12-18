import axiosInstance from '../utils/axiosInstance';

/**
 * Fetch basic search results.
 * @param {string} userId - The user ID making the request.
 * @param {Object} filters - Filters to apply to the search.
 * @returns {Promise} - A promise resolving to search results.
 */
export const fetchBasicSearch = async (userId, filters = {}) =>
{
    try
    {
        const response = await axiosInstance.get(`/search/basic`, {
            params: {
                userId,
                filters: JSON.stringify(filters),
            },
        });
        return response.data;
    } catch (error)
    {
        console.error('Error fetching basic search results:', error);
        throw error;
    }
};

/**
 * Fetch advanced search results.
 * @param {string} userId - The user ID making the request.
 * @param {Object} filters - Advanced filters to apply to the search.
 * @returns {Promise} - A promise resolving to advanced search results.
 */
export const fetchAdvancedSearch = async (userId, filters = {}) =>
{
    try
    {
        const response = await axiosInstance.post(`search/advanced`, {
            userId,
            filters,
        });
        return response.data;
    } catch (error)
    {
        console.error('Error fetching advanced search results:', error);
        throw error;
    }
};

/**
 * Fetch recommended profiles.
 * @param {string} userId - The user ID making the request.
 * @param {number} [limit=10] - Maximum number of recommendations to fetch.
 * @param {number} [page=1] - Page number for paginated results.
 * @returns {Promise} - A promise resolving to recommended profiles.
 */
export const fetchRecommendations = async (userId, limit, page) =>
{
    try
    {
        const response = await axiosInstance.get(`search/recommendations`, {
            params: {
                userId,
                limit,
                page
            },
        });
        return response.data;
    } catch (error)
    {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};
